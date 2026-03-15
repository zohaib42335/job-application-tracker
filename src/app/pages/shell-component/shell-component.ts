import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-shell-component',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell-component.html',
  styleUrl: './shell-component.css',
})
export class ShellComponent {
   menuOpen = false;
  readonly year = new Date().getFullYear();
  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu()  { this.menuOpen = false; }

}
