import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  public userName;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.checkLogin) {
      this.authService.getUserNameHome$().subscribe(result => {
        console.log(result);
        this.userName = result.data.userName;
      })
    } else {
        this.userName = undefined;
    }
  }
}
