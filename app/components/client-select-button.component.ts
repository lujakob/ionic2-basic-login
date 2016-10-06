import { Component, Inject } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { AppStore } from 'angular2-redux';
import { ClientsActions } from '../actions/clients.actions';
import { ContentActions } from '../actions/content.actions';
import { ClientSelectModalComponent } from './client-select-modal.component';

@Component({
  selector: 'client-select-button',
  template: '<ion-icon *ngIf="showBtn" #clientSelectButton name="person-add" (click)="openModal()" class="toolbar-client toolbar-button client-select-button"></ion-icon>',
  providers: []
})
export class ClientSelectButton {
    private client: number = 0;
    private showBtn: boolean = false;

    constructor(
        public modalCtrl: ModalController,
        private _appStore: AppStore,
        private _selectClientsActions: ClientsActions,
        private _contentActions: ContentActions) {

        this.showBtn = !_appStore.getState().user.singleClient;
    }


    openModal() {
        let modal = this.modalCtrl.create(ClientSelectModalComponent);
        modal.present();
    }

}
