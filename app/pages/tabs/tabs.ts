import {Component} from '@angular/core'
import {ProfilePage} from '../profile/profile';
import {QuotesPage} from '../quotes/quotes';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  private profilePage: any;
  private quotesPage: any;

  constructor() {
    // // this tells the tabs component which Pages
    // // should be each tab's root Page
    this.profilePage = ProfilePage;
    this.quotesPage = QuotesPage;

  }
}
