import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

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
  isVisible: boolean = false;  
  addGroup: FormGroup;
  editGroup: FormGroup;
  uploadDoc: FormGroup;
  submitted = false;
  arrTempAdd : any[] = [];
  arrTempDes : any[] = [];
  arrTempEdit : any[] = [];

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
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


  }
  get f() { return this.addGroup.controls;}
  get a() { return this.editGroup.controls;}
  get d() { return this.uploadDoc.controls;}

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
    if (this.uploadDoc.invalid) {
      return;
    }
    console.log(this.uploadDoc.value);
    this.submitted=false;
    this.uploadDoc.reset(); 
    this.arrTempDes = [];
  }

  //not yet working
  moveUp(index: number) {
    console.log("up", this.fakeGroup[index]);
    if (index >= 1)
      this.swap(index, index - 1)
  }
  moveDown(index: number) {
    console.log("down", this.fakeGroup[index])
    if(index < this.fakeGroup.length-1)
    this.swap(index, index + 1)
  }
  private swap(x: any, y: any) {
    var b = this.fakeGroup[x];
    this.fakeGroup[x] = this.fakeGroup[y];
    this.fakeGroup[y] = b;
  }//not working stops here

  oneClick(){ //single click card
    this.isSingleClick=true;
    setTimeout(()=>{
      if(this.isSingleClick){
        console.log('one click');
        this.docdetails = true;
        this.groupdetails=false;    
      }
    }, 250);
  }

  onFileSelect(event) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile.name);
    this.filename = this.selectedFile.name;
  }

  selectGroup(event){//double click group
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

  doubleClick(){//doubleclick card
    console.log('double click');
    this.isSingleClick=false;
    //this.openDoc('assets/dummy/00000020013_JoyAmadea_ProposalSkripsi.pdf',1); this is for  new tab
    var str = "https://firebasestorage.googleapis.com/v0/b/docdox-4ba5a.appspot.com/o/documents%2FContoh_Jurnal_Game%20(2).pdf?alt=media&token=49328aca-1cd2-4486-a5f7-e8e0af740b51";
    let link = str.split("/o/", 2);
    //console.log(link[1]);
    this.pdfSrc="o/"+link[1];
    
    document.getElementById("openPreviewButton").click();
    //this.isVisible = true;
  }

  /*containerClicked(){
    if(this.isVisible==true){
      this.isVisible=false;
    }
  }*/
  /*openDoc(pdfUrl: string, startPage: number ) {
    window.open(pdfUrl + '#page=' + startPage, '_blank', '', true);
  }*/
}
