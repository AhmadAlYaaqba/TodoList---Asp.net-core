import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from "../services/auth.service";
import * as moment from 'moment';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  public Todos: TodosInterface[];
  
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.checkLogin()) {
      this.OnRetrive();
    } else {
      this.router.navigate(["login"]);
    }
  }

  OnRetrive() {
    this.authService.getUserTodo$().subscribe(result => {
      console.log(result)
      this.Todos = result;
      this.Todos.forEach(todo => {
        todo.start_Date = moment(todo.start_Date).format("dddd, MMMM Do YYYY, h:mm:ss a");
        todo.createdOn = moment(todo.createdOn).format("dddd, MMMM Do YYYY, h:mm:ss a");
      })
    }, error => console.error(error));
  }

  OnComplete(id, status) {
    this.authService.complete$(id, !status).subscribe(result => {
      this.OnRetrive();
    }, error => console.error(error));
  }

  OnDelete(id) {
    this.authService.delete$(id).subscribe(result => {
      this.OnRetrive();
    }, error => console.error(error));
  }

  onUpdateTitle(id) {
    this.authService.saveTodoId$(id)
    this.router.navigate(["editTitle"]);
  }

  onUpdateAssign(id) {
    this.authService.saveTodoId$(id)
    this.router.navigate(["editAssign"]);
  }

}

interface TodosInterface {
  internalId: string;
  title: string;
  status: boolean;
  start_Date: string;
  createdOn: string;
  userId: string;
  assinedTo: string;
}
