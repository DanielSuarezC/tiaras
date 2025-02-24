import { Injectable, signal } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  public confirmacion = signal<boolean>(false);

  constructor() { }

  showMessage(titulo: string, text: string, icon: any) {
    Swal.fire({
      title: titulo,
      text: text,
      icon: icon,
      confirmButtonColor: "#C69D75",
      confirmButtonText: "Aceptar"
    });
    // switch (icon) {
    //   case 'success':
    //     Swal.fire({
    //       title: titulo,
    //       text: `${text}`,
    //       icon: 'success',
    //       confirmButtonColor: "#C69D75",
    //       confirmButtonText: "Aceptar"
    //     });
    //     break;
    //   case 'error':
    //     Swal.fire({
    //       title: titulo,
    //       text: `${text}`,
    //       icon: 'error',
    //       confirmButtonColor: "#C69D75",
    //       confirmButtonText: "Aceptar"
    //     });
    //     break;
    //   case 'warning':
    //     Swal.fire({
    //       title: titulo,
    //       text: `${text}`,
    //       icon: 'warning',
    //       confirmButtonColor: "#C69D75",
    //       confirmButtonText: "Aceptar"
    //     });
    //     break;
    //   case 'info':
    //     Swal.fire({
    //       title: titulo,
    //       text: `${text}`,
    //       icon: 'info',
    //       confirmButtonColor: "#C69D75",
    //       confirmButtonText: "Aceptar"
    //     });
    //     break;
    //   case 'question':
    //     Swal.fire({
    //       title: titulo,
    //       text: `${text}`,
    //       icon: 'question',
    //       confirmButtonColor: "#C69D75",
    //     });
    //     break
    // }
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
}
