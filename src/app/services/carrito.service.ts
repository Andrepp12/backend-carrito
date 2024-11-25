import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private carritoKey = 'carrito'; // Clave para localStorage

  constructor() {}

  // Obtener los productos del carrito
  getCarrito(): any[] {
    const carrito = localStorage.getItem(this.carritoKey);
    return carrito ? JSON.parse(carrito) : [];
  }

  // Agregar un producto al carrito
  addToCarrito(producto: any, cantidad: number): void {
    const carrito = this.getCarrito();
  
    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find((item) => item.producto_id === producto.id);
  
    if (productoExistente) {
      // Validar que la cantidad total no exceda el stock
      const cantidadTotal = productoExistente.cantidad + cantidad;
      if (cantidadTotal > producto.stock) {
        alert(`No puedes agregar más de ${producto.stock} unidades de "${producto.nombre}".`);
        return;
      }
  
      // Actualizar la cantidad
      productoExistente.cantidad += cantidad;
    } else {
      // Validar que la cantidad inicial no exceda el stock
      if (cantidad > producto.stock) {
        alert(`No puedes agregar más de ${producto.stock} unidades de "${producto.nombre}".`);
        return;
      }
  
      // Agregar nuevo producto al carrito
      carrito.push({
        producto_id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad,
        imagen: producto.imagen,
      });
    }
  
    // Guardar el carrito actualizado
    localStorage.setItem(this.carritoKey, JSON.stringify(carrito));
  }
  

  // Eliminar un producto del carrito
  removeFromCarrito(productoId: number): void {
    const carrito = this.getCarrito();
    const carritoActualizado = carrito.filter((item) => item.producto_id !== productoId);

    localStorage.setItem(this.carritoKey, JSON.stringify(carritoActualizado));
  }

  // Vaciar el carrito
  clearCarrito(): void {
    localStorage.removeItem(this.carritoKey);
  }
}
