import { Component, ElementRef, inject, Input, signal, ViewChild } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { PedidosService } from '../../../../shared/models/pedidos/services/pedidos.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../../../shared/models/pedidos/entities/Pedido.interface';
import { OverlayModule } from '@angular/cdk/overlay';
import { Dialog } from '@angular/cdk/dialog';
import { EditarDireccionComponent } from '../../../components/editarDireccion/editarDireccion.component';
import { get } from 'http';
import { RegistrarPagoComponent } from '../../../components/RegistrarPago/RegistrarPago.component';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../../shared/models/product/services/cart.service';
import { MensajeService } from '../../../../shared/mensaje/mensaje.service';
import { UpdatePedidoDto } from '../../../../shared/models/pedidos/dto/UpdatePedidoDto';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InstanceOptions, Modal, ModalOptions } from 'flowbite';
import { CreateReembolsoDto } from '../../../../shared/models/reembolsos/dto/CreateReembolso';
import { paylod } from '../../../../shared/models/paylod';
import { jwtDecode } from 'jwt-decode';
import { ReembolsoService } from '../../../../shared/models/reembolsos/services/Reembolso.service';
import { APIResponse } from '../../../../shared/models/response';

@Component({
  selector: 'app-detail-order',
  standalone: true,
  imports: [CommonModule, OverlayModule, RouterLink, ReactiveFormsModule],
  templateUrl: './detail-order.component.html',
  styleUrl: './detail-order.component.css'
})
export class DetailOrderComponent {

  private formBuilder = inject(FormBuilder);
  private pedidosService = inject(PedidosService);
  private reembolsoService = inject(ReembolsoService);
  private cookieService = inject(CookieService);
  private dialog = inject(Dialog);
  private mensaje = inject(MensajeService);
  public shipment = inject(CartService).getShipment();

  @Input() id?: number;
  pedido = signal<Pedido | null>(null);

  token?: string;

  baseUrl = environment.urlServices + 'uploads/';

  /* ButtonModal */
  @ViewChild('buttonModal', { read: ElementRef })
  public buttonModal: ElementRef<HTMLButtonElement>;

  /* Modal */
  @ViewChild('formModal', { read: ElementRef })
  public modal: ElementRef<HTMLDivElement>;

  /* FormModal */
  private formModal: Modal;

  /* Formulario */
  public formReembolso: FormGroup = this.formBuilder.group({
    detalles: ['', Validators.required],
    bancoDestino: ['', Validators.required],
    cuentaBancaria: ['', Validators.required],
  });

  ngOnInit() {
    this.token = this.cookieService.get(environment.nombreCookieToken);
    this.getPedido();

    setTimeout(() => {
      this.inicializarFormModal();
    });
  }

  /* Inicializar FormModal */
  private inicializarFormModal(): void {
    const options: ModalOptions = {
      placement: 'center',
      backdrop: 'dynamic',
      closable: true,
      onHide: () => {
        this.formReembolso.reset();
      }
    };

    const instanceOptions: InstanceOptions = {
      id: 'formModal',
      override: true
    }

    this.formModal = new Modal(this.modal.nativeElement, options, instanceOptions);
    this.buttonModal.nativeElement.addEventListener('click', () => this.formModal.show());
  }

  closeModal() {
    this.formModal.hide();
  }

  getPedido() {
    if (this.id) {
      this.pedidosService.findOne(this.id, this.token)
        .subscribe({
          next: (dato: APIResponse<Pedido>) => {
            let pedido = dato.data;
            console.log(pedido);

            // pedido.valorPagado = Number(dato.valorPagado);
            pedido.valorPagado = +pedido.valorPagado;
            // pedido.valorTotal = Number(dato.valorTotal);
            pedido.valorTotal = +pedido.valorTotal;
            this.pedido.set(pedido);
          }
        }
        );
    }
  }

  terminarPedido() {
    Swal.fire({
      title: '¿Está seguro de terminar el pedido?',
      text: 'Una vez terminado el pedido no se podrá modificar',
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Terminar Pedido",
      confirmButtonColor: "#490D0B",
      denyButtonText: `Cancelar`,
      denyButtonColor: "#C69D75",
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateEstadoPedido('Terminado');
        this.mensaje.toastMessage('Pedido Terminado','success','bottom-end',3000);
      }
    });
  }

  procesarPedido() {
    Swal.fire({
      title: 'Procesar pedido',
      text: 'El pedido cambiará a estado "En Proceso"',
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Continuar",
      confirmButtonColor: "#490D0B",
      denyButtonText: `Cancelar`,
      denyButtonColor: "#C69D75",
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateEstadoPedido('En Proceso');
        this.mensaje.toastMessage('Pedido en proceso','success','bottom-end',3000);
      }
    });
  }


  updateEstadoPedido(estado: string) {
    this.pedidosService.updateEstadoPedido(this.pedido()?.idPedido, estado, this.token).subscribe({
      next: (res) => {
        this.getPedido();
      },
      error: (err) => {
        this.mensaje.showMessage('Error', `${err.error.message}`, 'error');
      }
    });
  }

  /* 
  * Método para abrir el diálogo de editar dirección.
  */
  openDialog(): void {
    const dialogRef = this.dialog.open<string>(EditarDireccionComponent, {
      width: '250px',
      data: this.pedido(),
    });

    dialogRef.closed.subscribe(result => {
      /*
      *   Si el diálogo al cerrar retorna 'recargarPedido' se recarga el pedido, 
      *   de lo contrario no.
      */
      if (result === 'recargarPedido') {
        this.getPedido();
      }
    });
  }
  /* 
  * Método para abrir el diálogo de registrar pago.
  */
  openDialogPagos(): void {
    const dialogRef = this.dialog.open<string>(RegistrarPagoComponent, {
      width: '250px',
      data: this.pedido(),
    });

    dialogRef.closed.subscribe(result => {
      /*Si el diálogo al cerrar retorna 'pagoAgreado' se agrega un pago, 
         de lo contrario no.
      */
      if (result === 'PagoAgregado') {
        this.getPedido();
      }
    });
  }

  
  enviarFormulario(): void {
    const { detalles, bancoDestino, cuentaBancaria } = this.formReembolso.value;
    if (this.formReembolso.valid) {
      const createReembolsoDto: CreateReembolsoDto = { idPedido: this.pedido()?.idPedido, valorReembolso: 0, detalles, bancoDestino, cuentaBancaria, estado: 'Pendiente' };
      this.reembolsoService.create(createReembolsoDto, this.token).subscribe({
        next: (res) => {
          this.mensaje.showMessage('Reembolso creado', 'El reembolso será procesado por el administrador y dará una pronta respuesta.', 'success');
          this.updateEstadoPedido('Incidencia');
          this.formReembolso.reset();
          this.formModal.hide();
        },
        error: (err) => {
          this.mensaje.showMessage('Error', `Ha ocurrido un error al enviar el reembolso: ${err.error.message}`, 'error');
        }
      });
    }
  }
}
