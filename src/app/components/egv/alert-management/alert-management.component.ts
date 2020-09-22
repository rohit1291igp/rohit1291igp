import { Component, OnInit } from '@angular/core';
import { EgvService } from 'app/services/egv.service';
import { NotificationComponent } from 'app/components/notification/notification.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-alert-management',
  templateUrl: './alert-management.component.html',
  styleUrls: ['./alert-management.component.css']
})
export class AlertManagementComponent implements OnInit {

  constructor(
    private egvService:EgvService,
    private _snackBar: MatSnackBar,
  ) { }

  alertsEmails:string[]=[]
  alertsMobile:string[]=[]
  alertLimit;
  addAlertEmailFlag=false;
  addAlertMobFlag=false;
  newAlertEmail=""
  newAlertMob=""

  // SOS
  sosEmails:string[]=[]
  sosMobile:string[]=[]
  SosLimit;
  addSosEmailFlag=false;
  addSosMobFlag=false;
  newSosEmail=""
  newSosMob=""

  userType=""
  fkid=""
  ngOnInit() {
    this.userType=localStorage.getItem('userType');
    if(this.userType!=='egv_admin'){
      this.fkid=localStorage.getItem('fkAssociateId')
      this.getAlerts();
      this.alertsEmails=[...this.alerts.alertEmailIds]
        this.alertsMobile=[...this.alerts.alertMobNums]
        this.alertLimit=this.alerts.alertLimit;
    
        // SOS
        this.sosEmails=[...this.alerts.sosemailIds]
        this.sosMobile=[...this.alerts.sosmobNums]
        this.SosLimit=this.alerts.sosLimit;
    }else{
      this.getAccounts()
    }
  }
  alerts= {
    "fkAssociateId": 882,
    "alertEmailIds": [
        "praks",
        "wfddsewdwe"
    ],
    "alertMobNums": ["0987654321","8899776655"],
    "alertLimit": 2000000,
    "sosLimit": 500000,
    "sosemailIds": [
        "praks",
        "sdwdff"
    ],
    "sosmobNums": ["879876437","34532335"]
}
  isAlertAmountDisabled=true;
  toggleAlertAmountBtn(){
    this.isAlertAmountDisabled=!this.isAlertAmountDisabled;
    if(this.isAlertAmountDisabled){
      this.alertLimit=this.alerts.alertLimit;
    }
  }
  isSosAmountDisabled=true;
  toggleSosAmountBtn(){
    this.isSosAmountDisabled=!this.isSosAmountDisabled;
    if(this.isSosAmountDisabled){
      this.SosLimit=this.alerts.sosLimit;
    }
  }
  alertAmountChange(){
    if(this.alertLimit && this.alertLimit>this.alerts.sosLimit){
      this.alerts.alertLimit=this.alertLimit;
      this.egvService.updateAlert(this.alerts).subscribe((res:any)=>{
        if(res.err){
          this.openSnackBar(res.result||res.errorMessage)
        }else{
          this.openSnackBar(res.result);
          this.getAlerts();
          this.isAlertAmountDisabled=true;
        }
      })
    }else{
      this.openSnackBar("Amount Should Be Greater Than Threshold 2")
    }
  }

  SosAmountChange(){
    if(this.SosLimit && this.SosLimit<this.alerts.alertLimit){
      this.alerts.sosLimit=this.SosLimit;
      this.egvService.updateAlert(this.SosLimit).subscribe((res:any)=>{
        if(res.err){
          this.openSnackBar(res.result||res.errorMessage)
        }else{
          this.openSnackBar(res.result);
          this.getAlerts();
          this.isSosAmountDisabled=true;
        }
      })
    }else{
      this.openSnackBar("Amount Should Be Less Than Threshold 1")
    }
  }

  onAdd(section){
    if(section==='alertEmail'){
      if(this.newAlertEmail){
        this.addAlertEmail(this.newAlertEmail)
      }
    }else if(section==='alertMob'){
      if(this.newAlertMob){
        this.addAlertMob(this.newAlertMob)
      }
    }else if(section==='sosEmail'){
      if(this.newSosEmail){
        this.addSosEmail(this.newSosEmail)
      }
    }else if(section==='sosMob'){
      if(this.newSosMob){
        this.addSosMob(this.newSosMob);
      }
    }
  }

  delete(list,value){
    let isConfirm=false
    isConfirm=confirm('Are sure you want to delete '+value+"?")
    if(isConfirm){
      if(list==='alert_mobile'){
          this.deleteAlertMobile(value)
      }else if(list==='alert_email'){
        this.deleteAlertEmail(value);
      }else if(list==='sos_mobile'){
        this.deleteSosMobile(value)
      }else if(list==='sos_email'){
        this.deleteSosEmail(value)
      }
    }
  }

