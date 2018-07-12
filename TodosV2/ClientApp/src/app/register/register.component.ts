import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private userName: string;
  private password: string;
  private Email: string;
  private postStream$: Subscription;
  public errors: string[];

  constructor(private authService: AuthService, private router: Router, private ref: ChangeDetectorRef) {
 
  }

  register() {
    if (this.postStream$) { this.postStream$.unsubscribe }

    this.postStream$ = this.authService.register$(this.userName, this.password, this.Email).subscribe(
      result => {
        if (Array.isArray(result)) {
          this.errors = result;
          console.log(this.errors);
        }
        if (result.data.msg == "Account Created") {
          alert("Account Created");
          this.router.navigate(["login"]);
        }
      }
    )
  }

  ngOnInit() {
    if (this.authService.checkLogin()) {
      this.router.navigate([""]);
    }
  }
  //ngOnDestroy() {
  //  if (this.postStream$) { this.postStream$.unsubscribe() }
  //}

}
