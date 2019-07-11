import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `<div class="row footer">
                <div class="col-md-6 col-md-offset-3 underline"> Copyright &copy; 2000-2019. IGP.com. All rights reserved</div>
            </div>`,
  styles: [`.footer{
              /*position: fixed;*/
              bottom:0;
              text-align: center;
              text-decoration: underline;
              margin: 10px 0 10px;
              width:100%;
          }`]
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
