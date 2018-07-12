import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../services/auth.service";
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy{
  private userName: string;
  private password: string;
  private postStream$: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    if (this.postStream$) { this.postStream$.unsubscribe }

    this.postStream$ = this.authService.login$(this.userName, this.password).subscribe(
      result => {
        if (result.state == 1) {
          this.router.navigate([""]);
        } else {
          alert(result.msg);
        }
      },
    error => {
      if (error.status == 400) {
        alert(error);
      }
    }
    )
  }

  ngOnDestroy() {
    if (this.postStream$) { this.postStream$.unsubscribe() }
  }

}
