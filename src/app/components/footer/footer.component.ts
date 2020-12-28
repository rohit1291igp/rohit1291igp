import { Component, OnInit, HostListener, DoCheck } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `<div class="row footer">
  <div class="col-md-6 col-md-offset-3 underline"> <div class="d-flex justify-content-center align-items-center auto-margin width-fit-content" *ngIf="whitelabelStyle else regularFooter"><span style="margin-right: 7px;">Powered by: </span><img src="https://cdn.igp.com/f_auto,q_auto/banners/IGP-for-business-48_new.png?v=3" width="100" height="100" class="image" /></div>
                <ng-template #regularFooter>Copyright &copy; 2019-2020. IGP.com. All rights reserved</ng-template>
                </div>
            </div>`,
  styles: [`.footer{
              /*position: fixed;*/
              bottom:0;
              text-align: center;
              text-decoration: underline;
              margin: 10px 0 10px;
              width:100%;
          }
          .image{
            max-width: 100%;
            height: auto;
            width: 35%;
          }
          `]
})
export class FooterComponent implements OnInit, DoCheck {
  whitelabelStyle;

  constructor() { }

  ngOnInit() {
    this.whitelabelStyle = localStorage.getItem('whitelabelDetails') ? JSON.parse(localStorage.getItem('whitelabelDetails')) : null;
  }
    
    ngDoCheck(){
      this.whitelabelStyle = localStorage.getItem('whitelabelDetails') ? JSON.parse(localStorage.getItem('whitelabelDetails')) : null;
    }
}