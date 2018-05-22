import { Component, OnInit } from '@angular/core';
import {environment} from '../../../environments/environment';
import { NgForm } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { UtilityService } from '../../services/utility.service';

@Component({
    selector: 'app-blog-create',
    templateUrl: './blog-create.component.html',
    styleUrls: ['./blog-create.component.css']
  })

export class BlogCreateComponent implements OnInit {
    model: any = {};
    showCategoryModalFlag: Boolean = false;

    // sample data for category list
    public categories = [];
    public selectedCategories: Object = {};
    public uniqueUrl = true;

    constructor(
        public BackendService: BackendService,
        public UtilityService: UtilityService
    ) {}

    ngOnInit() {
        this.model.webstore = '';
        this.model.status = '';
        this.model.url = '';
        this.model.isFeatured = 0;
        this.model.title = '';
        this.model.metaTitle = '';
        this.model.desc = '';
        this.model.metaDesc = '';
        this.model.keywords = '';
        this.model.category = {};
        this.model.subcategory = {};
        this.model.featuredImage = '';
        this.model.sortOrder = '';
    }

    createBlogPost() {
        const data = {};
        data['seo'] = {};
        data['fkasid'] = this.model.webstore;
        data['title'] = this.replaceNonAscii(this.model.title);
        data['shortdescription'] = this.replaceNonAscii(this.model.desc);
        data['description'] = this.replaceNonAscii(this.model.description);
        data['status'] = this.model.status;
        data['url'] = this.model.url;
        data['imageurl'] = this.model.featuredImage;
        data['flagfeatured'] = this.model.isFeatured ? 1 : 0;
        data['seo']['seotitle'] = this.model.metaTitle;
        data['seo']['seodescription'] = this.model.metaDesc;
        data['seo']['seokeywords'] = this.model.keywords;
        data['sortorder'] = this.model.sortOrder;
        data['user'] = localStorage.getItem('associateName');
        data['categories'] = this.selectedCategories;
        console.log(data);
        if (this.validateModel()) {
            this.saveBlogData(data);
        }
    }

    replaceNonAscii(value) {
        return value.replace(/[^\x00-\x7F]/g, '');
    }

    showCategoryModal() {
        console.log('sadfasdf');
        if (this.model.webstore) {
            this.showCategoryModalFlag = true;
            if (!this.categories.length) {
                this.getCategoryData();
            }
        }else {
            alert('Select Webstore to Proceed.');
        }
    }

    closeCategoryModal() {
        this.showCategoryModalFlag = false;
    }

    updateSelectedCategories(type, catData, subCatData, event) {
        catData = catData.toString();
        if (type === 'cat') {
            if (this.model.category[catData]){
                this.selectedCategories[catData] = [];
            } else {
                this.setOrResetCheckboxes(this.selectedCategories[catData], null);
                delete this.selectedCategories[catData];
            }
        } else {
            if (this.model.subcategory[subCatData]) {
                this.setOrResetCheckboxes(null, catData);
                if (this.selectedCategories[catData] && this.selectedCategories[catData].length) {
                    this.selectedCategories[catData].push(subCatData);
                } else {
                    this.selectedCategories[catData] = [];
                    this.selectedCategories[catData].push(subCatData);
                }
            } else {
                this.selectedCategories[catData].splice(this.selectedCategories[catData].indexOf(subCatData), 1);
            }
        }
    };

    isCategoryEmpty() {
        if (Object.keys(this.selectedCategories).length > 0) {
            return false;
        } else {
            return true;
        }
    }

    setOrResetCheckboxes(subCatArray, catId) {
        const that = this;
        if (subCatArray && subCatArray.length) {
            subCatArray.forEach(element => {
                that.model.subcategory[element] = false;
            });
        } else if (catId) {
            that.model.category[catId] = true;
        } else {
            // return false;
        }
    }

    validateModel() {
        if (!(Object.keys(this.model.category).length) && !(Object.keys(this.model.subcategory).length)) {
            alert('Please select the Category and Subcategory for the article.');
            return false;
        }

        console.log(this.model.description);
        console.log(typeof(this.model.description));

        if (this.model.description === '' || typeof(this.model.description) === 'undefined') {
            alert('Please enter the main content for the article.');
            return false;
        }

        if (!this.uniqueUrl) {
            alert('The selected URL already exists. Please enter a new URL');
            return false;
        }

        return true;
    }

    resetCategoriesOnStoreChange() {
        this.model.category = {};
        this.model.subcategory = {};
        this.selectedCategories = {};
        this.categories = [];
    }

    checkUniqueUrlValue() {
        const _this = this;
        const reqObj = {
            url: 'blogs/validateblogurl?url=' + this.model.url + '&fkAssociateId=' + this.model.webstore,
            method: 'get'
        };

        _this.BackendService.makeAjax(reqObj, function(err, response, headers){
            if (response.data.unique === 'false') {
                alert('The selected URL already exists. Please enter a new URL');
                _this.uniqueUrl = false;
            } else {
                _this.uniqueUrl = true;
            }
        });
    }

    getCategoryData() {
        const _this = this;
        const reqObj = {
            url: 'categories/categorylist?fkAssociateId=' + _this.model.webstore,
            method: 'get'
        };

        _this.BackendService.makeAjax(reqObj, function(err, response, headers){
            if (err || response.error) {
                console.log('Error=============>', err, response.errorCode);
                alert('There was an error while fetching categories');
            }
            _this.categories = response.data;
        });
    }

    saveBlogData(data) {
        console.log(JSON.stringify(data));
        const _this = this;
        const reqObj = {
            url: 'blogs/createblog',
            method: 'post',
            payload: data
        };

        _this.BackendService.makeAjax(reqObj, function(err, response, headers){
            if (err || response.error) {
                console.log('Error=============>', err, response.errorCode);
                alert('There was an error while creating the article');
            }
            alert('The Article has been created.');
            window.location.reload();
        });
    }
}

