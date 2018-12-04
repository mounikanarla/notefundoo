import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NoteService } from '../../core/services/noteServices/note.service';
import{ NoteModel } from '../../core/models/note-model'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-labelclick',
  templateUrl: './labelclick.component.html',
  styleUrls: ['./labelclick.component.scss']
})
export class LabelclickComponent implements OnInit,OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  // @Output() eventEmitLabel = new EventEmitter();  

  constructor(private noteService:NoteService, private route: ActivatedRoute) { }
  public array = [];
  public label;
  token = localStorage.getItem('id');
  public id;
  list:NoteModel[]=[]
  ngOnInit() {
    /*
     * @description: component must read the parameter, then load the label based on the ID given in the parameter.
     */
    this.route.params
    .pipe(takeUntil(this.destroy$))

    .subscribe(
      (params: Params) => {
        this.label = params['params'];
        this.getCard(this.label)
        // console.log("ppp", params);
      })
  }
  /*
    * @description: Getting the cards to print the labels on the sidebar component
   */
  getCard(label) {
    this.noteService.getLabel(label,this.token)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.array = [];
      this.list=data['data'].data
      for (let i = this.list.length - 1; i >= 0; i--) {
        this.array.push(this.list[i]);
      }
      // console.log("array", this.array);
    })
  }
  emit(event) {
    this.getCard(this.label)
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
