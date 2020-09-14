import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { UtilityService } from '../../services/utility.service';
import { S3UploadService } from '../../services/s3Upload.service';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-download-email',
  templateUrl: './download-email.component.html',
  styleUrls: ['./download-email.component.css']
})
export class DownloadEmailComponent implements OnInit {

  constructor(
    public BackendService: BackendService,
    public UtilityService: UtilityService,
    public S3UploadService: S3UploadService
  ) { }

  ngOnInit() {
    this.getPDF();
  }

  ConvertToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';

    for (let i = 0; i < array.length; i++) {
        let line = '';
        // tslint:disable-next-line:forin
        for (const index in array[i]) {
            // tslint:disable-next-line:curly
            if (line !== '') line += ',';
            line += array[i][index];
        }
        line = line.replace(/;/g, " | ");
        str += line + '\r\n';
    }

    return str;
  }

  downloadCSV(csv, filename) {
    let csvFile;
    let downloadLink;
    // CSV file
    csvFile = new Blob([csv], {type: 'text/csv'});
    // Download link
    downloadLink = document.createElement('a');
    // File name
    downloadLink.download = filename;
    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);
    // Hide download link
    downloadLink.style.display = 'none';
    // Add the link to DOM
    document.body.appendChild(downloadLink);
    // Click download link
    downloadLink.click();
  }

  getPDF() {
    const _this = this;
    const splitURL = window.location.href.split('/');
    const fileFor = splitURL[splitURL.length - 3];
    const filedate = splitURL[splitURL.length - 2];
    const fileTime = splitURL[splitURL.length - 1];
    const fileName = fileFor + '_' + filedate + '_' + fileTime + '.csv';
    // let filePresent = false;
    const reqObj = {
      url: `linksInMail/getCsvLinkS3?fileFor=${fileFor}&filedate=${filedate}&fileTime=${fileTime}`,
      method: 'get'
    };
    _this.BackendService.makeAjax(reqObj, function(err, response, headers) {
      if (err || response.error) {
        console.log('Error=============>', err, response.errorCode);
      } else if(response.data) {
      const str = _this.ConvertToCSV(response.data);
      if(str){
        _this.downloadCSV(str, fileName);
      }
     }
   });



    // const request = new XMLHttpRequest();
    // request.open('HEAD', fileName, false);
    // request.send();
    // if (request.status ===  200) {
    //   filePresent = true;
    //   let doc = new jsPDF('p', 'pt', 'a4');
    //     let options = {
    //         pagesplit: true
    //     };
    //     let margin=10;
    //    // doc.addHTML(htmlNode,function() {
    //         doc.save(fileName);
    //    // });
    // } else {
    // const reqObj = {
    //   url: `v1/admin/linksInMail/getCsvLink/fileFor=${fileFor}&iledate=${filedate}&fileTime=${fileTime}`,
    //   method: 'get'
    // };

    // _this.BackendService.makeAjax(reqObj, function(err, response, headers) {
    //   if (err || response.error) {
    //     console.log('Error=============>', err, response.errorCode);
    //   } else {

    //   }
    // });
    // }
  }
}
