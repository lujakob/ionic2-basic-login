import { Component, Inject } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { AppStore } from 'angular2-redux';
import { SelectClientsActions } from '../actions/select-clients.actions';
import { ContentActions } from '../actions/content.actions';
import { ClientSelectModalComponent } from './client-select-modal.component';

@Component({
  selector: 'client-select-button',
  template: '<ion-icon #clientSelectButton name="person-add" (click)="openModal()" class="toolbar-client toolbar-button client-select-button"></ion-icon>',
  providers: []
})
export class ClientSelectButton {
  private client: number = 0;
  constructor(
    public modalCtrl: ModalController,
    private _appStore: AppStore,
    private _selectClientsActions: SelectClientsActions,
    private _contentActions: ContentActions) {


  }

  // ionViewDidEnter() {
  //   this.openModal();
  // }

  openModal() {
    let modal = this.modalCtrl.create(ClientSelectModalComponent);
    modal.present();
  }

}
