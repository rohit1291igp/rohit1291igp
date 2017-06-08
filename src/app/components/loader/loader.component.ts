import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
 @Input('loaderType') loaderType: string;

  constructor() { }

  ngOnInit() {
      //console.log('Loader Type ---->', this.loaderType);
  }

}
