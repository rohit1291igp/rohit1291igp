import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  
  account_status
  user_type
  display_name
  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  user_type_map={
    Manager:1,
    Executive:2,
  }

  status_map={
    "Disabled":0,
    "Enabled":1
  }

  ngOnInit() {
    this.display_name=this.data.user.name;
    this.user_type=this.user_type_map[this.data.user.userType];
    this.account_status = this.data.user.accountEnabled;
    console.log(this.data)
  }

  onSubmit(){

  }

  onClear(){}

}
