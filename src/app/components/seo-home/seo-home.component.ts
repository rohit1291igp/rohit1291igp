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
        data['title'] = this.model.title;
        data['metaTitle'] = this.model.metaTitle;
        data['metaDesc'] = this.model.metaDesc;
        data['metaKeywords'] = this.model.metaKeywords;

        console.log(data);

        // get the endpoint from API team, code the logic for saving data and refreshing the page

    }

    getSeoData() {
        // get the endpoint from API team, code the logic for fetching data
    }

}
