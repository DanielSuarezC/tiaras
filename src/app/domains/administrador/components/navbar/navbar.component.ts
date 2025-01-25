import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {OverlayModule} from '@angular/cdk/overlay';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive,OverlayModule],
  templateUrl: './navbar.component.html',
  
})
export class NavbarComponent {
  isOpenAccount = false;
  isOpenMenuMovil = false;
}
