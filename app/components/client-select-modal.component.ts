import { Component, ViewChild } from '@angular/core';
import { Platform, NavParams, ViewController, Content, LoadingController } from 'ionic-angular';
import { TruncatePipe } from '../pipes/truncate';
import { AppStore } from 'angular2-redux';
import { selectedClientsListSelector, appliedClientsListSelector, isFetchingSelector } from '../reducers/select-clients.reducer';
import { SelectClientsActions }from '../actions/select-clients.actions';
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
    <ion-segment-button value="applied">
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
        	<ion-list [virtualScroll]="allClients$" [headerFn]="myHeaderFn">
		        <ion-item *virtualItem="let client" (click)="updateClientStatus(client)" [ngClass]="setClasses(client)" [virtualTrackBy]="trackBy">
                    <h2><span class="client-id">{{client.id}}</span><span class="client-title">{{client.clientName | truncate : 10}}($ID{{client.currencyId}}){{client.state}}</span></h2>
                </ion-item>
                <ion-item-divider *virtualHeader="let header">
                    Header: {{ header }}
                </ion-item-divider>
            </ion-list>
        	<bmg-infinite-scroll (ionInfinite)="doInfinite($event)">
        	    <bmg-infinite-scroll-content></bmg-infinite-scroll-content>
            </bmg-infinite-scroll>
        </div>
        <div *ngSwitchCase="'applied'">
            <ion-list>
                <ion-item *ngFor="let client of appliedClients$ | async" (click)="updateClientStatus(client)" [ngClass]="setClasses(client)">
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
    private allClients$;
    private appliedClients$;

    private loading;


    public segmentView:string = 'all';
    public test = true;


    @ViewChild(Content) content: Content;

    constructor(public platform:Platform,
                public params:NavParams,
                public viewCtrl:ViewController,
                private _appStore:AppStore,
                private loadingCtrl: LoadingController,
                private _clientActions:SelectClientsActions) {
        // this.allClients$ = _appStore.select(selectedClientsListSelector);
        this.appliedClients$ = _appStore.select(appliedClientsListSelector);
        _appStore.select(selectedClientsListSelector).subscribe((data) => {
            console.log("all", data);
            this.allClients$ = data;
        });

        _appStore.select(isFetchingSelector).subscribe((isFetching) => {
            console.log("isFetching", isFetching);
            // if(isFetching === false && !!this.content) {
            //     console.log("scroll to middle");
            //     this.content.scrollTo(0, 2000, 0);
            // }
        });


        // _appStore.select(appliedClientsListSelector).subscribe((data) => console.log("applied", data));
        // _appStore.select(state => state).subscribe((state) => console.log("state changed applied", state));
    }

    ionViewWillEnter() {
        this._appStore.dispatch(this._clientActions.fetchClients());
        // console.log("get state on viewWillEnter", this._appStore.getState());
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

    myHeaderFn(record, recordIndex, records) {
        if (recordIndex % 20 === 0) {
            return 'Header ' + recordIndex;
        }
        return null;
    }


    doInfinite(infiniteScroll) {
        console.log("do infinite", infiniteScroll);

        if(infiniteScroll.arrivedAt === 'bottom') {
            console.log(this._appStore.getState().selectClients.nextOffset);
            this._appStore.dispatch(this._clientActions.fetchClients(this._appStore.getState().selectClients.nextOffset));
            setTimeout(() => {
                //infiniteScroll.complete();
                infiniteScroll.disableBottom();
            }, 1000);
        }
        if(infiniteScroll.arrivedAt === 'top') {
            setTimeout(() => {
                infiniteScroll.complete();
                infiniteScroll.disableTop();
            }, 1000);
        }


    }
}