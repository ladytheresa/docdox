import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  fakeGroup = Array(3);
  clicked: boolean = false;
  constructor() {}

  ngOnInit(): void {}

  oneClick(){
    console.log('one click');
  }

  doubleClick(){
    console.log('double click');
  }
}
