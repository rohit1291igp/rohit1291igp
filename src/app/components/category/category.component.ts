import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  model: any = {};
  public categories;
  public cat;
  public showSideBar = false;
  constructor(
    public BackendService: BackendService
  ) { }

  ngOnInit() {
    this.model.webstore = '';
    this.model.disabled = false;
  }

  addCategory() {
    // alert('Add');
    // this.model = {};
    console.log('Inside Add');
    this.cat = {};
    this.cat.add = 'add';
    this.showSideBar = true;
    $('#target :input').prop('disabled', true);
  }

  getCategories() {
    const _this = this;
    console.log(_this.model.webstore);
    if (_this.model.webstore !== '') {
    const reqObj = {
      url: 'categories/categorylist?fkAssociateId=' + _this.model.webstore,
      method: 'get'
      };
    this.BackendService.makeAjax(reqObj, function(err, response, headers){
      if (err || response.error) {
          console.log('Error=============>', err, response.errorCode);
          alert('There was an error while fetching categories');
      }
      _this.categories = response.data;
      console.log(_this.categories);
    });
  }
  };

  handleClick(event: Event) {
    event.preventDefault();
  };

  editCategory(cat, type) {
    this.showSideBar = true;
    this.cat = cat;
    this.cat.category = this.categories;
    this.cat.add = '';
    $('#target :input').prop('disabled', true);
    if (type === 'cat') {
      this.cat.selected = '';
      this.cat.showcatDD = false;
    }else {
      this.cat.selected = 'selected';
      this.cat.showcatDD = true;
    }
    this.cat.add = '';
    console.log(this.cat);
  };

  deleteCategory(id) {
    console.log(id);
    const _this = this;
      const reqObj = {
          url: `categories/deletecategory?id=${id}`,
          method: 'delete'
      };
        if (confirm(`Are you sure do you want to delete Category?`)) {
          _this.BackendService.makeAjax(reqObj, function(err, response, headers){
              if (err || response.error) {
                  console.log('Error=============>', err, response.errorCode);
                  return false;
              }
              alert(`The article has been deleted`);
              window.location.reload();
          });
        }else {
          return false;
        }
  }

}
