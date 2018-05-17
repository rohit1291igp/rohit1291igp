import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { UtilityService } from '../../services/utility.service';
import {environment} from "../../../environments/environment";
import { Observable } from "rxjs";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css']
})
export class FeedsComponent implements OnInit {
  _feeds=[
      {
          "orderId": "1004300",
          "instruction": "Kindly add a msg - \"Wish you a very Happy Birthday Amit.\"\r\n\r\nAnd kindly arrange for a delivery anytime between 3 to 7"
      },
      {
          "orderId": "1004214",
          "instruction": "Please arrange flowers in glass vase"
      },

      {
          "orderId": "1005323",
          "instruction": " mention that on the cake \r\nalso mentioned the message to the recipient:Happy Marriage Anniversary may you have many more to come."
      },
      {
          "orderId": "1004855",
          "instruction": "The recipient address is changed in this order.\r\n\r\nMr. K. Vijay 30/1, 1st Floor, Royal City Complex, Karur Bye Pass Road, Near Chatram Bus Stand, V.N.Nagar, Trichy Tiruchirappalli, Tamil Nadu 620002 India +91-8148002622"
      },
      {
          "orderId": "1005323",
          "instruction": "Please make a note of the address change.\r\n\r\nOrder id#:1005323\r\n\r\nMr. sathish \r\n8/653 kerada street, nanjanad village post , Ooty - 643004 \r\nTamil Nadu, India\r\nTele Phone :- 9600080991- - , karthikvsv@gmail.com \r\nCell Phone :- 9600080991"
      }
  ];

    isMobile=environment.isMobile;
    public feedData: any=[
      {
          "orderId": "",
          "instruction": ""
      },
        {
            "orderId": "",
            "instruction": ""
        },
        {
            "orderId": "",
            "instruction": ""
        },
        {
            "orderId": "",
            "instruction": ""
        },
        {
            "orderId": "",
            "instruction": ""
        }

    ];
    public feedObservable;

  constructor(
      public BackendService : BackendService,
      public UtilityService: UtilityService
  ) {}

  ngOnInit() {
     //var _this=this;
    console.log("sdfsdf");
      if(environment.userType == "vendor"){
          this.getFeeds();
          this.feedObservable=Observable.interval(1000 * 60)
              .subscribe(() => {
                  console.log('IntervalObservable working !!!')
                  this.getFeeds();
              });
      }else{
          this.feedData=[];
      }

  }

  ngOnDestroy(){
      if(this.feedObservable){
          this.feedObservable.unsubscribe();
      }
  }

  getFeeds(){
      var _this=this;
      var reqObj={
          url:'vendorinstructionfeed?fkAssociateId='+localStorage.getItem('fkAssociateId'),
          method:'get'
      };

      _this.BackendService.makeAjax(reqObj, function(err, response, headers){
          if(err || response.error) {
              console.log('Error=============>', err, response.errorCode);
          }
          console.log('feeds Response --->', response.result);
          _this.feedData=response.result;
      });
  }

}
