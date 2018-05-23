import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BackendService } from '../../services/backend.service';
import { UtilityService } from '../../services/utility.service';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-blog-view',
  templateUrl: './blog-view.component.html',
  styleUrls: ['./blog-view.component.css']
})
export class BlogViewComponent implements OnInit, AfterViewInit {
    // Glob Variables
    public blogList;
    public showGrid = false;
    public disableEditButton = 'visible';
    showCategoryModalFlag: Boolean = false;
    public categories;
    public type;
    public cnlBtnVisibility = 'hidden';
    public uniqueUrl = true;
    public cat = {};
    public subcat = {};
    public selectedCategories: Object = {};
    public files = [];
    public staticImages = [];
    public env = environment;
    public isUploading = false;

    public bucket = new S3(
      {
          accessKeyId : environment.s3AccessKey,
          secretAccessKey : environment.s3SecretKey
      }
    );

    constructor(
      public BackendService: BackendService,
      public UtilityService: UtilityService
    ) { }

    ngOnInit() {
      this.getBlogDetails();
    };

    // After View Initialized
    ngAfterViewInit() {
    if (this.type === 'view') {
        setTimeout(() => {
          $('#target :input').prop('disabled', true);
        }, 1000);
      }else if (this.type === 'edit') {
        setTimeout(() => {
          $('#target :input').prop('disabled', false);
        }, 1000);
      }
    };

    // Getting Blog Details- This method called first when component is loaded
    getBlogDetails() {
      const _this = this;
      const splitURL = window.location.href.split('/');
      const id = splitURL[splitURL.length - 2];
      _this.type = splitURL[splitURL.length - 1];
          const reqObj = {
              url: `blogs/getblogs?id=${id}`,
              method: 'get',
          };

          _this.BackendService.makeAjax(reqObj, function(err, response, headers){
              if (err || response.error) {
                  console.log('Error=============>', err, response.errorCode);
              }

              // assign value from the response to the blogList property
            _this.blogList = response;
            _this.showGrid = true;
            _this.blogList.data.bloglist[0].cat = {};
            _this.blogList.data.bloglist[0].subcat = {};
            _this.blogList.data.bloglist[0].files = [];
            _this.blogList.data.bloglist[0].featuredImage = '';
            if (_this.blogList.data.bloglist[0].category) {
              _this.blogList.data.bloglist[0].category.forEach(element => {
                _this.blogList.data.bloglist[0].cat[element.id] = true;
                _this.selectedCategories[element.id] = [];
                  if (element.subcategory) {
                  element.subcategory.forEach(el => {
                    _this.blogList.data.bloglist[0].subcat[el.id] = true;
                    _this.selectedCategories[element.id] = [].push(el.id);
                  });
                }
              });
            }
            console.log(_this.blogList.data.bloglist[0].cat);
            const reqObj = {
              url: 'categories/categorylist?fkAssociateId=' + _this.blogList.data.bloglist[0].fkasid,
              method: 'get'
              };
            _this.BackendService.makeAjax(reqObj, function(err, response, headers){
              if (err || response.error) {
                  console.log('Error=============>', err, response.errorCode);
                  alert('There was an error while fetching categories');
              }
              _this.categories = response.data;
            });
      });
    };

    // When click on Edit Btn
    editBlog() {
      const _this = this;
      _this.disableEditButton = 'hidden';
      _this.cnlBtnVisibility = 'visible';
      $('#target :input').prop('disabled', false);
    };

    // When click on Cancel Btn
    canBlog() {
      const _this = this;
      _this.disableEditButton = 'visible';
      _this.cnlBtnVisibility = 'hidden';
      $('#target :input').prop('disabled', true);
    };

    // For showing Category Modal
    showCategoryModal(data) {
      if (data.bloglist[0].fkasid) {
          this.showCategoryModalFlag = true;
          if (!this.categories.length) {
              this.getCategoryData(data);
          }
      }else {
        alert('Select Webstore to Proceed.');
      }
    }

    // Get all categories
    getCategoryData(data) {
      const _this = this;
      const reqObj = {
          url: 'categories/categorylist?fkAssociateId=' + data.bloglist[0].fkasid,
          method: 'get'
      };

      _this.BackendService.makeAjax(reqObj, function(err, response, headers){
          if (err || response.error) {
              console.log('Error=============>', err, response.errorCode);
              alert('There was an error while fetching categories');
          }
          _this.categories = response.data;
      });
    };

    isCategoryEmpty() {
      if (Object.keys(this.selectedCategories).length > 0) {
          return false;
      } else {
          return true;
      }
    };

