import { Component, ViewChild } from '@angular/core';
import { Platform, NavParams, ViewController, Content, LoadingController } from 'ionic-angular';
import { TruncatePipe } from '../pipes/truncate';
import { AppStore } from 'angular2-redux';
import { allClientsSelector, selectedClientsSelector, isFetchingSelector } from '../reducers/clients.reducer';
import { ClientsActions }from '../actions/clients.actions';
import { BmgInfiniteScroll } from './bmg-infinite-scroll.component';

@Component({
    template: `
<ion-header>
    <ion-toolbar>
        <ion-title>Select clients</ion-title>
        <ion-buttons start>
            <button (click)="dismiss()">
                <span primary showWhen="ios">Cancel</span>
                <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
            </button>
        </ion-buttons>
    </ion-toolbar>
</ion-header>
<ion-segment [(ngModel)]="segmentView" class="ion-segment-outside">
    <ion-segment-button value="all">
        All clients
    </ion-segment-button>
    <ion-segment-button value="selected">
        Selected clients
    </ion-segment-button>
</ion-segment>
<div class="client-select-toolbar">
    <button clear (click)="deselectAll()">Deselect all</button>
    <button clear (click)="selectAll()">Select all</button>
</div>
<ion-content class="client-select-modal">
    <div [ngSwitch]="segmentView" class="client-select-modal-list" style="height:100%;">
        <div *ngSwitchCase="'all'" style="height:100%;">
        	<ion-list [virtualScroll]="allClients">
		        <ion-item *virtualItem="let client" (click)="updateClientStatus(client)" [ngClass]="setClasses(client)" [virtualTrackBy]="trackBy">
                    <h2><span class="client-id">{{client.id}}</span><span class="client-title">{{client.clientName | truncate : 10}}($ID{{client.currencyId}}){{client.state}}</span></h2>
                </ion-item>
            </ion-list>
        	<ion-infinite-scroll (ionInfinite)="doInfinite($event)">
        	    <ion-infinite-scroll-content></ion-infinite-scroll-content>
            </ion-infinite-scroll>
        </div>
        <div *ngSwitchCase="'selected'">
            <ion-list>
                <ion-item *ngFor="let client of selectedClients$ | async" (click)="updateClientStatus(client)" [ngClass]="setClasses(client)">
                    <h2><span class="client-id">{{client.id}}</span><span class="client-title">{{client.clientName}}</span></h2>
                </ion-item>  
            </ion-list>
        </div>
    </div>
</ion-content>
<div class="modal-button-bottom">
    <!--<button secondary (click)="reload()">Reload</button>-->
    <button secondary (click)="applySelect()">Apply</button>
</div>
`,
    pipes:[TruncatePipe],
    directives: [BmgInfiniteScroll]
})
export class ClientSelectModalComponent {
    private allClients;
    private selectedClients$;

    public segmentView:string = 'all';
    public test = true;


    @ViewChild(Content) content: Content;

    constructor(public platform:Platform,
                public params:NavParams,
                public viewCtrl:ViewController,
                private _appStore:AppStore,
                private loadingCtrl: LoadingController,
                private _clientActions:ClientsActions) {


        this.selectedClients$ = _appStore.select(selectedClientsSelector);
        _appStore.select(allClientsSelector).subscribe((data) => {
            this.allClients = data;
        });
    }

    ionViewWillEnter() {
        this._appStore.dispatch(this._clientActions.fetchClients());
    }

    setClasses(item) {
        let classes = {
            'depth-level-0': item.depth == 0,
            'depth-level-1': item.depth == 1,
            'depth-level-2': item.depth == 2,
            'state-selected': item.state == 'selected',
            'state-deselected': item.state == 'deselected',
            'state-applied': item.state == 'applied',
            'big-item': item.class === 'big-item'
        };
        return classes;
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    selectAll() {
        this._appStore.dispatch(this._clientActions.selectAllClients(this.segmentView));
    }

    deselectAll() {
        this._appStore.dispatch(this._clientActions.deselectAllClients(this.segmentView));
    }

    updateClientStatus(client) {
        console.log("update client", client);
        this._appStore.dispatch(this._clientActions.updateClientState(client.id, client.state, this.segmentView));
    }

    applySelect() {
        if(this.segmentView === 'all') {
            this._appStore.dispatch((this._clientActions.applySelectedClients()));
        } else {
            this._appStore.dispatch((this._clientActions.applyDeselectedClients()));
        }
    }

    doInfinite(infiniteScroll) {
        console.log("do infinite", infiniteScroll);
        this._appStore.dispatch(this._clientActions.fetchClients(this._appStore.getState().clients.nextOffset));
        setTimeout(() => {
            this.content.scrollToTop();
            infiniteScroll.complete();
        }, 2000);
    }
}