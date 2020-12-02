import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private elementRef: ElementRef, private http: HttpClient, private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  ngAfterViewInit(){
    // this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#00477d';
 }

 get f() { return this.loginForm.controls; }

 login(){
   console.log(this.loginForm.value);
   if(this.loginForm.invalid){
    return;
   } else {
     var myFormData = new FormData();
     const headers = new HttpHeaders();
     myFormData.append('email', this.loginForm.value.email);
     myFormData.append('password', this.loginForm.value.password);
     return this.http.post('docdox/user.php/', myFormData).subscribe((res: any) => {
       console.log(res.response);
       if(res.response == 200){
         this.router.navigate(['']);
       } else if(res.response == 400){
         
       }
     })
   }
 }


}
