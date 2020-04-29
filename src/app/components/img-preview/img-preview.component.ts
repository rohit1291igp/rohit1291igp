import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'img-dailog-box',
  template: `
          <div class="img-preview-container" *ngIf="data.imgSrc">
          <!-- <i class="fa fa-times" style="float: right; font-size:18px;" (click)="dialogRef.close()"></i> -->
          <i class="fa fa-times-circle" (click)="dialogRef.close()"></i>
           <img src="{{data.imgSrc}}" width="100%" height="auto">
           </div>`,
  styles: [`
          .img-preview-container{
            position:relative;
          }
          .img-preview-container>i{
            font-size: 18px;
            position: absolute;
            right: -17px;
            top: -19px;
          }
          .mat-dialog-container{
            padding : 18px;
          }
        `]
})
export class ImgPreviewComponent {

  constructor(
    public dialogRef: MatDialogRef<ImgPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  close(): void {
    this.dialogRef.close();
  }

}