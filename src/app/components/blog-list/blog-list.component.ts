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
    public showGrid = false;
    
    constructor(
        public BackendService: BackendService,
        public UtilityService: UtilityService
    ) {}

    ngOnInit() {
        // place values that needs to initialized on init of the component, if necessary
        this.getBlogList();
    }

    // helper for fetching blog list from API
    getBlogList() {
        const _this = this;
        const reqObj = {
            url: 'blogs/getbloglist', // replace this with the endpoint for fetching blog list
            method: 'get',
        };

        _this.BackendService.makeAjax(reqObj, function(err, response, headers){
            if (err || response.error) {
                console.log('Error=============>', err, response.errorCode);
            }

            // assign value from the response to the blogList property
           _this.blogList = response;
           _this.showGrid = true;
           //console.log(this.blogList);
        });
       
    }

    deletePost(list){
        const _this = this;

        const reqObj = {
            url: `blogs/deletebloglist?${list.id}`, // replace this with the endpoint for fetching blog list
            method: 'delete',
        };
        confirm(`Are you sure you want to delete post <b>${list.title}</b>  it?`);
        
        _this.BackendService.makeAjax(reqObj, function(err, response, headers){
            if (err || response.error) {
                console.log('Error=============>', err, response.errorCode);
                return false;
            }
            alert(`The article has been deleted`);
            window.location.reload();       

        });

    }
    
}
