import {Component} from '@angular/core';
import * as firebase from 'firebase';
import {environment} from '../environments/environment';

firebase.initializeApp(environment.firebaseConfig);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'market-frontend';
}
