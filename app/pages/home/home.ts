import { Component, ChangeDetectionStrategy } from '@angular/core';

import { AppStore } from "angular2-redux";
import { CounterActions } from "../../actions/counter.actions";
import { counterSelector } from "../../reducers/counter.reducer";
import { selectedClientSelector } from "../../reducers/select-clients.reducer";

@Component({
    //changeDetection:ChangeDetectionStrategy.OnPush,
    templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
    public clientId: number = 0;
    private counter;
    private increment;
    private decrement;

    constructor(private _appStore:AppStore,
              private _counterActions:CounterActions) {

        this.increment = _counterActions.createDispatcher(_counterActions.increment);
        this.decrement = _counterActions.createDispatcher(_counterActions.decrement);

        _appStore.select(counterSelector).subscribe(counter => {
            console.log("counterSelector", counter);
            this.counter = counter;
        });

        _appStore.select(selectedClientSelector).subscribe(selectedClient => {
            console.log("selectedClientSelector", selectedClient);
            this.clientId = selectedClient;
        });
    //
    //   _appStore.subscribe((state) => {
    //       console.log("state", state);
    //   })
    }

}
