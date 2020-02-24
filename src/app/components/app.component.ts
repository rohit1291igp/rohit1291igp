import { Component, NgZone, OnInit, OnChanges } from '@angular/core';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges{
  title = 'app works!';
  onlineFlag=navigator.onLine;
  constructor(private _ngZone: NgZone, public UtilityService: UtilityService) {}

  ngOnInit() {
        console.log('app started !!!!!!!!!!!!');
        this.UtilityService.changeRouteComponent();
        window.addEventListener('online',  this.updateOnlineStatus);
        window.addEventListener('offline', this.updateOnlineStatus);
  }

  ngOnChanges(changes){
        console.log('app component changes########', changes);
  }

  execute() {
    this._ngZone.run(() => {console.log('NgZone run executed')});
  }

  updateOnlineStatus(event) {
    var _this=this;
    var status = document.getElementById("status");
    var condition = navigator.onLine ? "online" : "offline";
    status.className = condition;
    status.innerHTML = condition === 'offline' ? 'There is no Internet connection' : condition.toUpperCase();
    if(condition === 'online'){
        setTimeout(function(){
            status.classList.remove('online');
        },1500);
    }
  }
}

@Component({
  selector: 'app-test',
  template:` 
  <div style="margin-top:120px">
  <div class="photo">
  <label>
      <input id="fileInput" type="file" [(ngModel)]="statusReasonModel.deliveredStatusFile" #deliveredStatusFile="ngModel"
      (change)="fileChange($event)"  accept=".jpeg, .jpg, .png"/>
      Take Photo
  </label>
  <div class="clearfix"></div>
</div>
</div>
`,
styleUrls: ['./app.component.css']
})
export class testComponent{
  statusReasonModel: any = {};
  fileChange(e){
    console.log(e)
  }
}