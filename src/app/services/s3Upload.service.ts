import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { environment } from '../../environments/environment';

@Injectable()
export class S3UploadService {

    public bucket = new S3(
        {
            accessKeyId : environment.s3AccessKey,
            secretAccessKey : environment.s3SecretKey
        }
    );

    constructor() {}

    /*
        uploads given image to AWS S3 Storage
        @param {File} file - File to be uploaded
        @param {String} bucketName - Name of the S3 bucket to which the file should be uploaded
        @param {String} acl - Access control permissions
        @param {Boolean} shouldRenameFile - Flag for enabling/disabling file renaming with timestamp
        @param {function} cb - callback function that will be called once upload is complete.
    */
    uploadImageToS3 (file, bucketName, acl, shouldRenameFile , cb) {
        const params: any = {
            Bucket : bucketName,
            Key : shouldRenameFile ? this.renameFile(file) : file.name,
            ContentType : file.type,
            Body : file,
            ACL : acl
        };
        this.bucket.upload(params, (err, data) => {
            if (err) {
                cb(err, '');
            } else {
                cb ('', data);
            }
        });
    }

    /*
        renames file by appending timestamp before extension
        @param {File} file - File to be renamed
        @return {String} - Renamed file name
    */
    renameFile(file) {
        const name = file.name;
        const nameArray = name.split('.');
        let result = '';
        nameArray.splice(nameArray.length - 1, 0, Date.now() + '.');
        nameArray.map((element) => {
            result = result + element;
        });
        return result;
    }
}
