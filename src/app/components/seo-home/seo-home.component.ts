import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BackendService } from '../../services/backend.service';

@Component({
    selector: 'app-seo-home',
    styleUrls: ['./seo-home.component.css'],
    templateUrl: './seo-home.component.html'
})

export class SeoHomeComponent implements OnInit {
    model: any = {};
    constructor(
        public BackendService: BackendService
    ) {}

    ngOnInit() {
        this.model.webstore = '';
        this.model.title = '';
        this.model.metaTitle = '';
        this.model.metaDesc = '';
        this.model.keywords = '';
        this.model.status = '';
        this.model.id = '';
    }

    // Save Seo Data to DB
    saveSeoData() {
        const data = {};
        data['fkasid'] = this.model.webstore;
        data['seotitle'] = this.model.title;
        data['seodescription'] = this.model.metaDesc;
        data['seokeywords'] = this.model.metaKeywords;
        data['status'] = this.model.status;
        data['id'] = this.model.id;

        if (this.validateModel()) {
        const _this = this;
        const reqObj = {
            url: 'blogs/updatemetahome',
            payload: data,
            method: 'put'
        };

        _this.BackendService.makeAjax(reqObj, function(err, response, headers){
            if (err || response.error) {
                console.log('Error=============>', err, response.errorCode);
                alert('There was an error while creating the article');
            }
            alert('The meta information has been updated successfully.');
        });
        }
    }

    // Get meta data info on webstore change request
    getMetaDataOnStoreChange() {
        this.getSeoData((data) => {
            this.model.title = data.seotitle;
            this.model.metaTitle = data.seotitle;
            this.model.metaKeywords = data.seokeywords;
            this.model.metaDesc = data.seodescription;
            this.model.id = data.id;
            this.model.status = data.status;
        });
    }

    // Get Seo data from DB
    getSeoData(cb) {
        const _this = this;
        const fkasid = this.model.webstore;
        const reqObj = {
            url: `blogs/getmetahome?fkasid=${fkasid}`,
            method: 'get'
        };

        _this.BackendService.makeAjax(reqObj, function(err, response, headers){
            if (err || response.error) {
                console.log('Error=============>', err, response.errorCode);
                alert('There was an error while creating the article');
            }
            cb(response.data);
        });
    }

    // Validating model before creating/saving seo info
    validateModel() {

        if (this.model.title === '' || typeof(this.model.title) === 'undefined') {
            alert('Please enter the main content for the Meta.');
            return false;
        }

        if (this.model.metaDesc === '' || typeof(this.model.metaDesc) === 'undefined') {
            alert('Please enter the main content for the Meta.');
            return false;
        }

        return true;
    }

}
