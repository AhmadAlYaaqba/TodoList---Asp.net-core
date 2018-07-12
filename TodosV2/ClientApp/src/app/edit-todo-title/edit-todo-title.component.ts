import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-edit-todo-title',
  templateUrl: './edit-todo-title.component.html',
  styleUrls: ['./edit-todo-title.component.css']
})
export class EditTodoTitleComponent implements OnInit {
  private title: string;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  Onchange(id, status) {
    this.authService.updateTitle$(this.title).subscribe(result => {
      this.router.navigate(["todos"]);
    }, error => console.error(error));
  }

}