  addAlertEmail(email){
    this.alerts.alertEmailIds.push(email)
    this.egvService.updateAlert(this.alerts).subscribe((res:any)=>{
      if(res.error){
        this.openSnackBar(res.result||res.errorMessage)
      }else{
        this.openSnackBar(res.result);
        this.addAlertEmailFlag=false;
        this.alertsEmails.push(email);
        this.newAlertEmail="";
      }
    });
  }
  addAlertMob(mob){
    this.alerts.alertMobNums.push(mob);
    this.egvService.updateAlert(this.alerts).subscribe((res:any)=>{
      if(res.error){
        this.openSnackBar(res.result||res.errorMessage)
      }else{
        this.openSnackBar(res.result);
        this.addAlertMobFlag=false;
        this.alertsMobile.push(mob);
        this.newAlertMob=""
      }
    })
  }

  addSosEmail(email){
    this.alerts.sosemailIds.push(email)
    this.egvService.updateAlert(this.alerts).subscribe((res:any)=>{
      if(res.error){
        this.openSnackBar(res.result||res.errorMessage)
      }else{
        this.openSnackBar(res.result);
        this.addSosEmailFlag=false;
        this.sosEmails.push(email);
        this.newSosEmail="";
      }
    });
  }

  addSosMob(mob){
    this.alerts.sosmobNums.push(mob);
    this.egvService.updateAlert(this.alerts).subscribe((res:any)=>{
      if(res.error){
        this.openSnackBar(res.result||res.errorMessage)
      }else{
        this.openSnackBar(res.result);
        this.addSosMobFlag=false;
        this.sosMobile.push(mob);
        this.newSosMob=""
      }
    })
  }

  deleteAlertMobile(mobile){
    this.alerts.alertMobNums.splice(this.alerts.alertMobNums.indexOf(mobile),1)
    this.egvService.updateAlert(this.alerts).subscribe((res:any)=>{
      if(res.error){
        this.openSnackBar(res.result||res.errorMessage)
      }else{
        this.openSnackBar(res.result)
        this.alertsMobile=[...this.alerts.alertMobNums]
      }
    })
  }

  deleteAlertEmail(email){
    this.alerts.alertEmailIds.splice(this.alerts.alertEmailIds.indexOf(email),1);
    this.egvService.updateAlert(this.alerts).subscribe((res:any)=>{
      if(res.error){
        this.openSnackBar(res.result||res.errorMessage)
      }else{
        this.openSnackBar(res.result)
        this.alertsEmails=[...this.alerts.alertEmailIds];
      }
    })
  }

  deleteSosMobile(mobile){
    this.alerts.sosmobNums.splice(this.alerts.sosmobNums.indexOf(mobile),1)
    this.egvService.updateAlert(this.alerts).subscribe((res:any)=>{
      if(res.error){
        this.openSnackBar(res.result||res.errorMessage)
      }else{
        this.openSnackBar(res.result)
        this.sosMobile=[...this.alerts.sosmobNums];
      }
    })
  }

  deleteSosEmail(email){
    this.alerts.sosemailIds.splice(this.alerts.sosemailIds.indexOf(email),1);
    this.egvService.updateAlert(this.alerts).subscribe((res:any)=>{
      if(res.error){
        this.openSnackBar(res.result||res.errorMessage)
      }else{
        this.openSnackBar(res.result)
        this.sosEmails=[...this.alerts.sosemailIds]
      }
    })
  }

  unique_accounts=[]
  getAccounts(){
    this.egvService.getCompanyList().subscribe((res:any)=>{
      this.unique_accounts=res;
    })
  }

  onFkidSelect(){
    this.getAlerts()
  }


  getAlerts(){
    this.egvService.getEGVAlerts(this.fkid).subscribe((res:any)=>{
      if(res.error){
        alert('something went wrong')
      }else{
        this.alerts=res.result;
        console.log(this.alerts)
        this.alertsEmails=[...this.alerts.alertEmailIds]
        this.alertsMobile=[...this.alerts.alertMobNums]
        this.alertLimit=this.alerts.alertLimit;
    
        // SOS
        this.sosEmails=[...this.alerts.sosemailIds]
        this.sosMobile=[...this.alerts.sosmobNums]
        this.SosLimit=this.alerts.sosLimit;
      }
    })
  }

  removeEmptyValue(arr){
    return arr.filter(ele=>ele!=="")
  }

  openSnackBar(data) {
    this._snackBar.openFromComponent(NotificationComponent, {
      data: data,
      duration: 5 * 1000,
      panelClass: ['snackbar-success'],
      verticalPosition: "top"
    });
  }

}
