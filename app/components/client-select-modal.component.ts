import {Component} from '@angular/core';
import {Platform, NavParams, ViewController} from 'ionic-angular';
import { AppStore } from 'angular2-redux';
import { selectedClientsListSelector} from '../reducers/select-clients.reducer';
import { SelectClientsActions }from '../actions/select-clients.actions';

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
    <ion-segment [(ngModel)]="segmentView">
      <ion-segment-button value="all">
        All clients
      </ion-segment-button>
      <ion-segment-button value="applied">
        Selected clients
      </ion-segment-button>
    </ion-segment>
  </div>
  
  <div [ngSwitch]="segmentView">
    <ion-list *ngSwitchCase="'all'">
      <ion-item *ngFor="let client of clients$ | async" (click)="updateStatus(client)">
        <h2>{{client.title}}</h2>
      </ion-item>
    </ion-list>
  
    <ion-list *ngSwitchCase="'applied'">
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
  private clients$;
  public segmentView: string = 'all';

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    private _appStore: AppStore,
    private _clientActions: SelectClientsActions
  ) {
    this.clients$ = _appStore.select(selectedClientsListSelector);
  }

  ionViewWillEnter() {
    this._appStore.dispatch(this._clientActions.fetchClients());
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  updateStatus(client) {
    console.log(client);
  }
}