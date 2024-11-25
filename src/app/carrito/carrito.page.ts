import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CarritoService } from '../services/carrito.service';
import { ToastController } from '@ionic/angular';
import { SessionService } from '../services/session.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  carrito: any[] = [];
  clienteId: number = 1;

  constructor(private carritoService: CarritoService,
    private http: HttpClient,
    private toastController: ToastController, private navCtrl: NavController,private sessionService: SessionService) {}

  ngOnInit() {
    this.loadCarrito();
  }

  logout() {
    // Llama al endpoint de logout en el backend
    // Limpiar los datos del usuario
    this.sessionService.clearUserData();

    // Navegar al login
    this.navCtrl.navigateRoot('/login');
  }

  // Cargar los productos del carrito
  loadCarrito() {
    this.carrito = this.carritoService.getCarrito();
  }

  // Eliminar un producto del carrito
  removeProducto(productoId: number) {
    this.carritoService.removeFromCarrito(productoId);
    this.loadCarrito(); // Recargar el carrito
  }

  // Vaciar el carrito
  clearCarrito() {
    this.carritoService.clearCarrito();
    this.carrito = []; // Actualizar la vista
  }
  async comprar() {
    if (this.carrito.length === 0) {
      this.showToast('El carrito está vacío. Agrega productos antes de comprar.', 'warning');
      return;
    }
  
    try {
      const venta = await this.createVenta();
      console.log(venta)
  
      if (!venta) {
        this.showToast('Error al crear la venta. Inténtalo nuevamente.', 'danger');
        return;
      }
      
      await this.createDetallesVenta(venta);
  
      // Limpiar el carrito
      this.carritoService.clearCarrito();
      this.loadCarrito();
  
      this.showToast('Compra realizada con éxito.', 'success');
    } catch (error) {
      console.error('Error al realizar la compra:', error);
      this.showToast('Error al realizar la compra. Inténtalo nuevamente.', 'danger');
    }
  }

  private async createVenta(): Promise<number  | undefined> {
    const ventaData = {
      cliente_id: this.clienteId,
      total: this.calculateTotal(),
      fecha: new Date().toISOString().slice(0, 10), // Fecha actual
    };
  
    try {
      console.log(ventaData);
      const response: any = await this.http
      .post('http://127.0.0.1:8000/api/ventas', ventaData)
      .toPromise();

      console.log('Respuesta:', response);
      console.log(response?.data?.id);
      // Devuelve el ID de la venta desde "response.data"
      return response?.data?.id;
    } catch (error) {
      console.error('Error al crear la venta:', error);
      return undefined; // Handle the error case
    }
  }

  private async createDetallesVenta(ventaId: number): Promise<void> {
    for (const producto of this.carrito) {
      const detalleData = {
        venta_id: ventaId,
        producto_id: producto.producto_id,
        cantidad: producto.cantidad,
        precio_unitario: producto.precio,
        subtotal: producto.precio * producto.cantidad,
        estado: 1,
      };
  
      try {
        // Step 1: Create the sale detail
        await this.http.post('http://127.0.0.1:8000/api/detalle-ventas', detalleData).toPromise();
  
        // Step 2: Fetch the current stock of the product
        const productData: any = await this.http
          .get(`http://127.0.0.1:8000/api/productos/${producto.producto_id}`)
          .toPromise();
  
        const currentStock = productData.stock;
  
        // Step 3: Calculate the new stock
        const newStock = currentStock - producto.cantidad;
  
        if (newStock < 0) {
          throw new Error(`Stock insuficiente para el producto: ${producto.nombre}`);
        }
  
        // Step 4: Update the product stock
        await this.http
          .put(`http://127.0.0.1:8000/api/productos/${producto.producto_id}`, {
            stock: newStock,
          })
          .toPromise();
      } catch (error) {
        console.error('Error al crear detalle de venta o actualizar stock:', error);
        throw new Error('No se pudo crear el detalle de la venta o actualizar el stock.');
      }
    }
  }
  

  private calculateTotal(): number {
    return this.carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
  }

  private async showToast(message: string, color: string) {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.color = color;
    toast.duration = 2000;
    toast.position = 'bottom';

    document.body.appendChild(toast);
    await toast.present();
  }
}
