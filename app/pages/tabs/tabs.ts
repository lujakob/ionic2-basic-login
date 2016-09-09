import {Component} from '@angular/core'
import {HomePage} from '../home/home';
import {StatementsPage} from '../statements/statements';
import {ProfilePage} from '../profile/profile';
import {ChartPage} from '../chart/chart';
import {FilmsPage} from '../films/films';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  private homePage: any;
  private statementsPage: any;
  private profilePage: any;
  private chartPage: any;
  private filmsPage: any;

  constructor() {
    // // this tells the tabs component which Pages
    // // should be each tab's root Page
    this.homePage = HomePage;
    this.statementsPage = StatementsPage;
    this.profilePage = ProfilePage;
    this.chartPage = ChartPage;
    this.filmsPage = FilmsPage;
  }
}
