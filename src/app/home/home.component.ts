import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from "@angular/core";
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentService } from '../services/document.service';
import { UserService } from '../services/user.service';
import { DatePipe } from '@angular/common'
import {MatBadgeModule} from '@angular/material/badge'; 

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  providers: [DatePipe, MatBadgeModule]
})
export class HomeComponent implements OnInit {
  isSelected: boolean = false;
  isSingleClick:boolean = true;
  isAssesser:boolean=false;
  docdetails:boolean=false;
  groupdetails:boolean=false;
  selected: string;
  private selectedFile: File;
  filename: string = "";
  pdfSrc = "";
  previewSource="";
  addGroup: FormGroup;
  editGroup: FormGroup;
  uploadDoc: FormGroup;
  approveForm: FormGroup;
  rejectForm: FormGroup;
  submitted = false;
  arrTempAdd : any[] = [];
  arrTempDes : any[] = [];
  arrTempEdit : any[] = [];
  tempArray : any[] = [];
  selectedGroupID = "";
  groups: any;
  groupdata:any;
  groupmembers:any;
  name:any;
  role:any;
  documents: any;
  logs:any;
  needapprove: any;
  needapproveserial: any;
  currDocName:any;
  currDocID:any;
  documentdetail:any;
  tempSelected:any;
  myControl: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private documentService: DocumentService,
    private userService: UserService,
    private storage: AngularFireStorage,
    private router: Router,
    private datepipe: DatePipe
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
      duedate:['',Validators.required],
      sharedgroup:['',Validators.required],
      doctype: ['', Validators.required],
      designated:['',Validators.required]
    });
    this.approveForm = this.formBuilder.group({
      notes: ['']
    });
    this.rejectForm = this.formBuilder.group({
      notes: ['',Validators.required]
    });
  }

  fetchData(){
    this.userService.getGroups().then((res: any) => {
      this.groups = res.result;
      console.log(this.groups);
    });
    this.userService.checkUser().then((res: any) => {
      if(res.status == 400){
        this.router.navigate(['/login']);
      } else{
        this.name = res.name;
        this.role = res.role;
        console.log(this.role);
      }
    });
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
    } else {
    console.log(this.addGroup.value);
    var myFormData = new FormData();
    myFormData.append('groupName', this.addGroup.value.groupName);
    myFormData.append('email', this.addGroup.value.membersEmail);
      this.userService.addGroup(myFormData).then((res: any) => {
        console.log(res);
        if(res.status == 200 ){
          console.log("Successfully added group");
          this.addGroup.reset(); 
          this.arrTempAdd = [];
          this.refresh();
        }
      });
    }
    this.submitted=false;
  }
  saveChanges(){ //edit group modal
    this.submitted=true;
    this.editGroup.controls['emembersEmail'].setValue(this.arrTempEdit);
    if (this.editGroup.invalid) {
      return;
    }
    console.log(this.editGroup.value);
    this.editGroup.reset(); 
    this.arrTempEdit = [];
    //this.refresh();

    this.submitted=false;
  }
  uploadDocument(){ //upload modal
    this.submitted=true;
    this.uploadDoc.controls['designated'].setValue(this.arrTempDes);
    if (this.uploadDoc.invalid) {
      this.uploadDoc.reset(); 
      return;
    } else {
      console.log(this.uploadDoc.value);
      var myFormData = new FormData();
      myFormData.append('documentName', this.filename);
      myFormData.append('due', this.uploadDoc.value.duedate);
      myFormData.append('type', this.uploadDoc.value.doctype);
      //myFormData.append('sign', this.uploadDoc.value.signature);
      myFormData.append('designated', this.uploadDoc.value.designated);
      myFormData.append('shared', this.uploadDoc.value.sharedgroup);
      this.storage.upload('/documents/' + this.filename, this.selectedFile).then(res=>{
        this.storage.ref('/documents/'+this.filename).getDownloadURL().subscribe((res) => {
          myFormData.append('link', res);
          console.log(res);
          this.documentService.postDoc(myFormData).then((res: any) => {
            console.log(res);
            if(res.status == 200 ){
              this.uploadDoc.reset(); 
              this.arrTempDes = [];
              this.filename="";
              this.refresh();
            }
          });
        });
        console.log(this.uploadDoc.value.dueDate);  
      });
    }
    
    this.submitted=false;
    
  }

  approve(){//approve doc modal
    this.submitted=true;
    if (this.approveForm.invalid) {
      console.log("invalid");
      return;
    }
    var myFormData = new FormData();
    myFormData.append('id', this.currDocID);
    myFormData.append('notes', this.approveForm.value.notes);
    myFormData.append('status', '2');
    this.documentService.assess(myFormData).then((res: any) => {
      console.log(res);
      if(res.status == 200 ){
        this.approveForm.reset(); 
        this.refresh();
      }
    });

    this.submitted=false;
  }
  reject(){//reject doc modal
    this.submitted=true;
    if (this.rejectForm.invalid) {
      console.log("invalid");
      return;
    }
    var myFormData = new FormData();
    myFormData.append('id', this.currDocID);
    myFormData.append('notes', this.rejectForm.value.notes);
    myFormData.append('status', '3');
    this.documentService.assess(myFormData).then((res: any) => {
      console.log(res);
      if(res.status == 200 ){
        this.rejectForm.reset(); 
        this.refresh();
      }
    });

    this.submitted=false;

  }

  refresh(): void { window.location.reload(); }

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

  oneClick(doc,docid, type:string){ // SINGLE CLICK CARD
    this.isSingleClick=true;
    setTimeout(()=>{
      if(this.isSingleClick){
        console.log('one click');

        if(this.role==1 || this.role==2){
          for(let but of this.documents) {
            but.isSelected = false;
          }  
        }
        if(this.role==2 || this.role==3){
          for(let but of this.needapprove){
            but.isSelected = false;
          }  
        }
        doc.isSelected = true;
    
        this.docdetails = true;
        this.groupdetails=false;
        this.documentService.getLog(docid).then((res: any) => {
          this.logs = res.result;
          console.log(res);
        });  

        if(type=="files"){
          this.isAssesser=false;
          this.documentService.getUploadedDetail(docid).then((res: any) => {
            this.documentdetail = res.result;
            for(let doc of this.documentdetail){
               let fullname = doc.document_name;
               let current = fullname.split(".", 2);
               this.currDocName=current[0];   
            }
          });  
        }
        else if(type=="assess"){
          this.isAssesser=true;
          this.documentService.getNeedApproveDetail(docid).then((res: any) => {
            this.documentdetail = res.result;
            for(let doc of this.documentdetail){
               let fullname = doc.document_name;
               let current = fullname.split(".", 2);
               this.currDocName=current[0];   
            }
          });  
        }
      }
    }, 250);
  }

  onFileSelect(event) {//AFTER SELECTING FILE
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile.name);
    this.filename = this.selectedFile.name;
  }

  selectGroup(group,i){//SINGLE CLICK GROUP
    this.docdetails = false;
    this.groupdetails=true;
    for(let but of this.groups) {
      but.isSelected = false;
    }
    group.isSelected = true;

    const id = parseInt(i);
    if(this.role==1 || this.role==2){ //employee and pm can see all the doc and group details
      this.documentService.getUploaded(id).then((res: any) => {
        this.documents = res.result;
        console.log(res);
      });  
      this.userService.getGroupData(id).then((res: any) => {
        this.groupdata = res.result;
        console.log(res);
      });
      console.log(this.groupdata);  
    }
    if(this.role==2||this.role==3){ //boss and pm can see the needing approval category
      this.documentService.getNeedApprove(id).then((res: any) => {
        this.needapprove = res.result;
        this.needapprove.forEach(element=>{
          if(element.doc_status=='1'){
            this.tempArray.push(element);
          }
        });
        this.needapprove=this.tempArray;
        this.documentService.getNeedApproveSerial(id).then((res: any) => {
          this.needapproveserial = res.result;
          this.needapproveserial.forEach(element=>{
            if(element.doc_status=='1'){
              this.needapprove.push(element);
            }
          });
        });  
        this.tempArray = [];
        console.log(res);    
      });  
    
      this.userService.getGroupData(id).then((res: any) => {
        this.groupdata = res.result;
        console.log(res);
      });
    }

  }

  doubleClick(docid, type:string){//DOUBLE CLICK CARD TO PREVIEW PDF
    console.log('double click');
    console.log(docid);
    this.isSingleClick=false;

    if(type=="files"){
      this.documentService.getUploadedDetail(docid).then((res: any) => {
        this.documentdetail = res.result;
        for(let doc of this.documentdetail){
          console.log(doc.link);
          let str = doc.link;
          let link = str.split("/o/", 2);
          this.pdfSrc="o/"+link[1];
        }  
        console.log(res);
      });  
    }
    else if(type=="assess"){
      this.documentService.getNeedApproveDetail(docid).then((res: any) => {
        this.documentdetail = res.result;
        for(let doc of this.documentdetail){
          console.log(doc.link);
          let str = doc.link;
          let link = str.split("/o/", 2);
          this.pdfSrc="o/"+link[1];
        }
      });  
    }

    //let link = str.split("/o/", 2);
    document.getElementById("openPreviewButton").click();
  }

  logout(){
    this.userService.logout().then((res: any) => {
      this.refresh();
    });

  }
  
  logGroupID(el){ //test passing data to modal
    this.selectedGroupID = el.getAttribute('selectedGroupID');
    //let messageId = el.dataset.messageId;
    console.log("Group ID: ", this.selectedGroupID);
    /*this.userService.getGroupData(this.selectedGroupID).then((res: any) => {
      this.groupdata = res.result;
      for(let group of this.groupdata){
        this.arrTempEdit = group.names;
        this.editGroup.get('egroupName').setValue(group.group_name);
     }
      console.log(res);
    });*/
    /*this.userService.getGroupMembers(this.selectedGroupID).then((res: any) => {
      this.groupmembers = res.result.email;
      console.log(this.groupmembers);
    });*/
  }

  logDocID(el){ //test passing data to modal

    this.currDocID = el.getAttribute('currDocID');
    console.log("DocID: ", this.currDocID);
  }


}
