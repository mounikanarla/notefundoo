import { Component, OnInit, OnDestroy } from '@angular/core';
import { NoteService } from '../../core/services/noteServices/note.service';
import {NoteModel} from '../../core/models/note-model'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss']
})
export class ParentComponent implements OnInit,OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private noteService: NoteService ) { }
  public array = []
  list:NoteModel[]=[];
  token = localStorage.getItem('id');
  public pinarray=[];
  private loader=false;
  ngOnInit() {
    this.getCard();
    this.getpinCard();

  }
  addNewEntry(event) {
    if (event) {
      // this.array=[];
      this.getpinCard();
      this.getCard();
    }
  }
  /*
  * @description:getcard() is used to get the card data from database and it is prionting it in the array
  */
  getCard() {
    this.loader=true;
    this.noteService.getNote()
    .pipe(takeUntil(this.destroy$))

    .subscribe(data => {
      this.array = [];
      this.loader=false;
      // console.log("get cards list successfull", data);
      this.list = data['data'].data;
      // Loop is initialized to the cards list in the reverse order 
      for (let i = this.list.length - 1; i >= 0; i--) {
        // console.log(data['data'].data.length);
        if (this.list[i].isDeleted === false && this.list[i].isArchived === false && this.list[i].isPined === false ) {
          this.array.push(this.list[i]);
        }
      }
      // console.log("array", this.array);
    })
  }

  getpinCard() {
    this.noteService.getNote()
    .pipe(takeUntil(this.destroy$))

    .subscribe(data => {
      this.pinarray = [];

      // console.log("get cards list successfull", data);
      this.list = data['data'].data;
      // Loop is initialized to the cards list in the reverse order 
      for (let i = this.list.length-1; i >= 0; i--) {
        // console.log(data['data'].data.length);
        if (this.list[i].isPined === true && this.list[i].isDeleted === false && this.list[i].isArchived === false ) {
          this.pinarray.push(this.list[i]);
        }
      } 

      // console.log("array", this.array);
    })
  }
  emit(event) {
    if (event) {
      this.getpinCard();
      this.getCard();
      // this.getpinCard();
    }
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
