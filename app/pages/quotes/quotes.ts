import { Component, Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ClientService } from '../../services/client.service';

@Component({
  templateUrl: 'build/pages/quotes/quotes.html',
  providers: [ClientService],
})
export class QuotesPage {

  private items: any[];
  constructor(
    private navCtrl: NavController,
    private clientService: ClientService
  ) {

    // this.store.subscribe(() => this.readState());
    // this.readState();
  }

  readState() {
    //this.items = [{title: 'Lukas', clientId: 1}, {title: 'Maggy', clientId: 2}, {title: 'Tom', clientId:1}];
    // console.log("read state");
    // let selectedClient = this.store.getState().clientId;
    // console.log("selectedClient", typeof selectedClient);
    //
    // this.clientService.getClientData()
    //   .subscribe(
    //     (data) => {
    //       console.log("fetch");
    //       this.items = data.filter((item) => (selectedClient > 0 ? item.clientId === selectedClient : true));
    //     },
    //     error =>  {
    //       console.log(error);
    //     }
    //   );

  }

}
