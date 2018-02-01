import { Component, OnInit, Input } from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-button-view',
  template: `<div *ngIf="viewData">
            <span *ngIf="displayData && displayData.displayStr && inlineLable && inlineLable === 'pre'">{{displayData.displayStr}} -    </span>
                {{viewData}}
            <span *ngIf="displayData && displayData.displayStr && inlineLable && inlineLable !== 'pre'">- {{displayData.displayStr}}</span>
            </div>`
})
export class ButtonViewComponent implements OnInit {
  isMobile=environment.isMobile;
  @Input('inlineLable') inlineLable: string;
  @Input('viewData') viewData: any;
  @Input('displayData') displayData: Object;
    /*<span class="glyphicon glyphicon-eye-open" *ngIf="isMobile && displayData.displayIconMobile == 'view'"></span>*/

    constructor() { }

  ngOnInit() {
    console.log('viewData>>>>>', this.viewData);
  }

}
