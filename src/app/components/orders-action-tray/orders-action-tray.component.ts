import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-orders-action-tray',
  templateUrl: './orders-action-tray.component.html',
  styleUrls: ['./orders-action-tray.component.css']
})
export class OrdersActionTrayComponent implements OnInit {
  private trayOpen: Boolean = false;
  @Output() onTrayToggle: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  toggleTray(e) {
    e.preventDefault();
    this.trayOpen = !this.trayOpen;
    console.log('trayOpen:', this.trayOpen);
  }

}
