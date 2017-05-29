import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `<div class="row footer">
                <div class="col-md-6 col-md-offset-3 underline">&copy; IGP.com - Intermesh Pvt Ltd. - 2017</div>
            </div>`,
  styles: [`.footer{
              bottom:0;
              text-align: center;
              text-decoration: underline;
              margin: 10px 0 0;
              width:100%;
          }`]
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
