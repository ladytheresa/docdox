import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submitted=false;
  loginForm: FormGroup;

  constructor(private elementRef: ElementRef,
    private formBuilder:FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['',Validators.required],
      password:['',Validators.required]
    });
  }
  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#00477d';
 }

 get f() { return this.loginForm.controls;}

 login(){
  this.submitted=true;
  if (this.loginForm.invalid) {
    return;
  }
  console.log(this.loginForm.value);
  this.submitted=false;

 }

}