    updateSelectedCategories(type, catData, subCatData, event) {
      catData = catData.toString();
      if (type === 'cat') {
          if (this.blogList.data.bloglist[0].cat[catData]) {
            this.selectedCategories[catData] = [];
          } else {
              this.setOrResetCheckboxes(this.selectedCategories[catData], null);
              delete this.selectedCategories[catData];
          }
      } else {
          if (this.blogList.data.bloglist[0].subcat[subCatData]) {
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

    setOrResetCheckboxes(subCatArray, catId) {
      const that = this;
      if (subCatArray && subCatArray.length) {
          subCatArray.forEach(element => {
            this.blogList.data.bloglist[0].subcat[element] = false;
          });
      } else if (catId) {
        this.blogList.data.bloglist[0].cat[catId] = true;
      } else {
          // return false;
      }
    };

    closeCategoryModal() {
      this.showCategoryModalFlag = false;
    };

    resetCategoriesOnStoreChange() {
      this.blogList.data.bloglist[0].cat = {};
      this.blogList.data.bloglist[0].subcat = {};
      this.selectedCategories = {};
      this.categories = [];
    };

    checkUniqueUrlValue(data) {
      const _this = this;
      const reqObj = {
          url: 'blogs/validateblogurl?url=' + data.url + '&fkAssociateId=' + data.fkasid,
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
    };

    // Delete blog Btn
    deleteBlog() {
      const _this = this;
      const splitURL = window.location.href.split('/');
      const id = splitURL[splitURL.length - 2];
      const reqObj = {
          url: `blogs/deleteblog?id=${id}`,
          method: 'delete'
      };
        if (confirm(`Are you sure do you want to delete post?`)) {
          _this.BackendService.makeAjax(reqObj, function(err, response, headers){
              if (err || response.error) {
                  console.log('Error=============>', err, response.errorCode);
                  return false;
              }
              alert(`The article has been deleted`);
            // window.location = '/#/blog-list';
          });
        }else {
          return false;
        }
    };

    // Saving blog
    saveBlog(detail) {
      const data = {};
        data['id'] = detail.bloglist[0].id;
        data['title'] = this.replaceNonAscii(detail.bloglist[0].title);
        data['shortdescription'] = this.replaceNonAscii(detail.bloglist[0].shortdescription);
        data['description'] = this.replaceNonAscii(detail.bloglist[0].description);
        data['status'] = detail.bloglist[0].status;
        data['url'] = detail.bloglist[0].url;
        data['imageurl'] = detail.bloglist[0].imageurl;
        data['fkasid'] = detail.bloglist[0].fkasid;
        data['flagfeatured'] = detail.bloglist[0].flagfeatured ? 1 : 0;
        data['seo'] = {};
        data['seo']['seotitle'] = detail.seo.seotitle;
        data['seo']['seodescription'] = detail.seo.seodescription;
        data['seo']['seokeywords'] = detail.seo.seokeywords;
        data['sortorder'] = detail.bloglist[0].sortorder;
        data['user'] = localStorage.getItem('associateName');
        data['categories'] =   this.selectedCategories;
        if (this.validateModel(data)) {
            this.saveBlogData(data);
        }
    };

    replaceNonAscii(value) {
      return value.replace(/[^\x00-\x7F]/g, '');
    };

    validateModel(data) {
      if (!(Object.keys(data['categories']).length) && !(Object.keys(this.blogList.data.bloglist[0].subcat).length)) {  //
          alert('Please select the Category and Subcategory for the article.');
          return false;
      }

      if (data['description'] === '' || typeof(data['description']) === 'undefined') {
          alert('Please enter the main content for the article.');
          return false;
      }

      if (!this.uniqueUrl) {
          alert('The selected URL already exists. Please enter a new URL');
          return false;
      }

      return true;
    };

    saveBlogData(data) {
      console.log(JSON.stringify(data));
      const _this = this;
      const reqObj = {
          url: 'blogs/updateblog',
          method: 'put',
          payload: data
      };

      _this.BackendService.makeAjax(reqObj, function(err, response, headers){
          if (err || response.error) {
              console.log('Error=============>', err, response.errorCode);
              alert('There was an error while saving the article');
              return false;
          }
          alert('The Article has been saved.');
          window.location.reload();
      });
    };

    // Upload Images
    uploadFiles(event) {
      const that = this;
      if (event.target.files.length > 0) {
          this.isUploading = true;
          let j = 0;
          for (let i = 0; i < event.target.files.length; i++) {
              const file = event.target.files[i];
              const params: any = {
                  Bucket : 'blogcreatives',
                  Key : this.renameFile(file),
                  ContentType : file.type,
                  Body : file,
                  ACL : 'public-read'
              };

              this.bucket.upload(params, (err, data) => {
                  j++;
                  if (err) {
                      console.log('There was an error uploading your file: ', err);
                      return false;
                  } else {

                      if (j === event.target.files.length - 1) {
                          that.isUploading = false;
                      }
                      this.blogList.data.bloglist[0].files.push(data);
                  }
                  console.log(j);
              });
          }
      }
  }

  makeFeaturedImage(imageName) {
    this.blogList.data.bloglist[0].featuredImage = imageName;
  }

  isFeaturedImage(imageName) {
      return (this.blogList.data.bloglist[0].featuredImage === imageName) ? true : false;
  }

  renameFile(file) {
    const name = file.name;
    const nameArray = name.split('.');
    let result = '';
    nameArray.splice(nameArray.length - 1, 0, Date.now() + '.');
    nameArray.map((element) => {
        result = result + element;
    });
    return result;
  };
}
