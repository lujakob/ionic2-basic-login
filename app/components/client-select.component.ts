import { Component } from '@angular/core';
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
  ) {
  }
  clientSelect() {

    let alert = this.alertCtrl.create();
    alert.setTitle('Choose client');

    alert.addInput({
      type: 'radio',
      label: 'none',
      value: '0',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Thomas',
      value: '1'
    });

    alert.addInput({
      type: 'radio',
      label: 'Bill',
      value: '2'
    });

    alert.addButton('Cancel');

    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log(data);
        this.client = data;
      }
    });
    alert.present();
  }

}
