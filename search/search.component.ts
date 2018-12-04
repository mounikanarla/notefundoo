import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataServiceService } from '../../core/services/dataServices/data-service.service';
import { NoteService } from '../../core/services/noteServices/note.service';
import {NoteModel} from '../../core/models/note-model'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit,OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  message: string
  constructor(private data: DataServiceService,private noteService: NoteService ) { }
  list:NoteModel[]=[]

  public array = [];

  ngOnInit() {
    this.getCard()
    this.data.currentMessage.subscribe(message => {
      this.message = message;
      console.log(this.message)
    }
    )
    // this.data.changeView.subscribe(message=>{

    // })

  }
  getCard() {
    this.noteService.getNote()
    .pipe(takeUntil(this.destroy$))

    .subscribe(data => {
      this.array = [];
      this.list = data['data'].data;
      // Loop is initialized to the cards list in the reverse order 
      for (let i = this.list.length-1; i >= 0; i--) {
        if (this.list[i].isDeleted == false && this.list[i].isArchived == false) {
          this.array.push(this.list[i]);
        }
      }
    })
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
