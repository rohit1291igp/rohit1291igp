
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { environment } from '../../../environments/environment';
@Component({
    selector: 'app-category-modal',
    templateUrl: './category-modal.component.html',
    styleUrls: ['./category-modal.component.css']
  })

export class CategoryModalComponent implements OnInit {
    @Output() catClick = new EventEmitter();
    @Input() model: any;

    ngOnInit() {
        console.log('initiated');
    }

    detect() {
        console.log('wow');
        this.catClick.emit();
    }

}
