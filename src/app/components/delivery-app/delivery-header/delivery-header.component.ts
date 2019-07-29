import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-delivery-header',
  templateUrl: './delivery-header.component.html',
  styleUrls: ['./delivery-header.component.css']
})
export class DeliveryHeaderComponent implements OnInit {

  @Input() title:string;
  
  constructor() { }

  ngOnInit() {
  }

}
