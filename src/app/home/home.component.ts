import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from "@angular/core";
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentService } from '../services/document.service';
import { UserService } from '../services/user.service';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  fakeGroup = Array(3);
  clicked: boolean = false;
  isSingleClick:boolean = true;
  docdetails:boolean=false;
  groupdetails:boolean=false;
  selected: string;
  private selectedFile: File;
  filename: string = "";
  pdfSrc = "";
  addGroup: FormGroup;
  editGroup: FormGroup;
  uploadDoc: FormGroup;
  approveForm: FormGroup;
  rejectForm: FormGroup;
  submitted = false;
  arrTempAdd : any[] = [];
  arrTempDes : any[] = [];
  arrTempEdit : any[] = [];
  groupindex = 0;
  groups: any;

  constructor(
    private formBuilder: FormBuilder,
    private documentService: DocumentService,
    private userService: UserService,
    private storage: AngularFireStorage,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchData();
    this.addGroup = this.formBuilder.group({
      groupName: ['',Validators.required],
      membersEmail:['',Validators.required]
    });
    this.editGroup = this.formBuilder.group({
      egroupName: ['',Validators.required],
      emembersEmail:['',Validators.required]
    });
    this.uploadDoc = this.formBuilder.group({
      fileName: [null,Validators.required],
      signature:[''],
      duedate:['',Validators.required],
      sharedgroup:['',Validators.required],
      doctype: ['', Validators.required],
      designated:['',Validators.required]
    });
    this.approveForm = this.formBuilder.group({
      notes: [''],
      signaturedoc:[null]
    });
    this.rejectForm = this.formBuilder.group({
      notes: ['',Validators.required],
      //signaturedoc:[null]
    });
  }

  fetchData(){
    this.userService.getGroups().then((res: any) => {
      this.groups = res.result;
    })
    this.userService.checkUser().then((res: any) => {
      if(res.status == 400){
        this.router.navigate(['/login']);
      }
    })
  }

  get f() { return this.addGroup.controls;}
  get a() { return this.editGroup.controls;}
  get d() { return this.uploadDoc.controls;}
  get e() { return this.approveForm.controls;}

  popAdd(index){
    this.arrTempAdd.splice(index,1);
  }
  popEdit(index){
    this.arrTempEdit.splice(index,1);
  }
  popDes(index){
    this.arrTempDes.splice(index,1);
  }
  push(){
    let email = this.addGroup.get('membersEmail').value;
    console.log(email);
    this.arrTempAdd.push(email);
  }
  pushdes(){
    let email = this.uploadDoc.get('designated').value;
    console.log(email);
    this.arrTempDes.push(email);
  }
  pushedit(){
    let email = this.editGroup.get('emembersEmail').value;
    console.log(email);
    this.arrTempEdit.push(email);
  }

  //MODAL SUBMITS
  createGroup(){ //add group modal
    this.submitted=true;
    this.addGroup.controls['membersEmail'].setValue(this.arrTempAdd);
    if (this.addGroup.invalid) {
      return;
    }
    console.log(this.addGroup.value);
    this.submitted=false;
    this.addGroup.reset(); 
    this.arrTempAdd = [];
  }
  saveChanges(){ //edit group modal
    this.submitted=true;
    this.editGroup.controls['emembersEmail'].setValue(this.arrTempEdit);
    if (this.editGroup.invalid) {
      return;
    }
    console.log(this.editGroup.value);
    this.submitted=false;
    this.editGroup.reset(); 
    this.arrTempEdit = [];
  }
  uploadDocument(){ //upload modal
    this.submitted=true;
    this.uploadDoc.controls['designated'].setValue(this.arrTempDes);
    if(this.uploadDoc.get('signature').value == ""){
      this.uploadDoc.controls['signature'].setValue("false");
    }
    if (this.uploadDoc.invalid) {
      return;
    } else {
      console.log(this.uploadDoc.value);
      var myFormData = new FormData();
      myFormData.append('documentName', this.filename);
      myFormData.append('due', this.uploadDoc.value.duedate);
      myFormData.append('type', this.uploadDoc.value.doctype);
      myFormData.append('sign', this.uploadDoc.value.signature);
      myFormData.append('designated', this.uploadDoc.value.designated);
      myFormData.append('shared', this.uploadDoc.value.sharedgroup);
      console.log(this.uploadDoc.value.dueDate);
      this.documentService.postDoc(myFormData).then((res: any) => {
        console.log(res);
        if(res.status == 200 ){
          this.storage.upload('/documents/' + this.filename, this.selectedFile).snapshotChanges().subscribe(res => {

          });
          this.uploadDoc.reset(); 
          this.arrTempDes = [];
          this.filename="";
        }
      })
      
    }
    
    this.submitted=false;
    
  }
  approve(){//approve doc modal
    this.submitted=true;
    if (this.approveForm.invalid) {
      console.log("invalid");
      return;
    }
    console.log(this.approveForm.value);
    this.submitted=false;
    this.approveForm.reset(); 
    this.filename="";
  }
  reject(){//reject doc modal
    this.submitted=true;
    if (this.rejectForm.invalid) {
      console.log("invalid");
      return;
    }
    console.log(this.rejectForm.value);
    this.submitted=false;
    this.rejectForm.reset(); 
  }

  // Move Up Move Down Group (NOT YET WORKING)
  moveUp(index: number) {
    console.log("up", this.groups[index]);
    if (index >= 1)
      this.swap(index, index - 1)
  }
  moveDown(index: number) {
    console.log("down", this.groups[index])
    if(index < this.groups.length-1)
    this.swap(index, index + 1)
  }
  private swap(x: any, y: any) {
    var b = this.groups[x];
    this.groups[x] = this.groups[y];
    this.groups[y] = b;
  }

  oneClick(){ // SINGLE CLICK CARD
    this.isSingleClick=true;
    setTimeout(()=>{
      if(this.isSingleClick){
        console.log('one click');
        this.docdetails = true;
        this.groupdetails=false;
        let sign = "false"; //setting signature required or not
        if(sign === "true"){
          this.approveForm.get("signaturedoc").setValidators([Validators.required]);
          console.log("signature required");
        } else {       
          this.approveForm.get("signaturedoc").setValidators([]);
        }        
        this.approveForm.controls["signaturedoc"].updateValueAndValidity();
      }
    }, 250);
  }

  onFileSelect(event) {//AFTER SELECTING FILE
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile.name);
    this.filename = this.selectedFile.name;
  }

  selectGroup(event){//DOUBLE CLICK GROUP
    this.docdetails = false;
    this.groupdetails=true;
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

  doubleClick(){//DOUBLE CLICK CARD TO PREVIEW PDF
    console.log('double click');
    this.isSingleClick=false;
    var str = "https://firebasestorage.googleapis.com/v0/b/docdox-4ba5a.appspot.com/o/documents%2FContoh_Jurnal_Game%20(2).pdf?alt=media&token=49328aca-1cd2-4486-a5f7-e8e0af740b51";
    let link = str.split("/o/", 2);
    //console.log(link[1]);
    this.pdfSrc="o/"+link[1];
    
    document.getElementById("openPreviewButton").click();
  }

  logout(){

  }
  
  logIndex(el){ //test passing data to modal

    this.groupindex = el.getAttribute('indexvalue');
    //let messageId = el.dataset.messageId;
    console.log("Index value: ", this.groupindex);

  }
}
