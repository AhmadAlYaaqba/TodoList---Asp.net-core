import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { CanActivate, Router, Data } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AuthBearer } from './auth-bearer';

@Injectable()
export class AuthService implements CanActivate {
  // variable for session
  private tokeyKey = "token";
  private userId = "id";
  private todoId = "aa"

  constructor(private http: HttpClient, private router: Router) { }

  public canActivate() {
    if (this.checkLogin()) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }

  // login request with suiitable header
  public login$(userName: string, password: string) {
    let header = new HttpHeaders().set('Content-Type', 'application/json');
    let body = JSON.stringify({ "UserName": userName, "Password": password });
    let options = { headers: header };

    return this.http.post<AuthBearer>("/api/user/login", body, options).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(
        res => {
          let result = res;
          // check response state if its available and its value 1 (success), and check accessToken
          if (result.state && result.state == 1 && result.data && result.data.accessToken) {
            // save accessToken in session to use it in requests
            sessionStorage.setItem(this.tokeyKey, result.data.accessToken);
            // call function to save user id in session
            this.saveUserId$();
          }
          return result;
        }
      ),
      catchError(this.handleError<AuthBearer>("login")) // handle error
    )
  }

  // change to do status if its completed  or not
  public complete$(id: string, status: boolean) {
    // request headers with authenication Bearer
    let headers = this.initAuthHeaders();
    let body = status
    let options = { headers: headers };
    return this.http.put<AuthBearer>(`/api/todo/${id}`, body, options).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(
        res => {
          let result = "Sucess";
          return result;
        }
      ),
      catchError(this.handleError<AuthBearer>("Complete"))
    )
  }

  // update todo title, taking only 1 paramter
  public updateTitle$(title: string) {
    let headers = this.initAuthHeaders();
    let body = JSON.stringify(title);
    let id = sessionStorage.getItem(this.todoId); // get todoID from seassion 
    let options = { headers: headers };
    return this.http.put<AuthBearer>(`/api/todo/title/${id}`, body, options).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(
        res => {
          let result = "Success";
          return result;
        }
      ),
      catchError(this.handleError<AuthBearer>("UpdateTitle"))
    )
  }

  // update todo assign to 
  public updateAssign$(assign: string) {
    let headers = this.initAuthHeaders();
    let body = JSON.stringify(assign);
    let id = sessionStorage.getItem(this.todoId);
    let options = { headers: headers };
    return this.http.put<AuthBearer>(`/api/todo/assign/${id}`, body, options).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(
        res => {
          let result = "Success";
          return result;
        }
      ),
      catchError(this.handleError<AuthBearer>("UpdateTitle"))
    )
  }

  // save todo ID in session, to get it later in updates requests
  public saveTodoId$(id: string) {
    sessionStorage.setItem(this.todoId, id);
  }

  // Delete todo list
  public delete$(id: string) {
    let headers = this.initAuthHeaders();
    let options = { headers: headers };
    return this.http.delete<AuthBearer>(`/api/todo/${id}`, options).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(
        res => {
          let result = "Sucess";
          return result;
        }
      ),
      catchError(this.handleError<AuthBearer>("Complete"))
    )
  }

  // User Regestration post request
  public register$(userName: string, password: string, Email: string) {
    let header = new HttpHeaders().set('Content-Type', 'application/json');
    let body = JSON.stringify({ "UserName": userName, "Password": password, "Email": Email });
    let options = { headers: header };

    return this.http.post<AuthBearer>("/api/user", body, options).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(
        res => {
          let result = res;
          if (result.Msg) { // successfull message
            this.router.navigate(["login"]);
          }
          return result; // return errors
        }
      ),

      catchError(this.handleError<AuthBearer>("register"))
    )
  }

  // create new todo item 
  public addTodo$(title: string, Date_Time: string, assinedTo: string) {
    let headers = this.initAuthHeaders();
    let userId = this.getUserId(); // retrive user id from session
    let newDate = new Date(Date_Time); // save in Date format to send it with request
    let body = JSON.stringify({ "title": title, "status": false, "Start_Date": newDate, "UserId": userId, "assinedTo": assinedTo  });
    let options = { headers: headers };
    return this.http.post<AuthBearer>("/api/todo", body, options).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(
        res => {
          let result = res;
          if (result.data.msg == "Todo Created") { // in success will recive this message
            this.router.navigate(["todos"]);
          }
          let obj = { "data": result }; // if there is errors (more than 2 title with same name) will handle it here
          return obj
        }
      ),
      catchError(this.handleError<AuthBearer>("AddTodo"))
    )
  }

  // retrive all todo list for logged user
  public getUserTodo$() {
    let headers = this.initAuthHeaders();
    let options = { headers: headers };
    let userId = this.getUserId(); 
    return this.http.get<any>(`/api/todo/${userId}`, options).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      catchError(this.handleError<AuthBearer>("Complete"))
    )
  }

  // general get request with authentication headers ready 
  public authGet$(url) {
    let header = this.initAuthHeaders();
    let options = { headers: header };
    return this.http.get<any>(url, options).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      catchError(this.handleError<any>("authGet")));
  }

  // check if user login or not by token
  public checkLogin(): boolean {
    let token = sessionStorage.getItem(this.tokeyKey);
    return token != null;
  }

  public getUserNameHome$() {
    let token = this.getLocalToken();
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set("Authorization", "Bearer " + token);
    let options = { headers: headers };
    return this.http.get<any>("/api/user", options).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      catchError(this.handleError<any>("authGet")));
  }

  public getUserInfo$() {
    return this.authGet$("/api/user");
  }

  public saveUserId$() {
    this.authGet$("/api/user").subscribe(result => {
      sessionStorage.setItem(this.userId, result.data.id);
    })
  }

  public authPost$(url: string, body: any) {
    let headers = this.initAuthHeaders();
    return this.http.post(url, body, { headers: headers }).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      catchError(this.handleError("authPost"))
    )
  }

  private getLocalToken(): string {
    return sessionStorage.getItem(this.tokeyKey);
  }

  private getUserId(): string {
    return sessionStorage.getItem(this.userId);
  }

  private initAuthHeaders(): HttpHeaders {
    let token = this.getLocalToken();
    if (token == null) throw "No token";

    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set("Authorization", "Bearer " + token);
    return headers;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} error: ${error.message}`);
      return of(result as T);
    };  
  }

}
