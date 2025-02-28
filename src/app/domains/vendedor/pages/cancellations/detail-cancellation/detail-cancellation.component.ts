import { Component, ElementRef, inject, Input, signal, ViewChild } from '@angular/core';
import { ReembolsoService } from '../../../../shared/models/reembolsos/services/Reembolso.service';
import { CookieService } from 'ngx-cookie-service';
import { MensajeService } from '../../../../shared/mensaje/mensaje.service';
import { Reembolso } from '../../../../shared/models/reembolsos/entities/Reembolso';
import { environment } from '../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { InstanceOptions, Modal, ModalOptions } from 'flowbite';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-detail-cancellation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './detail-cancellation.component.html',
  styleUrl: './detail-cancellation.component.css'
})
export class DetailCancellationComponent {

  private reembolsoService = inject(ReembolsoService);
  private cookieService = inject(CookieService);
  private mensaje = inject(MensajeService);

  @Input() id?: number;
  reembolso = signal<Reembolso | null>(null);

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
  formReembolso = new FormGroup({
    valorReembolso: new FormControl('valorReembolso', Validators.required),
  });

  ngOnInit() {
    this.token = this.cookieService.get(environment.nombreCookieToken);
    this.getReembolso();

    setTimeout(() => {
      this.inicializarFormModal();
    });
  }

  /* Inicializar FormModal */
  private inicializarFormModal(): void {
    // if (!this.modal || !this.modal.nativeElement || !this.buttonModal || !this.buttonModal.nativeElement) {
    //   console.error('No se pudo inicializar el modal porque ViewChild no está disponible.');
    //   return;
    // }

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
    };

    this.formModal = new Modal(this.modal.nativeElement, options, instanceOptions);
    this.buttonModal.nativeElement.addEventListener('click', () => this.formModal.show());
  }

  closeModal() {
    this.formModal.hide();
  }

  getReembolso() {
    if (this.id) {
      this.reembolsoService.findOne(this.id, this.token)
        .subscribe({
          next: (dato: any) => {
            this.reembolso.set(dato);
          }
        }
        );
    }
  }

  /*
   * Método para rechazar un reembolso 
   */
  rechazarReembolso() {
    Swal.fire({
      title: '¿Está seguro de rechazar el reembolso?',
      text: 'Una vez rechazado no podrá ser revertido',
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Rechazar",
      confirmButtonColor: "#490D0B",
      denyButtonText: `Cancelar`,
      denyButtonColor: "#C69D75",
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateEstado('Rechazado');
        this.mensaje.toastMessage('Reembolso rechazado', 'success', 'bottom-end', 3000);
      }
    });
  }

  /*
   * Método para aprobar un reembolso
   */
  aprobarReembolso() {
    Swal.fire({
      title: 'Aprobación de reembolso',
      text: 'El reembolso se aprobará y se procederá con el proceso de reembolso',
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Continuar",
      confirmButtonColor: "#490D0B",
      denyButtonText: `Cancelar`,
      denyButtonColor: "#C69D75",
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateEstado('Aprobado');
        this.mensaje.toastMessage('Reembolso aprobado', 'success', 'bottom-end', 3000);
      }
    });
  }

  /* 
   * Actualizar el estado de reembolso a Aprobado o Rechazado 
   */
  updateEstado(estado: string) {
    this.reembolsoService.updateEstado(this.reembolso()?.idReembolso, estado, this.token).subscribe({
      next: (res) => {
        this.getReembolso();
      },
      error: (err) => {
        this.mensaje.showMessage('Error', `${err.error.message}`, 'error');
      }
    });
  }

  /* 
   * Actualizar el valor del reembolso
   */
  enviarFormulario(): void {
    const valorReembolso = +this.formReembolso.get('valorReembolso')?.value;
    if (this.formReembolso.valid) {
      this.reembolsoService.updateValorReembolso(this.reembolso().idReembolso, valorReembolso, this.token).subscribe({
        next: (res) => {
          this.mensaje.toastMessage('Valor agregado', 'success', 'bottom-end', 3000);
          this.formReembolso.reset();
          this.formModal.hide();
          this.getReembolso();
        },
        error: (err) => {
          this.mensaje.showMessage('Error', `Ha ocurrido un error al enviar el reembolso: ${err.error.message}`, 'error');
        }
      });
    }
  }
}
