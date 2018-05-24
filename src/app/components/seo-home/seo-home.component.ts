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
        // logic for getting the initial data. If data is available, then bind it to the model
        this.model.webstore = '';
        this.model.title = '';
        this.model.metaTitle = '';
        this.model.metaDesc = '';
        this.model.keywords = '';
    }

    saveSeoData() {
        const data = {};
        data['fkasid'] = this.model.webstore;
        data['seotitle'] = this.model.title;
        data['seodescription'] = this.model.metaDesc;
        data['seokeywords'] = this.model.metaKeywords;

        console.log(data);

        // get the endpoint from API team, code the logic for saving data and refreshing the page
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

    getMetaDataOnStoreChange() {
        this.getSeoData((data) => {
            this.model.title = data.seotitle;
            this.model.metaTitle = data.seotitle;
            this.model.metaKeywords = data.seokeywords;
            this.model.metaDesc = data.seodescription;
        });
    }

    getSeoData(cb) {
        // get the endpoint from API team, code the logic for fetching data
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

}
