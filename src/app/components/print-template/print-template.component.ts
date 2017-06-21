import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-print-template',
  templateUrl: './print-template.component.html'
})
export class PrintTemplateComponent implements OnInit {
  @Input('order') order : any;
  @Input('printType') printType : string;
    productsURL = environment.productsURL;
    productsCompURL = environment.productsCompURL;

  constructor() { }

  ngOnInit() {
  }

}
