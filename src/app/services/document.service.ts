import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { rejects } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient) { }

  postDoc(values){
    return new Promise((resolve, reject) => {
      this.http.post('docdox/postdocument.php', values).subscribe(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getUploaded(id){
    return new Promise((resolve, reject) => {
      this.http.get('docdox/getuploaded.php?view_id='+id).subscribe(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      )
    })
  }

  getUploadedDetail(id){
    return new Promise((resolve, reject) => {
      this.http.get('docdox/getuploaded.php?id=', id).subscribe(
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
