import { Component, Input, Output, OnInit, EventEmitter,OnDestroy  } from '@angular/core';
import { NoteService } from '../../core/services/noteServices/note.service';
import { Subject } from 'rxjs';
// import 'rxjs/add/operator/takeUntil';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-changecolor',
  templateUrl: './changecolor.component.html',
  styleUrls: ['./changecolor.component.scss']
})
export class ChangecolorComponent implements OnInit,OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private noteService:NoteService) { }
  token = localStorage.getItem('id');
  /*
    * @description: @INPUT AND @Output are decorators used to bind the data
    * @Input function is get the card Id
    * @Output function is emiting the event from the archive
    */
  //  public bgcolor="#FFFFFF"

  @Input() noteid;
  public body: any = {}

  @Output() eventEmit = new EventEmitter();
  public isDeleted = false;
   array = []

  ngOnInit() {
    if (this.noteid != undefined && this.noteid.isDeleted == true) {
      this.isDeleted = true
    }
  }
  /*
  * @description: changeColor() is used to get the colour when the button of the colour is clicked
  */
  changeColor(color) {
    // color=this.bgcolor;
    this.eventEmit.emit(color);
    // console.log(this.colorid)
    if(this.noteid != undefined){
    this.array.push(this.noteid.id)
    console.log(this.array)

    // posting the clicked colour and id of cards into array
    this.noteService.colorPost( this.body = {
      "color": color,
      "noteIdList":this.array
    })
    .pipe(takeUntil(this.destroy$))

    .subscribe((response) => {
      // console.log(  this.onEmit.emit() )
      // console.log("successful", response);
      this.eventEmit.emit({});
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
