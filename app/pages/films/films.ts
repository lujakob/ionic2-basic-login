import { NavController } from 'ionic-angular';
import {Component} from '@angular/core'
import {AppStore} from "angular2-redux";
import {FilmActions} from "../../actions/film-actions";
import {FilmSelectionView} from "./film-selection-view";
import {FilmView} from "./film-view";
import {currentFilmSelector,filmsCountSelector,isFetchingFilmSelector} from "../../reducers/films-reducer";

// @Component({
//   templateUrl: 'build/pages/films/films.html',
// })

@Component({
  //selector: 'films-component',
  templateUrl: 'build/pages/films/films.html',
  directives: [FilmSelectionView, FilmView]
})
export class FilmsPage {

  private filmsCount$;
  private currentFilm$ = null;
  private isFetchingCurrentFilm = false;

  private unsubscribeFromStore:()=>void;

  constructor(private _appStore:AppStore,
              private _filmActions:FilmActions,
              private navCtrl: NavController
  ) {

    // this.filmsCount$ = 3;
    this.filmsCount$ = _appStore.select(filmsCountSelector);
    //this.currentFilm$ = _appStore.select(currentFilmSelector);

    // _appStore.select(isFetchingFilmSelector).subscribe(isFetchingFilm => {
    //   this.isFetchingCurrentFilm = isFetchingFilm;
    // });

    // _appStore.dispatch(_filmActions.fetchFilms());
  }

  // setCurrentFilm(index) {
  //   this._appStore.dispatch(this._filmActions.setCurrentFilm(index));
  //   this._appStore.dispatch(this._filmActions.fetchFilm(index ));
  // }

}
