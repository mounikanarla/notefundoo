import { Component, OnInit, Inject, ElementRef, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NoteService } from '../../core/services/noteServices/note.service';
import { NoteModel } from '../../core/models/note-model'
import { LoggerService } from '../../core/services/loggerService/logger.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-addlabel',
  templateUrl: './addlabel.component.html',
  styleUrls: ['./addlabel.component.scss']
})
export class AddlabelComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public dialogRef: MatDialogRef<AddlabelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private noteService: NoteService) { }
  @ViewChild('myLabel') myLabel: ElementRef;
  @ViewChild('myUpdate') myUpdate: ElementRef;
  @Output() eventEmit = new EventEmitter();
  list: NoteModel[] = []
  press: boolean = true;
  public editClick = false;
  public editLabel;
  public editId;
  public editDoneIcon = true;
  public editable = false;
  public token = localStorage.getItem('id')
  ngOnInit() {
    this.getLabels();
  }
  toggleChild() {
    this.press = !this.press;
  }
  onClose(): void {
    this.dialogRef.close();
    this.addLabel()
    this.getLabels();
  }
  onClick(): void {
    this.addLabel()
    this.getLabels();
    this.myLabel.nativeElement.innerHTML = null;
  }
  public label;
  public labelArray = [];
  /*
  * @description :  addLabel() add the labels values while taking it as input
  */
  addLabel() {
    try {
      this.noteService.delLabel({
        "label": this.myLabel.nativeElement.innerHTML,
        "isDeleted": false,
        "userId": localStorage.getItem('userId')
      })
        .pipe(takeUntil(this.destroy$))
        .subscribe(response => {
          LoggerService.log("success in createpostlabel", response)
        })
    } catch (err) {
       LoggerService.log("Something bad happened in add label", err);
    }
  }
  /*
  * @description :  getLabel()  function get the added labels from the database
  */
  getLabels() {
    try {
      this.noteService.getLabelNote()
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          response => {
            this.labelArray = [];
            this.list = response['data'].details
            for (let i = 0; i < this.list.length; i++) {
              if (this.list[i].isDeleted == false) {
                this.labelArray.push(this.list[i])
              }
            }
            this.eventEmit.emit({});
          },
          error => {
            LoggerService.log("error in get LABELS", error);
          }
        )
    } catch (err) {
      if (err instanceof ReferenceError
        || err instanceof TypeError
        || err instanceof SyntaxError
        || err instanceof RangeError) {
        LoggerService.log("Something bad happened in getting labels", err);
      }
    }
  }
  /*
  * @description :  delete(labelId) delete the label by clicking on the icon
  */
  delete(labelId) {
    this.noteService.deleteLabel(labelId, this.token)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.getLabels();
      }, (error) => {
      });
  }
  edit(labelId) {
    this.editClick = true;
    this.editId = labelId.id;
    this.editLabel = labelId.label;
    this.editDoneIcon = false;
    this.editable = true;

  }
  /*
  * @description :  update(labelId) update the label by clicking on the icon
  */
  update(labelId) {
    this.editClick = false;
    this.editDoneIcon = true;
    this.editable = false;
    this.noteService.updateLabelPost(labelId,
      {
        "label": this.myUpdate.nativeElement.innerHTML,
        "isDeleted": false,
        "id": labelId.id,
        "userId": localStorage.getItem("userId")
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        // this.labelArray=[];
        this.getLabels();
        console.log(response);
      }, (error) => {
        console.log(error);
      });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}


