
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
    public priviousvURL = '';
    constructor(
        public BackendService: BackendService
      ) { };

    ngOnInit() {
        this.model1 = this.model;
        console.log('initiated');
        this.model.webstore = '';
        if (this.model.add === 'add') { // Just to check if request from new cat OR from Edit button
        this.model.title = '';
        this.model.url = '';
        this.model.status = '';
        this.model.sortorder = 10000;
        this.model.metaTitle = '';
        this.model.metadesc = '';
        this.model.metakeywords = '';
        this.model.showcatDD = false;
        this.model.category = {};
        }
    }

    // To get Categories
    getCategories() {
        const _this = this;
        console.log(_this.model.webstore);
        if (_this.model.webstore !== '') {
        const reqObj = {
          url: 'categories/categorylist?fkAssociateId=' + _this.model.webstore,
          method: 'get'
          };
        this.BackendService.makeAjax(reqObj, function(err, response, headers){
          if (err || response.error || response.status === 'Error') {
              console.log('Error=============>', err, response.errorCode);
              alert('There was an error while fetching categories');
          }
          _this.model.category = response.data;
          _this.model.showcatDD = true;
          console.log(_this.model.category);
        });
      }
      };

    // checkUniqueUrlValue(data) {
    //     if (this.priviousvURL !== data.url) {
    //     const _this = this;
    //     const reqObj = {
    //         url: 'blogs/validateblogurl?url=' + data.url + '&fkAssociateId=' + data.fkasid,
    //         method: 'get'
    //     };

    //     _this.BackendService.makeAjax(reqObj, function(err, response, headers){
    //         if (response.data.unique === 'false') {
    //             alert('The selected URL already exists. Please enter a new URL');
    //             _this.uniqueUrl = false;
    //         } else {
    //             _this.uniqueUrl = true;
    //         }
    //     });
    //   }
    // };
    // detect() {
    //     console.log('wow');
    //     this.catClick.emit();
    // }

    // On Click of Canccel Btn
    cancelCategory(data) {
        console.log('Child');
        this.catClick.emit({data: data});
    };

    // Save Category
    saveCategory(model) {
        const data = {};
        console.log(model);
        data['seo'] = {};
        data['id'] = this.model.id;
        data['fkasid'] = this.model.fkasid;
        data['title'] = this.model.title;
        data['status'] = this.model.status;
        data['url'] = this.model.url;
        data['sortorder'] = this.model.sortorder;
        data['parentid'] = this.model.parentid;
        data['seo']['seotitle'] = this.model.seo.seotitle;
        data['seo']['seodescription'] = this.model.seo.seodescription;
        data['seo']['seokeywords'] = this.model.seo.seokeywords;
        console.log(data);

      const _this = this;
      const reqObj = {
          url: 'categories/updatecategory',
          method: 'put',
          payload: data
      };

      _this.BackendService.makeAjax(reqObj, function(err, response, headers){
        console.log(err);
        console.log(response.data);
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

    setParentId(model) {
        alert('Inside Set ParentId');
        console.log(model);
    };

    // Add new Category
    addCategory(model) {
        const data = {};
        data['seo'] = {};
        data['fkasid'] = this.model.webstore;
        data['title'] = this.model.title;
        data['status'] = this.model.status;
        data['url'] = this.model.url;
        data['sortorder'] = this.model.sortorder;
        data['parentid'] = this.model.parentid;
        data['seo']['seotitle'] = this.model.metaTitle;
        data['seo']['seodescription'] = this.model.metadesc;
        data['seo']['seokeywords'] = this.model.metakeywords;
        console.log(data);

        const _this = this;
        const reqObj = {
          url: 'categories/createcategory',
          method: 'post',
          payload: data
        };

        _this.BackendService.makeAjax(reqObj, function(err, response, headers){
          if (err || response.error || response.status === 'Error') {
              console.log('Error=============>', err, response.errorCode);
              alert('There was an error while saving the article');
              return false;
          }
          alert('The Category has been Created.');
          _this.cancelCategory(response.data);
         // window.location.reload();
        });
    };
}
