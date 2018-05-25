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
  constructor(
    public BackendService: BackendService
  ) { }

  ngOnInit() {
    this.model.webstore = '';
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

}
