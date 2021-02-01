import { Component, NgZone, OnInit, OnChanges } from '@angular/core';
import { UtilityService } from '../services/utility.service';
// import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { collapseAnimation, rubberBandAnimation, fadeInOnEnterAnimation, fadeOutOnLeaveAnimation, fadeOutAnimation, fadeInAnimation, fadeOutLeftAnimation } from 'angular-animations';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    fadeOutAnimation(),
    fadeInAnimation(),
    fadeOutLeftAnimation()
  ]
})
export class AppComponent implements OnInit, OnChanges{
  title = 'app works!';
  onlineFlag=navigator.onLine;
  isOnline = true;
  constructor(private _ngZone: NgZone, public UtilityService: UtilityService) {}

  ngOnInit() {
        console.log('app started !!!!!!!!!!!!');
        this.UtilityService.changeRouteComponent();
        window.addEventListener('online',  this.updateOnlineStatus);
        window.addEventListener('offline', this.updateOnlineStatus);
        if(navigator.onLine){
          this.isOnline = true;
         } else {
          this.isOnline = false;
         }
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
<h1>testtttt{{qrResultString}}</h1>
<img [src]="url" height="200"> 
<br>
camera: <!--<input type="file" accept="image/*" capture="camera" (change)="onSelectFile($event)">-->
<br>

<!-- <zxing-scanner [torch]="torchEnabled" [(device)]="currentDevice" (scanSuccess)="onCodeResult($event)"
    [formats]="formatsEnabled" [tryHarder]="tryHarder" (permissionResponse)="onHasPermission($event)"
    (camerasFound)="onCamerasFound($event)" (torchCompatible)="onTorchCompatible($event)"></zxing-scanner>-->

`,
styleUrls: ['./app.component.css']
})
export class testComponent{
  statusReasonModel: any = {};
  url = '';
  // allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX /*, ...*/ ];
  // availableDevices: MediaDeviceInfo[];
  // currentDevice: MediaDeviceInfo = null;

  // formatsEnabled: BarcodeFormat[] = [
  //   BarcodeFormat.CODE_128,
  //   BarcodeFormat.DATA_MATRIX,
  //   BarcodeFormat.EAN_13,
  //   BarcodeFormat.QR_CODE,
  // ];

  hasDevices: boolean;
  hasPermission: boolean;

  qrResultString: string;

  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;

  constructor(private readonly _dialog: MatDialog) { }

  clearResult(): void {
    this.qrResultString = null;
  }

  // onCamerasFound(devices: MediaDeviceInfo[]): void {
  //   this.availableDevices = devices;
  //   this.hasDevices = Boolean(devices && devices.length);
  // }

  // onCodeResult(resultString: string) {
  //   this.qrResultString = resultString;
  // }

  // onDeviceSelectChange(selected: string) {
  //   const device = this.availableDevices.find(x => x.deviceId === selected);
  //   this.currentDevice = device || null;
  // }

  // openFormatsDialog() {
  //   const data = {
  //     formatsEnabled: this.formatsEnabled,
  //   };

    // this._dialog
    //   .open(FormatsDialogComponent, { data })
    //   .afterClosed()
    //   .subscribe(x => { if (x) { this.formatsEnabled = x; } });
  // }

  // onHasPermission(has: boolean) {
  //   this.hasPermission = has;
  // }

  // openInfoDialog() {
  //   const data = {
  //     hasDevices: this.hasDevices,
  //     hasPermission: this.hasPermission,
  //   };

  //   // this._dialog.open(AppInfoDialogComponent, { data });
  // }

  // onTorchCompatible(isCompatible: boolean): void {
  //   this.torchAvailable$.next(isCompatible || false);
  // }

  // toggleTorch(): void {
  //   this.torchEnabled = !this.torchEnabled;
  // }

  // toggleTryHarder(): void {
  //   this.tryHarder = !this.tryHarder;
  // }
  // onSelectFile(event) {
  //   if (event.target.files && event.target.files[0]) {
  //     var reader = new FileReader();

  //     reader.readAsDataURL(event.target.files[0]); // read file as data url

  //     reader.onload = (event:any) => { // called once readAsDataURL is completed
  //       this.url = event.target.result;
  //     }
  //   }
  // }
  // fileChange(e){
  //   console.log(e)
  // }
}