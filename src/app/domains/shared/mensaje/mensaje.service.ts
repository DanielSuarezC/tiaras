import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

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

}
