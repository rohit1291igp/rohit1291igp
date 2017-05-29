import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(private _ngZone: NgZone) {}

  execute() {
    this._ngZone.run(() => {console.log('NgZone run executed')});
  }
}
