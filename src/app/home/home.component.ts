import { Component, OnInit } from "@angular/core";
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  fakeGroup = Array(3);
  clicked: boolean = false;
  docdetails:boolean=false;
  groupdetails:boolean=false;
  selected: string;
  private selectedFile: File;
  filename: string = "";
  pdfSrc = "";
  isVisible: boolean = false;  

  constructor() {}

  ngOnInit(): void {}

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
  }

  oneClick(){
    console.log('one click');
    this.docdetails = true;
    this.groupdetails=false;
  }

  onFileSelect(event) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile.name);
    this.filename = this.selectedFile.name;
  }

  selectGroup(event){
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

  doubleClick(){
    console.log('double click');
    //this.openDoc('assets/dummy/00000020013_JoyAmadea_ProposalSkripsi.pdf',1); this is for  new tab
    this.pdfSrc="temp/lorem-ipsum.pdf";
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
