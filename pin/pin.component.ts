import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoteService } from '../../core/services/noteServices/note.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss']
})
export class PinComponent implements OnInit,OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private noteService:NoteService , public snackBar: MatSnackBar) { }
  @Input() noteid;
  @Input() Pin;
  // @Input() note
  @Output() eventEmit = new EventEmitter();
  /*
 * @description: Getting the data from the local storage
 */
  public isPined = false;
  public isDeleted = false;
  token = localStorage.getItem('id');
  public body: any = {}
  ngOnInit() {
    // this.archive(this.flag)
    if (this.noteid != undefined && this.noteid.isDeleted == true) {
      this.isDeleted = true
    }
    if (this.noteid != undefined && this.noteid.isPined == true) {
      this.isPined = true
    }
  }
  pin(flag) {
    this.eventEmit.emit(event);
    if (this.noteid != undefined) {
      // this.isPined=true


      console.log(this.noteid)
      let  array = []
      array.push(this.noteid.id)
      //posting the data into pin notes by using the post service
      this.noteService.pinPost( this.body = {
        "isPined": flag,
        "noteIdList": array

      })
      .pipe(takeUntil(this.destroy$))

      .subscribe((response) => {
        // If the response is true the event will be emitted
        // console.log("successful", response);
        this.eventEmit.emit({});
        if (flag == true) {
          this.snackBar.open("Pinned", "ok", {
            duration: 2000,
          });
        }
        else {
          this.snackBar.open("UnPinned", "ok", {
            duration: 2000,
          });
        }
      },
        (error) => {
          // console.log("error", error);

        })
    }
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
