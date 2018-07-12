import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent implements OnInit {
  private title: string;
  private Date_Time: string;
  private postStream$: Subscription;
  private assinedTo: string;
  public error: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }
  
  onAdd() {
    if (this.postStream$) { this.postStream$.unsubscribe }    
    this.postStream$ = this.authService.addTodo$(this.title, this.Date_Time, this.assinedTo).subscribe(
      result => {
        console.log(result)
        if (result.data.msg != "Todo Created") {
          this.error = "There is 2 Todo with same title, please change title";
        } else {
          alert(result.data.msg);
        }
      }
    )
  }
}
