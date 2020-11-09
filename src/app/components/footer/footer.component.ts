import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `<div class="row footer">
  <div class="col-md-6 col-md-offset-3 underline"> <div class="d-flex align-items-center auto-margin width-fit-content" *ngIf="micrositeStyle else regularFooter"><span style="margin-right: 7px;">Powered by: </span><img src="{{micrositeStyle.footerLogoUrl}}" width="100" height="100" class="image" /></div>
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
            width: 160px;
            height: auto;
          }
          `]
})
export class FooterComponent implements OnInit {
  micrositeStyle;

  constructor() { }

  ngOnInit() {
    this.micrositeStyle = sessionStorage.getItem('micrositeStyleData') ? JSON.parse(sessionStorage.getItem('micrositeStyleData')) : null;
  }

}
