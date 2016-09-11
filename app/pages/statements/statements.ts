import { Component, ViewChild } from '@angular/core';
import { NavController, InfiniteScroll, Content } from 'ionic-angular';
import { AppStore } from 'angular2-redux';
import { statementsSelector, statementsCountSelector, isFetchingStatementsSelector, statementsNextOffsetSelector } from '../../reducers/statements-reducer';
import { selectedClientSelector } from '../../reducers/select-clients-reducer';
import {StatementsActions} from "../../actions/statements-actions";
import {Subscription} from "rxjs/Rx";

@Component({
  templateUrl: 'build/pages/statements/statements.html',
  providers: [InfiniteScroll],
})
export class StatementsPage {

  private statements$;
  private statementsCount$;

  private selectedClientSubscriber:Subscription;
  private isFetchingStatementsSubscriber:Subscription;
  private statementsNextOffsetSubscriber:Subscription;

  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  @ViewChild(Content) content: Content;

  constructor(
    private navCtrl: NavController,
    private _statementsActions: StatementsActions,
    private _appStore: AppStore
  ) {

    this.statements$ = _appStore.select(statementsSelector);
    this.statementsCount$ = _appStore.select(statementsCountSelector);
  }

  /**
   * set state change subscriptions
   */
  ionViewWillEnter() {
    // subscribe to client select change and refetch statements
    this.selectedClientSubscriber = this._appStore.select(selectedClientSelector).subscribe(clientId => {
      this._appStore.dispatch(this._statementsActions.fetchStatements(clientId));
    });

    // subscribe to isFetching change and hide spinner if isFetching == false
    this.isFetchingStatementsSubscriber = this._appStore.select(isFetchingStatementsSelector).subscribe(isFetching => {
      if(!isFetching) {
        this.infiniteScroll.complete();
      }
    });

    // subscribe to nextOffset and disable infiniteScroll if value is -1 ( = no more items available)
    this.statementsNextOffsetSubscriber = this._appStore.select(statementsNextOffsetSelector).subscribe(nextOffset => {
      if(nextOffset < 0) {
        this.infiniteScroll.enable(false);
      }
    });

  }

  /**
   * unsubscribe the state changes
   */
  ionViewDidLeave() {
    this.selectedClientSubscriber.unsubscribe();
    this.isFetchingStatementsSubscriber.unsubscribe();
    this.statementsNextOffsetSubscriber.unsubscribe();
  }

  /**
   * infinite scroll event - on scroll to close to bottom => refetch content items
   * @param infiniteScroll
   */
  doInfinite(infiniteScroll) {
    this._appStore.dispatch(this._statementsActions.fetchStatements(this._appStore.getState().selectClients, this._appStore.getState().statements.nextOffset));
  }

}
