import { Component, Inject } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Store } from '@ngrx/store';
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
  private selectedClient$;
  private selectedClient = 0;

  constructor(
    public alertCtrl: AlertController,
    private store: Store<any>) {

    this.selectedClient$ = this.store.select('selectedClients');
    this.selectedClient$.subscribe((id) => this.selectedClient = id);

  }

  clientSelect() {
    // let selectedClient = 0;
    console.log(this.selectedClient);
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
      let InputConfig = Object.assign({}, input, {checked: index === this.selectedClient ? true : false});
      alert.addInput(InputConfig);
    });

    alert.addButton('Cancel');

    alert.addButton({
      text: 'OK',
      handler: data => {
        this.store.dispatch({type: 'RESET_CONTENT'});
        this.store.dispatch({type: 'SELECT_CLIENT', payload: parseInt(data)});
      }
    });
    alert.present();
  }
}
