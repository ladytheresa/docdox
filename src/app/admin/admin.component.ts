import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentService } from '../services/document.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  name:any;
  role:any;
  isSelected: boolean = false;

  buttons = [
    {text:'Users', isSelected:false},
    {text:'Groups', isSelected:false},
    {text:'Documents', isSelected:false}
  ]
  constructor(
    private formBuilder: FormBuilder,
    private documentService: DocumentService,
    private userService: UserService,
    private storage: AngularFireStorage,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }
  fetchData(){
    this.userService.checkUser().then((res: any) => {
      if(res.status == 400){
        this.router.navigate(['/login']);
      } else{
        this.name = res.name;
        this.role = res.role;
      }
    });
  }

  select(button:any){
    for(let button of this.buttons) {
      button.isSelected = false;
    }
    button.isSelected = true;
  }
}
