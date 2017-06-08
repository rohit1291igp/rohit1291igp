import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-orders-action-tray',
  templateUrl: './orders-action-tray.component.html',
  styleUrls: ['./orders-action-tray.component.css']
})
export class OrdersActionTrayComponent implements OnInit {
  private trayOpen: Boolean = false;
  @Output() onTrayToggle: EventEmitter<any> = new EventEmitter();
  sidePanelDataLoading = true;
  private sidePanelData: Object;

  constructor(
      private BackendService : BackendService
      ) { }

  ngOnInit() {
  }

  toggleTray(e) {
    e.preventDefault();
    this.trayOpen = !this.trayOpen;
    console.log('trayOpen:', this.trayOpen);
  }

}
