import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  fakeGroup = Array(3);
  clicked: boolean = false;
  selected: string;
  constructor() {}

  ngOnInit(): void {}

  oneClick(){
    console.log('one click');
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
}
