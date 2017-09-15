import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IMyOptions, IMyDateModel } from 'mydatepicker';
import { BackendService } from '../../services/backend.service';
import { UtilityService } from '../../services/utility.service';
import {environment} from "../../../environments/environment";
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reportData:any;
  constructor(
      public reportsService: ReportsService,
      public BackendService: BackendService,
      public UtilityService: UtilityService
      ) { }

  ngOnInit() {
      var _this = this;
      this.reportData = this.reportsService.getReportData('dummy', null);
      this.reportsService.getReportData('dummy', function(error, _reportData){
          if(error){
              console.log('_reportData Error=============>', error);
              return;
          }
          console.log('_reportData=============>', _reportData);
          this.reportData = _reportData;
      });
  }




}
