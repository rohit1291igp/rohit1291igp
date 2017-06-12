import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent implements OnInit {
    vendorName = localStorage.getItem('vendorName');

    constructor(
      public router: Router,
      public BackendService : BackendService
      ) { }

  ngOnInit() {
  }

  logout(e){
      let _this = this;
      let reqObj = {
          url : "?responseType=json&scopeId=1&token="+localStorage.getItem('currentUserToken')+"&method=igp.auth.doLogOut",
          method : "post",
          payload : {}
      };

      this.BackendService.makeAjax(reqObj, function(err, response, headers){
          if(err) {
              console.log(err)
              return;
          }

          localStorage.removeItem('currentUserToken');
          localStorage.removeItem('fkAssociateId');
          _this.router.navigate(['/login']);
      })
  }

}
