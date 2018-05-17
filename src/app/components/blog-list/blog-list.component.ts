import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NgForm } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { UtilityService } from '../../services/utility.service';


@Component({
    selector: 'app-blog-list',
    templateUrl: './blog-list.component.html',
    styleUrls: ['./blog-list.component.css']
})

export class BlogListComponent implements OnInit {
    public blogList = [];

    constructor(
        public BackendService: BackendService,
        public UtilityService: UtilityService
    ) {}

    ngOnInit() {
        // place values that needs to initialized on init of the component, if necessary
    }

    // helper for fetching blog list from API
    getBlogList() {
        const _this = this;
        const reqObj = {
            url: 'blogs/createblog', // replace this with the endpoint for fetching blog list
            method: 'get',
        };

        _this.BackendService.makeAjax(reqObj, function(err, response, headers){
            if (err || response.error) {
                console.log('Error=============>', err, response.errorCode);
            }

            // assign value from the response to the blogList property
            _this.blogList = response;
        });
    }
}
