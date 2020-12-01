import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from "@angular/core";
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

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router) {
    this.http.get('http://localhost/docdox/tryout.php').subscribe(data => {
      this.trying.push(data);
      console.log(this.trying);
    })
  }

  get f() { return this.uploadForm.controls; }

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      share: ['', Validators.required]
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
    console.log("uploaded");
  }
}
