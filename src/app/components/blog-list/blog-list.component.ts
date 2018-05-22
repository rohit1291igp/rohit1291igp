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
    public editBlogDetails = {};
    public viewBlogDeatils = {};
    public saveBlogDetails = {};
    
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
            url: 'blogs/getblogs', // replace this with the endpoint for fetching blog list
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

    deleteBlog(list){
        const _this = this;
        const reqObj = {
            url: `blogs/deleteblog?id=${list.id}`, 
            method: 'delete'
        };
        if(confirm(`Are you sure do you want to delete post ${list.title}?`)){
        
        _this.BackendService.makeAjax(reqObj, function(err, response, headers){
            if (err || response.error) {
                console.log('Error=============>', err, response.errorCode);
                return false;
            }
            alert(`The article has been deleted`);
            window.location.reload();            
        });
    }
    else{
        return false;
    }

    }
    getCategories(list){
        list.forEach(element => {
            return element.title;
        });
    }
    editBlog(list){
        const _this = this;
       // alert('Inside Edit Blog');
        
    }
    saveBlog(list){
        const _this = this;
        _this.saveBlogDetails = {
            title:list.title,
            id:list.id,
            store:'IGP',
            category:{
                title:_this.getCategories(list.category)
            }
        }
        const reqObj = {
            url: 'blogs/updateblog', // replace this with the endpoint for fetching blog list
            method: 'put',
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
    viewBlog(list){
        const _this = this;
        _this.viewBlogDeatils = {
            title:list.title,
            id:list.id,
            store:'IGP',
            category:{
                title:_this.getCategories(list.category)
            }
        }
        
    }
    
    
}
