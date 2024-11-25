import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../services/session.service';
import { CarritoService } from '../services/carrito.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  productos: any[] = [];
  categorias: any[] = [];
  productoForm!: FormGroup;
  showForm: boolean = false; // Flag para alternar entre lista y formulario
  editMode: boolean = false; // Flag para saber si estamos editando
  editId: number | null = null; // ID del producto a editar
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private carritoService: CarritoService,private alertController: AlertController, private navCtrl: NavController,private sessionService: SessionService) {}

  ngOnInit() {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: [''],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      categoria_id: ['', [Validators.required]],
    });

    this.loadProductos();
    this.loadCategorias();
  }

  loadProductos() {
    this.http.get('http://127.0.0.1:8000/api/productos').subscribe((data: any) => {
      this.productos = data;
    });
  }

  loadCategorias() {
    this.http.get('http://127.0.0.1:8000/api/categorias').subscribe((data: any) => {
      this.categorias = data;
    });
  }

  logout() {
    // Llama al endpoint de logout en el backend
    // Limpiar los datos del usuario
    this.sessionService.clearUserData();

    // Navegar al login
    this.navCtrl.navigateRoot('/login');
  }

  async promptCantidad(producto: any) {
    const alert = await this.alertController.create({
      header: 'Agregar al Carrito',
      message: `¿Cuántos "${producto.nombre}" deseas agregar?`,
      inputs: [
        {
          name: 'cantidad',
          type: 'number',
          placeholder: 'Cantidad',
          min: 1,
          max: producto.stock,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Agregar',
          handler: (data) => {
            const cantidad = parseInt(data.cantidad, 10);
  
            if (isNaN(cantidad) || cantidad <= 0 || cantidad > producto.stock) {
              this.showErrorAlert('Cantidad inválida', `La cantidad debe estar entre 1 y ${producto.stock}.`);
              return false; // Prevent the alert from closing
            }
  
            this.carritoService.addToCarrito(producto, cantidad);
            this.showSuccessToast(`Se agregaron ${cantidad} "${producto.nombre}" al carrito.`);
            return undefined; // Allow the alert to close
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  async showErrorAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
  
    await alert.present();
  }
  
  async showSuccessToast(message: string) {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.duration = 2000;
    toast.position = 'bottom';
  
    document.body.appendChild(toast);
    await toast.present();
  }
  
  

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('Archivo seleccionado:', this.selectedFile);
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  // Agregar un producto al carrito
  addToCarrito(producto: any) {
    this.carritoService.addToCarrito(producto, 1);
    alert('Producto agregado al carrito');
  }
  
  saveProducto() {
    const productoData = this.productoForm.value;

    // Si hay un archivo seleccionado, usa FormData para enviarlo
    if (this.selectedFile) {
      const formData = new FormData();
      Object.keys(productoData).forEach((key) => formData.append(key, productoData[key]));
      formData.append('imagen', this.selectedFile);

      if (this.editMode && this.editId) {
        this.http.post(`http://127.0.0.1:8000/api/productos/${this.editId}`, formData).subscribe({
          next: () => {
            alert('Producto actualizado con éxito');
            this.loadProductos();
            this.toggleForm();
          },
          error: () => alert('Error al actualizar producto'),
        });
      } else {
        this.http.post('http://127.0.0.1:8000/api/productos', formData).subscribe({
          next: () => {
            alert('Producto agregado con éxito');
            this.loadProductos();
            this.toggleForm();
          },
          error: () => alert('Error al agregar producto'),
        });
      }
    } else {
      // Manejo cuando no hay archivo seleccionado (opcional)
      alert('Por favor selecciona una imagen antes de guardar.');
    }
  }

  editProducto(producto: any) {
    this.showForm = true;
    this.editMode = true;
    this.editId = producto.id;
    this.productoForm.patchValue(producto);
  }

  deleteProducto(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.http.delete(`http://127.0.0.1:8000/api/productos/${id}`).subscribe({
        next: () => {
          alert('Producto eliminado con éxito');
          this.loadProductos();
        },
        error: () => alert('Error al eliminar producto'),
      });
    }
  }

  resetForm() {
    this.productoForm.reset();
    this.editMode = false;
    this.editId = null;
  }
}
