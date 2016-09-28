import { Component, ViewChild,ChangeDetectionStrategy } from '@angular/core';
import { Platform, NavParams, ViewController, NavController, Content, LoadingController } from 'ionic-angular';
import { TruncatePipe } from '../pipes/truncate';
import { AppStore } from 'angular2-redux';
import { allClientsSelector, selectedClientsSelector, isFetchingSelector, orderBySelector } from '../reducers/clients.reducer';
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
<ion-segment [(ngModel)]="segmentView" class="ion-segment-outside" padding>
    <ion-segment-button value="all">
        All clients
    </ion-segment-button>
    <ion-segment-button value="selected">
        Selected clients
    </ion-segment-button>
</ion-segment>

<div class="client-select-toolbar">
    <button clear (click)="orderBy('id')" class="btn-order-by-id btn-order-by" [ngClass]="setOrderByClasses('id')">Id</button>
    <button clear (click)="orderBy('name')" class="btn-order-by-name btn-order-by" [ngClass]="setOrderByClasses('name')">Name</button>
    <button clear (click)="selectAll()" class="btn-select-all">Select all</button>
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
<ion-footer class="toolbar-footer">
    <button secondary (click)="cancel()" clear class="btn--50">Cancel</button>
    <button secondary (click)="applySelect()" clear class="btn--50">Apply</button>
</ion-footer>
`,
    pipes:[TruncatePipe],
    directives: [BmgInfiniteScroll]
    // changeDetection:ChangeDetectionStrategy.OnPush

})
export class ClientSelectModalComponent {
    private allClients;
    private selectedClients$;

    public segmentView:string = 'all';
    public orderByNameDirection:string = '';
    public orderByIdDirection:string = '';


    @ViewChild(Content) content: Content;

    constructor(public platform:Platform,
                public params:NavParams,
                public viewCtrl:ViewController,
                public navCtrl: NavController,
                private _appStore:AppStore,
                private loadingCtrl: LoadingController,
                private _clientActions:ClientsActions) {


        this.selectedClients$ = _appStore.select(selectedClientsSelector);
        _appStore.select(allClientsSelector).subscribe((data) => {
            this.allClients = data;
        });

        _appStore.select(state => state.clients).subscribe((clients) => {
            console.log("state.clients", clients);
        });

        _appStore.select(orderBySelector).subscribe((orderBy) => {
            if(orderBy.field === 'id') {
                this.orderByNameDirection = 'default';
                this.orderByIdDirection = orderBy.direction;
            } else {
                this.orderByIdDirection = 'default';
                this.orderByNameDirection = orderBy.direction;
            }
        });


    }

    setOrderByClasses(field) {
        let classes;
        console.log("orderBy");

        if(field === 'id') {
            classes = {
                'order-by-default': this.orderByIdDirection === 'default',
                'order-by-asc': this.orderByIdDirection === 'asc',
                'order-by-desc': this.orderByIdDirection === 'desc'
            };
        } else {
            classes = {
                'order-by-default': this.orderByNameDirection === 'default',
                'order-by-asc': this.orderByNameDirection === 'asc',
                'order-by-desc': this.orderByNameDirection === 'desc'
            };
        }

        return classes;
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

    cancel() {
        this.navCtrl.pop();
    }

    applySelect() {
        this._appStore.dispatch((this._clientActions.applySelectedClients()));

        // if(this.segmentView === 'all') {
        //     this._appStore.dispatch((this._clientActions.applySelectedClients()));
        // } else {
        //     this._appStore.dispatch((this._clientActions.applyDeselectedClients()));
        // }
    }

    orderBy(field) {
        this._appStore.dispatch(this._clientActions.setOrderBy(field));
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