import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-edit-todo-assign',
  templateUrl: './edit-todo-assign.component.html',
  styleUrls: ['./edit-todo-assign.component.css']
})
export class EditTodoAssignComponent implements OnInit {
  private assign: string;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  Onchange(id, status) {
    this.authService.updateAssign$(this.assign).subscribe(result => {
      this.router.navigate(["todos"]);
    }, error => console.error(error));
  }

}
