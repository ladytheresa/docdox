import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getGroups(){
    return new Promise((resolve, reject) => {
      this.http.get('docdox/getgroup.php').subscribe(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  login(value){
    return new Promise((resolve, reject) => {
      this.http.post('docdox/user.php', value).subscribe(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  checkUser(){
    return new Promise((resolve, reject) => {
      this.http.get('docdox/check_user.php').subscribe(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      )
    })
  }
}