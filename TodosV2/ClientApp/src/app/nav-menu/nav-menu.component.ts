import { Component } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  constructor(private auth: AuthService, private router: Router) { }

  isExpanded = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  IsLogged() {
    return this.auth.checkLogin();
  }

  onLogout() {
    sessionStorage.clear();
    this.router.navigate(["login"]);
  }
}
