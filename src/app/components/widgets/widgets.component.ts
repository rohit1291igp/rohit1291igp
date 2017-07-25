import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {environment} from "../../../environments/environment";
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.css']
})
export class WidgetsComponent implements OnInit {
  @Input('wOptions') wOptions : any;

  constructor(
      public UtilityService: UtilityService
      ) { }

  ngOnInit() {
    //console.log('wOptions==========>', this.wOptions);
  }

  scrollTop(e){
      e.preventDefault();
      e.stopPropagation();

      if(this.wOptions.scrollContainer){
          let _scrollContainer = document.querySelector(this.wOptions.scrollContainer);
          _scrollContainer.scrollTop= 0
      }else{
          window.scrollTo(0,0);
      }

  }

}
