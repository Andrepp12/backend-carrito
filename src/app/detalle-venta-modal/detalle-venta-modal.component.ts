import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-venta-modal',
  templateUrl: './detalle-venta-modal.component.html',
  styleUrls: ['./detalle-venta-modal.component.scss'],
})
export class DetalleVentaModalComponent {
  @Input() detalles: any[] = []; // Recibir los detalles de la venta

  constructor(private modalController: ModalController) {}

  // Cerrar el modal
  cerrarModal() {
    this.modalController.dismiss();
  }
}
