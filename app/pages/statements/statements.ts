import { Component, Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppStore } from 'angular2-redux';
import { statementsSelector, statementsCountSelector } from '../../reducers/statements-reducer';
import { selectedClientSelector } from '../../reducers/select-clients-reducer';
import {StatementsActions} from "../../actions/statements-actions";
import {Subscription} from "rxjs/Rx";

@Component({
  templateUrl: 'build/pages/statements/statements.html',
  providers: [],
})
export class StatementsPage {

  private statements$;
  private statementsCount$;

  private selectedClientSubscriber:Subscription;

  constructor(
    private navCtrl: NavController,
    private _statementsActions: StatementsActions,
    private _appStore: AppStore
  ) {

    this.statements$ = _appStore.select(statementsSelector);
    this.statementsCount$ = _appStore.select(statementsCountSelector);

  }

  ionViewWillEnter() {
    this.selectedClientSubscriber = this._appStore.select(selectedClientSelector).subscribe(clientId => {
      this._appStore.dispatch(this._statementsActions.fetchStatements(clientId));
    });
    console.log("on enter");
  }

  ionViewDidLeave() {
    this.selectedClientSubscriber.unsubscribe();
    console.log("view did leave");
  }
}
