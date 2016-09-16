import {Component} from '@angular/core';
import {Platform, NavParams, ViewController} from 'ionic-angular';

@Component({
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>
      Select clients
    </ion-title>
    <ion-buttons start>
      <button (click)="dismiss()">
        <span primary showWhen="ios">Cancel</span>
        <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content padding>
  <div>
    <ion-segment [(ngModel)]="pet">
      <ion-segment-button value="all">
        All clients
      </ion-segment-button>
      <ion-segment-button value="applied">
        Selected clients
      </ion-segment-button>
    </ion-segment>
  </div>
  
  <div [ngSwitch]="pet">
    <ion-list *ngSwitchCase="'all'">
      <ion-item>
        <h2>Ruby</h2>
      </ion-item>
      <ion-item>
        <h2>Ruby</h2>
      </ion-item>
      <ion-item>
        <h2>Ruby</h2>
      </ion-item>
      <ion-item>
        <h2>Ruby</h2>
      </ion-item>
      <ion-item>
        <h2>Ruby</h2>
      </ion-item>
      
    </ion-list>
  
    <ion-list *ngSwitchCase="'applied'">
      <ion-item>
        <h2>Luna</h2>
      </ion-item>
      <ion-item>
        <h2>Luna</h2>
      </ion-item>
      <ion-item>
        <h2>Luna</h2>
      </ion-item>
      <ion-item>
        <h2>Luna</h2>
      </ion-item>
      <ion-item>
        <h2>Luna</h2>
      </ion-item>
      <ion-item>
        <h2>Luna</h2>
      </ion-item>
      <ion-item>
        <h2>Luna</h2>
      </ion-item>
      <ion-item>
        <h2>Luna</h2>
      </ion-item>
      
    </ion-list>
  </div>
</ion-content>
`
})
export class ClientSelectModalComponent {
  character;
  public pet: string = 'all';

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    var characters = [
      {
        name: 'Gollum',
        quote: 'Sneaky little hobbitses!',
        image: 'img/avatar-gollum.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'River Folk' },
          { title: 'Alter Ego', note: 'Smeagol' }
        ]
      },
      {
        name: 'Frodo',
        quote: 'Go back, Sam! I\'m going to Mordor alone!',
        image: 'img/avatar-frodo.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'Shire Folk' },
          { title: 'Weapon', note: 'Sting' }
        ]
      },
      {
        name: 'Samwise Gamgee',
        quote: 'What we need is a few good taters.',
        image: 'img/avatar-samwise.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'Shire Folk' },
          { title: 'Nickname', note: 'Sam' }
        ]
      }
    ];
    this.character = characters[this.params.get('charNum')];
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}