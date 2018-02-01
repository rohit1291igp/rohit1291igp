import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import {environment} from "../../../environments/environment";
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.css']
})
export class WidgetsComponent implements OnInit {
  isMobile=environment.isMobile;
  widgetDdFlag=false;
  @Input('wOptions') wOptions : any;
  @Output() onConfirmClicked:EventEmitter<any>=new EventEmitter();
  @Output() onWidgetClickEvent:EventEmitter<any>=new EventEmitter();
  constructor(
      public UtilityService: UtilityService,
      private _elementRef: ElementRef
      ) { }

  ngOnInit() {
    //console.log('wOptions==========>', this.wOptions);
  }

 @HostListener('document:click', ['$event.target'])
    public onClick(targetElement) {
        console.log('inside dd clicked ------->');
        const isClickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!isClickedInside) {
            console.log('outside dd clicked ------->');
           this.widgetDdFlag=false;
        }
 }

  scrollUp(e){
      e.preventDefault();
      e.stopPropagation();
      let scrollDuration=1000;
      var scrollStep = -window.scrollY / (scrollDuration / 15),
          scrollInterval = setInterval(function(){
              if ( window.scrollY != 0 ) {
                  window.scrollBy( 0, scrollStep );
              }
              else clearInterval(scrollInterval);
          },15);

      /*if(this.wOptions.scrollContainer){
          let _scrollContainer = document.querySelector(this.wOptions.scrollContainer);
          _scrollContainer.scrollTop= 0
      }else{
          window.scrollTo(0,0);
      }*/

  }

  confirmYesNo(e, value){
      e.preventDefault();
      e.stopPropagation();
      var parameters = {e:e, value: value}
      this.onConfirmClicked.emit(parameters);
  }

  widgetClkEvent(e, value){
      e.preventDefault();
      e.stopPropagation();
      this.widgetDdFlag=false;
      var parameters = {e:e, value: value};
      this.onWidgetClickEvent.emit(parameters);
  }

  dDOpen(e){
      e.preventDefault();
      e.stopPropagation();
      this.widgetDdFlag=true;
  }

}
