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

  newUser:FormGroup
  constructor(
    private fb:FormBuilder,
    private egvService:EgvService,
    public dialogRef: MatDialogRef<NewUserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data)
    this.newUser=this.fb.group({
      associateName:["",Validators.required],
      contactPerson:["",Validators.required],
      email:["",Validators.compose([Validators.required,Validators.email])],
      address:["",Validators.required],
      username:["",Validators.required],
      password:["",Validators.required],
      phone:["",Validators.required]
    })
  }

  onSubmit(f:NgForm){
    console.log(f)
    if(f.valid){
      if(this.data.account_type==='manager'){
        f.value.EGVManager=true;
        f.value.EGVExecutive=false;
      }else if(this.data.account_type==='executive'){
        f.value.EGVExecutive=true;
        f.value.EGVManager=false;
        f.value.fk_associate_id=Number(localStorage.getItem('fkAssociateId'));
      }
      f.value.status=1;
      f.value.id=0;
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
