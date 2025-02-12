import { inject, Injectable } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  private route = inject(Router);

  constructor() { }

  showMessage(titulo: string, text: string, icon: string) {
    switch (icon) {
      case 'success':
        Swal.fire({
          title: titulo,
          text: `${text}`,
          icon: 'success',
          confirmButtonColor: "#C69D75",
          confirmButtonText: "Aceptar"
        });
        break;
      case 'error':
        Swal.fire({
          title: titulo,
          text: `${text}`,
          icon: 'error',
          confirmButtonColor: "#C69D75",
          confirmButtonText: "Aceptar"
        });
        break;
      case 'warning':
        Swal.fire({
          title: titulo,
          text: `${text}`,
          icon: 'warning',
          confirmButtonColor: "#C69D75",
          confirmButtonText: "Aceptar"
        });
        break;
      case 'info':
        Swal.fire({
          title: titulo,
          text: `${text}`,
          icon: 'info',
          confirmButtonColor: "#C69D75",
          confirmButtonText: "Aceptar"
        });
        break;
      case 'question':
        Swal.fire({
          title: titulo,
          text: `${text}`,
          icon: 'question',
          confirmButtonColor: "#C69D75",
        });
        break
    }
  }

  toastMessage(title: string, icon: any, position: any, timer: number) {
    const Toast = Swal.mixin({
      toast: true,
      position: position,
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: icon ,
      title: `${title}`
    });
  }

  showClientValidate(){
    Swal.fire({
      title: "Información del cliente",
      icon: "info",
      text: "Antes de proceder al pedido, registre nuevo cliente",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Registrar",
      confirmButtonColor: "#C69D75",
      denyButtonText: `Ya ha comprado antes`,
      denyButtonColor: "##F0CD98",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        // Swal.fire("Saved!", "", "success");
        this.route.navigate(['/administrador/addclients']);
      } else if (result.isDenied) {
        this.route.navigate(['/vendedor/order-register']);
        // Swal.fire("Changes are not saved", "", "info");
      }
    });
  }



}
