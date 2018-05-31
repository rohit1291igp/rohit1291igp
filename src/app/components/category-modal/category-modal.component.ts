
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BackendService } from '../../services/backend.service';
@Component({
    selector: 'app-category-modal',
    templateUrl: './category-modal.component.html',
    styleUrls: ['./category-modal.component.css']
  })

export class CategoryModalComponent implements OnInit {
    @Output() catClick = new EventEmitter();
    @Input() model: any;
    public model1 = this.model;
    public uniqueUrl = true;
    public specCharUrl = false;
    public previousURL = '';
    constructor(
        public BackendService: BackendService
      ) { };

    ngOnInit() {
        this.model1 = {...this.model};
        this.previousURL = this.model1.url;
        console.log('initiated');
        if (this.model1.add === 'add') { // Just to check if request for new cat OR from Edit button
        this.model1.fkasid = '';
        this.model1.title = '';
        this.model1.url = '';
        this.model1.status = '';
        this.model1.sortorder = 10000;
        this.model1.metaTitle = '';
        this.model1.metadesc = '';
        this.model1.metakeywords = '';
        this.model1.showcatDD = false;
        this.model1.category = {};
        }
    }

    // To get Categories
    getCategories() {
        const _this = this;
        console.log(_this.model1.fkasid);
        if (_this.model1.fkasid !== '' && _this.model1.fkasid !== undefined) {
            const reqObj = {
            url: 'categories/categorylist?fkAssociateId=' + _this.model1.fkasid,
            method: 'get'
            };
            this.BackendService.makeAjax(reqObj, function(err, response, headers){
                if (err || response.error || response.status === 'Error') {
                    console.log('Error=============>', err, response.errorCode);
                    alert('There was an error while fetching categories');
                }
                _this.model1.category = response.data;
                _this.model1.showcatDD = true;
            });
        }
    };

    // Check URL has any special character and Unique WRT webstore
    checkUniqueUrlValue(data) {
        if (data.fkasid !== '' && data.fkasid !== undefined) {
            const format = /[ !@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]/;
            const value = format.test(data.url);
            if (value) {
                alert('Please remove special characters from URL!!!');
            // data.url = this.previousURL;
                this.specCharUrl = true;
                return true;
            } else
            if (!value && this.previousURL !== data.url) {
            this.specCharUrl = false;
            const _this = this;
            const reqObj = {
                url: 'categories/validatecategoryurl?url=' + data.url + '&fkAssociateId=' + data.fkasid,
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
        } else {
            alert('Please select Webstore!!!');
        }
    };

    // On Click of Canccel Btn
    cancelCategory(data) {
        console.log('Child');
        this.catClick.emit({data: data});
    };

    // Save Category
    saveCategory() {
        const data = {};
        data['seo'] = {};
        data['id'] = this.model1.id;
        data['fkasid'] = this.model1.fkasid;
        data['title'] = this.model1.title;
        data['status'] = this.model1.status;
        data['url'] = this.model1.url;
        data['sortorder'] = this.model1.sortorder;
        data['parentid'] = this.model1.parentid;
        data['seo']['seotitle'] = this.model1.seo.seotitle;
        data['seo']['seodescription'] = this.model1.seo.seodescription;
        data['seo']['seokeywords'] = this.model1.seo.seokeywords;
        console.log(data);

        if (this.validateModel()) {
            const _this = this;
        const reqObj = {
            url: 'categories/updatecategory',
            method: 'put',
            payload: data
        };

        _this.BackendService.makeAjax(reqObj, function(err, response, headers){
            if (err || response.error || response.status === 'Error') {
                console.log('Error=============>', err, response.errorCode);
                alert(`There was an error while saving the Category.
                        Error: ${response.data.error}`);
                return false;
            }
            alert('The Category has been saved.');
            _this.cancelCategory(response.data);
        });
        }
    }

    // Add new Category
    addCategory() {
        const data = {};
        data['seo'] = {};
        data['fkasid'] = this.model1.fkasid;
        data['title'] = this.model1.title;
        data['status'] = this.model1.status;
        data['url'] = this.model1.url;
        data['sortorder'] = this.model1.sortorder;
        data['parentid'] = this.model1.parentid;
        data['seo']['seotitle'] = this.model1.metaTitle;
        data['seo']['seodescription'] = this.model1.metadesc;
        data['seo']['seokeywords'] = this.model1.metakeywords;
        console.log(data);

        if (this.validateModel()) {
        const _this = this;
        const reqObj = {
          url: 'categories/createcategory',
          method: 'post',
          payload: data
        };

        _this.BackendService.makeAjax(reqObj, function(err, response, headers){
          if (err || response.error || response.status === 'Error') {
              console.log('Error=============>', err, response.errorCode);
              alert('There was an error while saving the category');
              return false;
          }
          alert('The Category has been Created.');
          _this.cancelCategory(response.data);
        });
        }
    };

    // Validate model before saving/creating
    validateModel() {

        if (this.model1.fkasid === '' && typeof(this.model1.fkasid) === 'undefined') {
            alert('Please enter the main content for the category.');
            return false;
        }

        if (this.model1.title === '' || typeof(this.model1.title) === 'undefined') {
            alert('Please enter the main content for the category.');
            return false;
        }

        if (this.model1.url === '' || typeof(this.model1.url) === 'undefined') {
            alert('Please enter the main content for the category.');
            return false;
        }

        if (!this.uniqueUrl) {
            alert('The selected URL already exists. Please enter a new URL');
            return false;
        }

        if (this.specCharUrl) {
            alert('Please remove special character from URL');
            return false;
        }

        return true;
    };
}
