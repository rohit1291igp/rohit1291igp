import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-deliveryboy',
    templateUrl: './add-deliveryboy.component.html',
    styleUrls: ['./add-deliveryboy.component.css']
})
export class AddDeliveryBoyComponent implements OnInit {

    myForm: FormGroup;
    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddDeliveryBoyComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {

    }

    ngOnInit() {
        this.myForm = this.fb.group({
            fname: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
            lname: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
            username: ['', Validators.required],
            phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });

        if (this.data) {
            let fullname = this.data.Full_Name.split(' ');
            this.myForm.controls['fname'].setValue(fullname[0]);
            this.myForm.controls['lname'].setValue(fullname[1]);
            this.myForm.controls['username'].setValue(this.data.User_Name);
            this.myForm.controls['phone'].setValue(this.data.Phone);
            this.myForm.controls['password'].setValue(this.data.Password);
        }

    }
    test = false;

    onSubmit(form: FormGroup) {
        if (this.data) {
            let data = form.value;
            // this.data.User_Name = data.username;
            // this.data.Full_Name = data.fname +' '+ data.lname;
            // this.data.Password = data.password;
            // this.data.Phone = data.phone;
            data['edit'] = true;
            data['fkUserId'] = this.data.fkUserId
            this.dialogRef.close(data);
        } else {
            this.dialogRef.close(form.value);
        }
    }

    blockSpecialChar(e) {
        var k;
        document.all ? k = e.keyCode : k = e.which;
        if (/^\d*\.?\d*$/.test(event.target['value'])) {
            event.target['value'] = ''
        }
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
    }
}
