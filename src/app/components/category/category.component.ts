import { Component, OnInit, trigger, sequence, transition, animate, style, state  } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BackendService } from '../../services/backend.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  animations: [
    trigger('anim', [
        transition('* => void', [
            style({ height: '*', opacity: '1', width: '0%'}),
            sequence([
                animate('0.9s ease', style({ height: '0', width: '0%', opacity: 0  }))
            ])
        ]),
        transition('void => active', [
            style({ height: '*', opacity: '0', background: '#f2f2f2'}),
            sequence([
                animate('.3s ease', style({ height: '*', width: '50%',  opacity: 0.3, 'animation-fill-mode': 'forwards'}))
            ])
        ])
    ])
  ]
})
export class CategoryComponent implements OnInit {
  model: any = {};
  public categories;
  public cat;
  public showSideBar: Boolean = false;
  public testAnimate = 'void';
  constructor(
    public BackendService: BackendService
  ) { }

  ngOnInit() {
    this.model.webstore = '';
    this.model.disabled = false;
  }

  // On Click on Add Btn
  addCategory() {
    console.log('Inside Add');
    this.cat = {};
    this.cat.add = 'add';
    this.showSideBar = true;
    this.testAnimate = 'active';
    $('#target :input').prop('disabled', true);
    $('body')[0].style.overflow = 'hidden';
  };

  // Get Categories
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
    });
  }
  };

  handleClick(event: Event) {
    event.preventDefault();
  };

  // Edit Category
  editCategory(cat, type) {
    this.showSideBar = true;
    $('body')[0].style.overflow = 'hidden';
    this.testAnimate = 'active';
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
    console.log(this.cat);
  };

  // Delete Category
  deleteCategory(id, fkasid) {
    console.log(id);
    const _this = this;
      const reqObj = {
          url: `categories/deletecategory?id=${id}&fkAssociateId=${fkasid}`,
          method: 'delete'
      };
        if (confirm(`Are you sure do you want to delete Category?`)) {
          _this.BackendService.makeAjax(reqObj, function(err, response, headers){
              if (err || response.error || response.status === 'Error') {
                  console.log('Error=============>', err, response.errorCode);
                  alert('There was an error while deleting categories');
                  return false;
              }
              alert(`The Category has been deleted`);
              _this.categories = response.data;
          });
        }else {
          return false;
        }
  };

  enableCategory(model) {
    const data = {};
        console.log(model);
        data['seo'] = {};
        data['id'] = model.id;
        data['fkasid'] = model.fkasid;
        data['status'] = 1;
        data['title'] = model.title;
        data['url'] = model.url;
        data['sortorder'] = model.sortorder;
        data['parentid'] = model.parentid;
        data['seo']['seotitle'] = model.seo.seotitle;
        data['seo']['seodescription'] = model.seo.seodescription;
        data['seo']['seokeywords'] = model.seo.seokeywords;
        console.log(data);

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
          alert('The Category has been Enabled.');
          _this.categories = response.data;
      });
  }

  // Parent Child Relationship!!!
  clickDetect(event) {
    console.log('Parent');
    console.log(event);
    this.showSideBar = false;
    $('body')[0].style.overflow = 'auto';
    this.testAnimate = 'void';
    $('#target :input').prop('disabled', false);
    if (event.data !== undefined) {
    this.categories = event.data;
    }
  };
}
