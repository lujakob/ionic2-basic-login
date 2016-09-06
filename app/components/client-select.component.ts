import { Component, Inject } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'client-select',
  template: '<ion-icon name="person-add" (click)="clientSelect()" class="toolbar-client"></ion-icon>',
  providers: []
})
export class ClientSelectComponent {
  private client: number = 0;
  constructor(
    public alertCtrl: AlertController
  ) {}

  clientSelect() {
    // let selectedClient = this.store.getState().clientId;
    let selectedClient = 0;
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
        this.client = data;
      }
    });
    alert.present();
  }
}
