import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NoteService } from '../../core/services/noteServices/note.service';
import { NoteModel } from '../../core/models/note-model'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-main-archive',
  templateUrl: './main-archive.component.html',
  styleUrls: ['./main-archive.component.scss']
})
export class MainArchiveComponent implements OnInit,OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private noteService:NoteService) { }
  list:NoteModel[]=[]
  public archiveArray = []
  token = localStorage.getItem('id');
  @Output() eventEmit = new EventEmitter();
  ngOnInit() {
    this.getarchive()
  }
  /*
  * @description: getarchive() is used to get the archived datalist and is printing into the array
  */
  getarchive() {
    this.noteService.getArchive()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.archiveArray = [];

      console.log("get cards list successfull", data);
      this.list = data['data'].data;
      // Initializing the for loop to store and print the cards in reverseorder      
      for (let i = this.list.length - 1; i >= 0; i--) {
        console.log(this.list.length);
        // Checking the condition that card is archived or not and it is pushing into array
        if (this.list[i].isDeleted == false) {
          this.archiveArray.push(this.list[i]);
        }
      }
      console.log("archive array", this.archiveArray);
    })
  }
  emit(event) {
    console.log(event)
    if (event) {
      this.getarchive()
    }
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
