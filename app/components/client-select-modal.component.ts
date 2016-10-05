import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Platform, NavParams, ViewController, NavController, Content, LoadingController, VirtualScroll } from 'ionic-angular';
import { TruncatePipe } from '../pipes/truncate';
import { AppStore } from 'angular2-redux';
import { allClientsSelector, selectedClientsSelector, isFetchingSelector, orderBySelector } from '../reducers/clients.reducer';
import { ClientsActions }from '../actions/clients.actions';
import { BmgInfiniteScroll } from './bmg-infinite-scroll.component';
import * as _ from 'lodash';
import 'rxjs/add/operator/skip';
import { CLIENTS_PER_PAGE } from "../config/config";

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
        	<bmg-infinite-scroll (ionInfinite)="doInfinite($event)">
        	    <bmg-infinite-scroll-content></bmg-infinite-scroll-content>
            </bmg-infinite-scroll>
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
    private loading;

    private isFetchingSubscriber;

    public segmentView:string = 'all';
    public orderByPathDirection:string = '';
    public orderByIdDirection:string = '';
    public showSearchForm = false;

    @ViewChild(Content) content: Content;
    @ViewChild('searchBar') searchBar;
    @ViewChild(VirtualScroll) virtualScroll: VirtualScroll;
    @ViewChild(BmgInfiniteScroll) infiniteScroll: BmgInfiniteScroll;

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


        // _appStore.select(state => state).subscribe((state) => {
        //     console.log("state", state);
        //     // console.log("prevOffset", clients.prevOffset);
        // });


        // order items
        /**
         * @todo what about ordering selected tab ?! ->
         */
        _appStore.select(orderBySelector).subscribe((orderBy) => {
            if(orderBy.field === 'id') {
                this.orderByPathDirection = 'default';
                this.orderByIdDirection = orderBy.direction;
            } else {
                this.orderByIdDirection = 'default';
                this.orderByPathDirection = orderBy.direction;
            }

            // let clientsState = this._appStore.getState().clients;
            // let selectedIds = this.segmentView === 'selected' ? _.union(this._appStore.getState().clients.selected, this._appStore.getState().clients.applied) : [];
        });


    }


    ionViewDidEnter() {
        // isFetching
        this.isFetchingSubscriber = this._appStore.select(isFetchingSelector).skip(2).subscribe((isFetching) => {

            if(this.content && isFetching) {

                this.loading = this.loadingCtrl.create({
                    content: 'Please wait...'
                });

                this.loading.present();

                this.loading.onDidDismiss(() => {
                    this.virtualScroll.update(false);


                    this.infiniteScroll.complete();
                    let nextOffset = this._appStore.getState().clients.nextOffset;
                    let prevOffset = this._appStore.getState().clients.prevOffset;
                    var scrollHeight = this.content.getElementRef().nativeElement.children[0].scrollHeight/2;

                    if(nextOffset >= 0 && nextOffset <= CLIENTS_PER_PAGE) {
                        this.content.scrollToTop();
                    } else {
                        // this only works
                        this.content.scrollTo(0, scrollHeight, 200);
                    }
                    if (prevOffset < 0) {
                        this.infiniteScroll.enableTop(false);
                    } else {
                        this.infiniteScroll.enableTop(true);
                    }
                    if (nextOffset < 0) {
                        this.infiniteScroll.enableBottom(false);
                    } else {
                        this.infiniteScroll.enableBottom(true);
                    }
                });

            } else if (this.content && this.loading && !isFetching) {
                this.loading && this.loading.dismiss();
            }
        });

        // console.log(this.content.getScrollElement());
        // console.log("content", this.content.getElementRef());
        // console.log("content", this.content.getElementRef().nativeElement.children[0].scrollHeight);
    }

    ionViewDidLeave() {

        this._appStore.dispatch(this._clientActions.reset());
        this.isFetchingSubscriber.unsubscribe();
    }

    /**
     * toggle search form and adapt scroll-content margin-top accordingly
     */
    toggleSearchForm() {
        this.showSearchForm = !this.showSearchForm;
        this.content.resize();

        // maybe I need this code if I want to animate
        // let scrollContent = this.content.getElementRef().nativeElement.children[0];
        // let searchBar = this.searchBar._elementRef.nativeElement;
        //
        // searchBar.style.display = 'block';
        // let searchBarHeight = searchBar.clientHeight;
        // searchBar.style.display = '';
        // scrollContent.style.marginTop = parseInt(scrollContent.style.marginTop, 10) + ((this.showSearchForm ? 1 : -1) * searchBarHeight) + 'px';
    }


    doSearch(ev) {
        console.log("ev", ev);
    }

    changeSegment() {
        this._appStore.dispatch(this._clientActions.resetOffset());
        this._appStore.dispatch(this._clientActions.setOrderBy('', true));

        let selectedIds = this.segmentView === 'selected' ? _.union(this._appStore.getState().clients.selected, this._appStore.getState().clients.applied) : [];
        this._appStore.dispatch(this._clientActions.fetchClients('next', selectedIds));
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
    }

    orderBy(field) {
        this._appStore.dispatch(this._clientActions.orderClients(field, this.segmentView));

    }

    doInfinite(infiniteScroll) {
        console.log("do infinite", infiniteScroll);
        let direction = (infiniteScroll.arrivedAt === 'bottom') ? 'next' : 'prev';
        this._appStore.dispatch(this._clientActions.fetchClients(direction));
    }
}