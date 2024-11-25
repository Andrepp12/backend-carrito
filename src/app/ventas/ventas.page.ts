import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../services/session.service';
import { ModalController } from '@ionic/angular';
import { DetalleVentaModalComponent } from '../detalle-venta-modal/detalle-venta-modal.component';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage implements OnInit {
  ventas: any[] = []; // Lista de ventas
  clienteId = 1; // Cambia este valor dinámicamente según el usuario autenticado

  constructor(private http: HttpClient, private navCtrl: NavController,private sessionService: SessionService, private modalController: ModalController) {}

  ngOnInit() {
    this.cargarVentas();
  }

  // Cargar ventas del cliente
  cargarVentas() {
    this.http
      .get(`http://127.0.0.1:8000/api/clientes/${this.clienteId}/ventas`)
      .subscribe((response: any) => {
        this.ventas = response;
      });
  }

  // Mostrar detalles de una venta específica
  async verDetalles(ventaId: number) {
    this.http
      .get(`http://127.0.0.1:8000/api/ventas/${ventaId}/detalles`)
      .subscribe(async (response: any) => {
        // Crear y abrir el modal con los detalles
        const modal = await this.modalController.create({
          component: DetalleVentaModalComponent,
          componentProps: { detalles: response }, // Pasar los detalles al modal
        });
        await modal.present();
      });
  }

  logout() {
    // Llama al endpoint de logout en el backend
    // Limpiar los datos del usuario
    this.sessionService.clearUserData();

    // Navegar al login
    this.navCtrl.navigateRoot('/login');
  }
}
