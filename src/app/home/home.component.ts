import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from "@angular/core";
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  fakeGroup = Array(3);
  clicked: boolean = false;
  selected: string;
  private selectedFile: File;
  filename: string = "";
  trying = [];
  uploadForm: FormGroup

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router,
    private storage: AngularFireStorage) {
      this.http.get('docdox/check_user.php').subscribe((res: any) => {
        console.log(res);
        if(res.status == 400){
          this.router.navigate(['/login']);
        }
      })
  }

  get f() { return this.uploadForm.controls; }

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      document: ['', Validators.required]
    });
  }

  oneClick(){
    console.log('one click');
  }

  onFileSelect(event) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile.name);
    this.filename = this.selectedFile.name;
  }

  selectGroup(event){
    let target = event.target;
    if (target.nodeName === "BUTTON"){
      let isCertainButtonAlreadyActive = target.parentElement.querySelector(".active");
      if( isCertainButtonAlreadyActive ) {
        isCertainButtonAlreadyActive.classList.remove("active");
      }
      else{  
        target.className += " active";
      }
    }
    console.log(target);
  }

  doubleClick(){
    console.log('double click');
  }

  onUploadDoc(){
    console.log(this.uploadForm.value);
    this.storage.upload('/documents/' + this.filename, this.selectedFile).snapshotChanges().subscribe(res => {
      
    });
    if(this.uploadForm.invalid){
      return;
     } else {
       var myFormData = new FormData();
       const headers = new HttpHeaders();
       myFormData.append('documentName', this.filename);
       return this.http.post('docdox/postdocument.php/', myFormData).subscribe((res: any) => {
         console.log(res.response);
         if(res.response == 200){
           this.router.navigate(['']);
         } else if(res.response == 400){
           
         }
       })
     }
  }
}
