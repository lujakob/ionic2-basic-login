import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NavController, InfiniteScroll, Content } from 'ionic-angular';
import { AppStore } from 'angular2-redux';
import { contentListSelector, contentTotalSelector, contentIsFetchingSelector, contentNextOffsetSelector } from '../../reducers/content.reducer';
import { selectedClientSelector, selectedClientsListSelector } from '../../reducers/select-clients.reducer';
import { ContentActions } from "../../actions/content.actions";
import { Subscription } from "rxjs/Rx";
import { ClientSelectButton } from '../../components/client-select-button.component';

@Component({
  templateUrl: 'build/pages/statements/statements.html',
  providers: [InfiniteScroll],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class StatementsPage {

  private statements$;
  private statementsCount$;

  private selectedClientSubscriber:Subscription;
  private isFetchingStatementsSubscriber:Subscription;
  private statementsNextOffsetSubscriber:Subscription;

  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  @ViewChild(Content) content: Content;
  @ViewChild(ClientSelectButton) clientSelectButton: ClientSelectButton;

  constructor(
    private navCtrl: NavController,
    private _contentActions: ContentActions,
    private _appStore: AppStore
  ) {

    this.statements$ = _appStore.select(contentListSelector);
    this.statementsCount$ = _appStore.select(contentTotalSelector);

    this._appStore.subscribe((state) => {
      console.log(state);
    });

  }

  ionViewLoaded() {
    setTimeout(() => {
      this.clientSelectButton.openModal();
    }, 500);

  }

  /**
   * set state change subscriptions
   */
  ionViewWillEnter() {

    // reset items offset on view enter
    this.infiniteScroll.enable(true);
    this._appStore.dispatch(this._contentActions.resetNextOffset());

    // subscribe to client select change and refetch statements
    this.selectedClientSubscriber = this._appStore.select(selectedClientSelector).subscribe(clientId => {
      this.content.scrollToTop(0);
      this.infiniteScroll.enable(true);
      this._appStore.dispatch(this._contentActions.fetchContent(clientId));
    });

    // subscribe to isFetching change and hide spinner if isFetching == false
    this.isFetchingStatementsSubscriber = this._appStore.select(contentIsFetchingSelector).subscribe(isFetching => {
      if(!isFetching) {
        this.infiniteScroll.complete();
      }
    });

    // subscribe to nextOffset and disable infiniteScroll if value is -1 ( = no more items available)
    this.statementsNextOffsetSubscriber = this._appStore.select(contentNextOffsetSelector).subscribe(nextOffset => {
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
    this._appStore.dispatch(this._contentActions.fetchContent(this._appStore.getState().selectClients, this._appStore.getState().content.nextOffset));
  }

}
