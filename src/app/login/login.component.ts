import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submitted=false;
  loginForm: FormGroup;

  constructor(private elementRef: ElementRef,
    private formBuilder:FormBuilder, private http: HttpClient,
    private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['',Validators.required],
      password:['',Validators.required]
    });
  }
  ngAfterViewInit(){
    // this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#00477d';
 }

 get f() { return this.loginForm.controls;}

 login(){
  this.submitted=true;
  if (this.loginForm.invalid) {
    return;
  } else {
    var myFormData = new FormData();
     myFormData.append('email', this.loginForm.value.email);
     myFormData.append('password', this.loginForm.value.password);
     this.userService.login(myFormData).then((res: any) => {
      console.log(res.response);
      if(res.response == 200){
        this.router.navigate(['']);
      } else if(res.response == 400){

      }
     })
  }
  console.log(this.loginForm.value);
  this.submitted=false;

 }

}
