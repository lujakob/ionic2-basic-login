import {Component, Input, Output, ChangeDetectionStrategy, EventEmitter} from '@angular/core'

@Component({
  selector: 'film-selection',
  template: `
        <button type="button"
            *ngFor="let item of list"
            class="vehicle-selection"
            >joo
            {{item+1}}
        </button>
        {{count}}
    `,

  changeDetection:ChangeDetectionStrategy.OnPush
})
export class FilmSelectionView {

  private currentSelection = null;
  private list;

  //@Output() current:EventEmitter<any> = new EventEmitter();
  // @Input() count = 0;
  @Input() count(count) {
    this.list = (count > 0 ? Array.apply(null, Array(count)).map((x, index) => index):[]);
  }

  // private select(item) {
  //   this.currentSelection = item;
  //   this.current.emit(item);
  // }


}
