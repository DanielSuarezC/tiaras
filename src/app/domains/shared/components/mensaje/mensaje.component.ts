import {Component, inject} from '@angular/core';
import {Dialog, DialogRef, DIALOG_DATA, DialogModule} from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { BtnComponent } from '../btn/btn.component';


@Component({
  selector: 'app-mensaje',
  standalone: true,
  imports: [CommonModule,DialogModule, BtnComponent],
  templateUrl: './mensaje.component.html',
  styleUrl: './mensaje.component.css'
})
export class MensajeComponent {

  dialogRef = inject<DialogRef<string>>(DialogRef<string>);
  data = inject(DIALOG_DATA);
  
  titulo?: string;
  mensaje?: string;
  textoBoton?: string;

  ngOnInit(): void {
    this.titulo = this.data.titulo;
    this.mensaje = this.data.mensaje;
    this.textoBoton = this.data.textoBoton;
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
