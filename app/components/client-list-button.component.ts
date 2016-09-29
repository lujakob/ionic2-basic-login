import { Component, Inject } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { AppStore } from 'angular2-redux';
import { ClientsActions } from '../actions/clients.actions';
import { ContentActions } from '../actions/content.actions';

@Component({
  selector: 'client-list-button',
  template: '<ion-icon name="list" (click)="clientSelect()" class="toolbar-client toolbar-button client-list-button"></ion-icon>',
  providers: []
})
export class ClientListButton {
    private client: number = 0;
    constructor(
        public alertCtrl: AlertController,
        private _appStore: AppStore,
        private _selectClientsActions: ClientsActions,
        private _contentActions: ContentActions) {
    }

  /**
   * create and show alert component
   */
  clientSelect() {
    // let selectedClient = this.store.getState().clientId;
    let selectedClient = this._appStore.getState().selectClients.selectedClient;
    let alertInputs = [
      {
        type: 'radio',
        label: 'none',
        value: '0',
        checked: false
      },
      {
        type: 'radio',
        label: 'Thomas',
        value: '1',
        checked: false
      },
      {
        type: 'radio',
        label: 'Bill',
        value: '2',
        checked: false
      }
    ];

    let alert = this.alertCtrl.create();
    alert.setTitle('Choose client');

    alertInputs.forEach((input, index) => {
      let InputConfig = Object.assign({}, input, {checked: index === selectedClient ? true : false});
      alert.addInput(InputConfig);
    });

    alert.addButton('Cancel');

    alert.addButton({
      text: 'OK',
      handler: data => {
        //this.store.dispatch(ClientActions.setClient(parseInt(data)));
        //this.client = data;
        this._appStore.dispatch((this._contentActions.resetNextOffset()));
        this._appStore.dispatch(this._selectClientsActions.selectClient(parseInt(data)));
      }
    });
    alert.present();
  }
}
