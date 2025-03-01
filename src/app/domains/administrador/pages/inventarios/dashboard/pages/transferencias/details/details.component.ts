import { Component, Input, OnInit } from '@angular/core';
import { TransferenciasService } from '../../../../../../../shared/models/transferencias/services/transferencias.service';
import { CommonModule } from '@angular/common';
import { TransferenciaInsumos } from '../../../../../../../shared/models/transferencias/entities/transferencia-insumos.entity';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../../../../../environments/environment';

@Component({
  selector: 'transferencia-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styles: ``
})
export class TransferenciaDetailsComponent implements OnInit {
  @Input()
  public idTransferencia: number;

  public transferencia: TransferenciaInsumos;
  private token: string;

  constructor(
    private transferenciasService: TransferenciasService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.token = this.cookieService.get(environment.nombreCookieToken);
    this.getTransferencia();
  }

  private getTransferencia() {
    this.transferenciasService.findOneTI(this.token, this.idTransferencia).subscribe((data) => {
      this.transferencia = data;
    });
  }
}
