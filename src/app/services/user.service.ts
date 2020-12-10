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

  getGroupData(id){
    return new Promise((resolve, reject) => {
      this.http.get('docdox/getgroup.php?id='+id).subscribe(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getGroupMembers(id){
    return new Promise((resolve, reject) => {
      this.http.get('docdox/getemail.php?view_id='+id).subscribe(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  addGroup(values){
    return new Promise((resolve, reject) => {
      this.http.post('docdox/postgroup.php', values).subscribe(
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
    });
  };


  logout(){
    return new Promise((resolve, reject) => {
      this.http.get('docdox/logout.php').subscribe(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      )
    });
  };
}
