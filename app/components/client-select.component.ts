import { Component, Inject } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { AppStore } from 'angular2-redux';
import { selectedClientSelector } from '../reducers/select-clients-reducer';
import { SelectClientsActions } from '../actions/select-clients-actions';

@Component({
  selector: 'client-select',
  template: '<ion-icon name="person-add" (click)="clientSelect()" class="toolbar-client"></ion-icon>',
  providers: []
})
export class ClientSelectComponent {
  private client: number = 0;
  constructor(
    public alertCtrl: AlertController,
    private _appStore: AppStore,
    private _selectClientsActions: SelectClientsActions) {
  }

  clientSelect() {
    // let selectedClient = this.store.getState().clientId;
    let selectedClient = this._appStore.getState().selectClients;
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
        this._appStore.dispatch(this._selectClientsActions.selectClient(parseInt(data)));
      }
    });
    alert.present();
  }
}
