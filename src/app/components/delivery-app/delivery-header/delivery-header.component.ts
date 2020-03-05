import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-delivery-header',
  templateUrl: './delivery-header.component.html',
  styleUrls: ['./delivery-header.component.css']
})
export class DeliveryHeaderComponent implements OnInit {

  @Input() title: string;
  @Input() reloadIcon: string;
  @Output() reload = new EventEmitter();
  rotateAnimation: boolean;
  constructor() { }

  ngOnInit() {
  }

  reloadPage() {
    this.reload.emit({ reload: 'true' });
    this.rotateAnimation = true;

    setTimeout(() => {
      this.rotateAnimation = false;
    }, 1000)
  }
}
