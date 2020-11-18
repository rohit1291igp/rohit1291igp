import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EgvService } from 'app/services/egv.service';
import { environment } from "environments/environment";

@Component({
  selector: 'app-new-user-form',
  templateUrl: './new-user-form.component.html',
  styleUrls: ['./new-user-form.component.css']
})
export class NewUserFormComponent implements OnInit {

  env=environment
  newUser:FormGroup
  selectedFkid=""
  accounts_list=[]
  constructor(
    private fb:FormBuilder,
    private egvService:EgvService,
    public dialogRef: MatDialogRef<NewUserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data)
    this.setUserForm()
    if(this.env.userType==='egv_admin' || this.env.userType==='sub_egv_admin'){
      this.getAccountsList()
    }else{
      this.selectedFkid=localStorage.getItem('fkAssociateId');
    }
    if(this.data.account_type==='client'){
      this.setCompanyForm();
    }
  }

  setUserForm(){
    this.newUser=this.fb.group({
      display_name:["",Validators.required],
      email:["",Validators.compose([Validators.required,Validators.email])],
      username:["",Validators.required],
      mobile:["",Validators.required]
    })
  }
  setCompanyForm(){
    this.newUser.addControl('company_name',this.fb.control('',[Validators.required]))
      this.newUser.addControl('company_email',this.fb.control('',[]))
      this.newUser.addControl('company_url',this.fb.control('',[]))
      this.newUser.addControl('company_address',this.fb.control('',[]))
      this.newUser.addControl('company_number',this.fb.control('',[]))
  }

  getAccountsList(){
    this.egvService.getCompanyList().subscribe((res:any)=>{
      this.accounts_list=res;
    })
  }

  onSubmit(f:NgForm){
    console.log(f)
    if(f.valid){
      if(this.data.account_type==='client'){
        f.value.fk_associate_id=Number(localStorage.getItem('fkAssociateId'));
      }
      if(this.data.account_type==='manager' || this.data.account_type==='sub_manager'){
        f.value.fk_associate_id=Number(this.selectedFkid);
      }else if(this.data.account_type==='executive' || this.data.account_type==='sub_executive'){
        if(this.env.userType==='egv_admin' || this.env.userType==='sub_egv_admin'){
          f.value.fk_associate_id=Number(this.selectedFkid);
        }else{
          f.value.fk_associate_id=Number(localStorage.getItem('fkAssociateId'));
        }
      }
      // defaul
      f.value.usertype=this.UserTypesMap[this.data.account_type]
      f.value.id=0;

      console.log(f.value)
      this.egvService.createEgvUser(f.value).subscribe((res:any)=>{
        if(res.error){
          alert('unable to create new user')
        }else{
          alert('Egv user created successfully')
          this.dialogRef.close();
        }
      })
    }
  }

  UserTypesMap={
      client:0,
      manager:1,
      executive:2
    }

  // Convert Object to Query Params
  objectToStringParams(obj){
    let str=""
    Object.keys(obj).forEach(ele=>{
      str+=`${ele}=${obj[ele]}&`
    })
    str=str.substring(0,str.length-1)
    return str;
  }
  
  onClear(f:NgForm){
    f.resetForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
