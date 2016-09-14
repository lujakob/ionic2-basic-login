import { Component, Inject } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Store } from '@ngrx/store';

import { ContentActions } from '../actions/content.actions';
import { SelectClientActions} from '../actions/select-clients.actions';

@Component({
  selector: 'client-select',
  template: '<ion-icon name="person-add" (click)="clientSelect()" class="toolbar-client"></ion-icon>'
})
export class ClientSelectComponent {
  private client: number = 0;
  private selectedClient$;
  private selectedClient = 0;

  constructor(
    public alertCtrl: AlertController,
    private store: Store<any>,
    private contentActions: ContentActions,
    private selectClientsActions: SelectClientActions) {

    this.selectedClient$ = this.store.select('selectedClients');
    this.selectedClient$.subscribe((id) => this.selectedClient = id);

  }

  clientSelect() {

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
        // new content is being fetchend, so reset the offset first
        this.store.dispatch(this.contentActions.resetOffset());
        // select client. this action triggers an effect, to load new data
        this.store.dispatch(this.selectClientsActions.selectClient(parseInt(data)));
      }
    });
    alert.present();
  }
}
