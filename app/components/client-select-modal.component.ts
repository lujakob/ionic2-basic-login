import { Component, ViewChild,ChangeDetectionStrategy } from '@angular/core';
import { Platform, NavParams, ViewController, NavController, Content, LoadingController } from 'ionic-angular';
import { TruncatePipe } from '../pipes/truncate';
import { AppStore } from 'angular2-redux';
import { allClientsSelector, selectedClientsSelector, isFetchingSelector, orderBySelector } from '../reducers/clients.reducer';
import { ClientsActions }from '../actions/clients.actions';
import { BmgInfiniteScroll } from './bmg-infinite-scroll.component';
import * as _ from 'lodash';

@Component({
    template: `
<ion-header>
    <ion-toolbar>
        <ion-title>Select clients</ion-title>
        <ion-buttons start>
            <button (click)="toggleSearchForm()">
                <ion-icon name="md-search"></ion-icon>
            </button>
        </ion-buttons>
    </ion-toolbar>
    <ion-segment [(ngModel)]="segmentView" (ionChange)="changeSegment()" class="ion-segment-outside" padding>
    <ion-segment-button value="all">
        All clients
    </ion-segment-button>
    <ion-segment-button value="selected">
        Selected clients
    </ion-segment-button>
</ion-segment>

<div class="client-select-toolbar">
    <ion-searchbar #searchBar class="ion-searchbar" (ionInput)="doSearch($event)" [class.show-form]="showSearchForm"></ion-searchbar>
    <button clear (click)="orderBy('id')" class="btn-order-by-id btn-order-by" [ngClass]="setOrderByClasses('id')">Id</button>
    <button clear (click)="orderBy('path')" class="btn-order-by-path btn-order-by" [ngClass]="setOrderByClasses('path')">Name</button>
    <button clear (click)="selectAll()" class="btn-select-all">Select all</button>
</div>
</ion-header>

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
                <ion-item *ngFor="let client of selectedClients" (click)="updateClientStatus(client)" [ngClass]="setClasses(client)">
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
    private selectedClients;

    public segmentView:string = 'all';
    public orderByPathDirection:string = '';
    public orderByIdDirection:string = '';
    public showSearchForm = false;


    @ViewChild(Content) content: Content;
    @ViewChild('searchBar') searchBar;

    constructor(public platform:Platform,
                public params:NavParams,
                public viewCtrl:ViewController,
                public navCtrl: NavController,
                private _appStore:AppStore,
                private loadingCtrl: LoadingController,
                private _clientActions:ClientsActions) {


        // this.selectedClients$ = _appStore.select(selectedClientsSelector);

        _appStore.select(allClientsSelector).subscribe((data) => {
            this.allClients = data;
        });

        _appStore.select(selectedClientsSelector).subscribe((data) => {
            this.selectedClients = data;
        });

        _appStore.select(state => state.clients).subscribe((clients) => {
            // console.log("state.clients", clients);
        });

        _appStore.select(isFetchingSelector).subscribe((isFetching) => {
            !isFetching && this.content && this.content.scrollToTop();
        });

        _appStore.select(orderBySelector).subscribe((orderBy) => {
            if(orderBy.field === 'id') {
                this.orderByPathDirection = 'default';
                this.orderByIdDirection = orderBy.direction;
            } else {
                this.orderByIdDirection = 'default';
                this.orderByPathDirection = orderBy.direction;
            }

            let clientsState = this._appStore.getState().clients;
            let selectedIds = this.segmentView === 'selected' ? _.union(this._appStore.getState().clients.selected, this._appStore.getState().clients.applied) : [];
            this._appStore.dispatch(this._clientActions.fetchClients(0, clientsState.orderBy, selectedIds));

        });


    }

    toggleSearchForm() {
        this.showSearchForm = !this.showSearchForm;

        let searchBar = this.searchBar._elementRef.nativeElement;
        console.log("searchBar", searchBar);
        searchBar.style.display = 'block';
        let searchBarHeight = searchBar.clientHeight;
        searchBar.style.display = '';
        let scrollContent = this.content.getElementRef().nativeElement.children[0];

        console.log(scrollContent);
        console.log(scrollContent.style);
        console.log(searchBarHeight);
        console.log(parseInt(scrollContent.style.marginTop, 10) + searchBarHeight + 'px');
        scrollContent.style.marginTop = parseInt(scrollContent.style.marginTop, 10) + ((this.showSearchForm ? 1 : -1) * searchBarHeight) + 'px';



        // if(this.showSearchForm === false) {
        //     let marginTop = parseInt(scrollContent.style.marginTop, 10);
        //     console.log("marginTop", marginTop);
        //     scrollContent.style.marginTop = marginTop + 70 + 'px';
        //     this.showSearchForm = true;
        //     console.log(this.searchBar);
        // }
    }

    ionViewDidEnter() {
        console.log("content", this.content.getElementRef().nativeElement.children[0].style.marginTop);
    }

    doSearch(ev) {
        console.log("ev", ev);
    }

    changeSegment() {
        if(this.segmentView === 'selected') {
            let clientsState = this._appStore.getState().clients;
            let selectedIds = _.union(this._appStore.getState().clients.selected, this._appStore.getState().clients.applied);
            this._appStore.dispatch(this._clientActions.fetchClients(0, clientsState.orderBy, selectedIds));
        }
    }

    /**
     * @todo this function gets called too often. maybe a refactor can solve it
     * @param field
     * @returns {any}
     */
    setOrderByClasses(field) {
        let classes;

        if(field === 'id') {
            classes = {
                'order-direction-default': this.orderByIdDirection === 'default',
                'order-direction-asc': this.orderByIdDirection === 'asc',
                'order-direction-desc': this.orderByIdDirection === 'desc'
            };
        } else {
            classes = {
                'order-direction-default': this.orderByPathDirection === 'default',
                'order-direction-asc': this.orderByPathDirection === 'asc',
                'order-direction-desc': this.orderByPathDirection === 'desc'
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