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
                animate('.4s ease', style({ height: '*', width: '0%', opacity: '.7',  })),
                animate('0.9s ease', style({ height: '0', width: '0%', opacity: 0  }))
            ])
        ]),
        transition('void => active', [
            style({ height: '*', opacity: '0', background: '#f2f2f2',  position: 'fixed', top: '51px', right: '0px','animation-fill-mode': 'forwards' }),
            sequence([
                animate('.4s ease', style({ height: '*', width: '0%', position: 'fixed', opacity: '.2'})),
                animate('.9s ease', style({ height: '*', width: '50%', position: 'fixed', opacity: 1, 'animation-fill-mode': 'forwards'}))
            ])
        ])
    ])
  ]
})
export class CategoryComponent implements OnInit {
  model: any = {};
  public categories;
  public cat;
  public showSideBar = false;
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
    // alert('Add');
    // this.model = {};
    console.log('Inside Add');
    this.cat = {};
    this.cat.add = 'add';
    this.showSideBar = true;
    this.testAnimate = 'active';
    $('#target :input').prop('disabled', true);
    $('body').addClass('hideSB'); // To Hide scroll bar
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
      console.log(_this.categories);
    });
  }
  };

  handleClick(event: Event) {
    event.preventDefault();
  };

  // Edit Category
  editCategory(cat, type) {
    this.showSideBar = true;
    this.testAnimate = 'active';
    $('body').addClass('hideSB'); // To Hide scroll bar
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
  deleteCategory(id) {
    console.log(id);
    const _this = this;
      const reqObj = {
          url: `categories/deletecategory?id=${id}`,
          method: 'delete'
      };
        if (confirm(`Are you sure do you want to delete Category?`)) {
          _this.BackendService.makeAjax(reqObj, function(err, response, headers){
            console.log(err);
            console.log(response);
              if (err || response.error || response.status === 'Error') {
                  console.log('Error=============>', err, response.errorCode);
                  return false;
              }
              alert(`The Category has been deleted`);
              window.location.reload();
          });
        }else {
          return false;
        }
  };

  // Parent Child Relationship!!!
  clickDetect(event) {
    console.log('Parent');
    console.log(event);
    this.showSideBar = false;
    this.testAnimate = 'void';
    $('#target :input').prop('disabled', false);
    $('body').removeClass('hideSB');
    $('body').addClass('showSB'); // To show scroll bar
  };
}
