import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoteService } from '../../core/services/noteServices/note.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoggerService } from '../../core/services/loggerService/logger.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.scss']
})

export class MoreComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  show: boolean = true;
  token = localStorage.getItem('id');
  public body: any = {}
  public array = [];
  public check: boolean = true;
  public label;
  public notearray = [];
  public arraynotes: any
  public model: any

  constructor(private noteService: NoteService, public router: Router, public dialog: MatDialog, public snackBar: MatSnackBar) { }
  @Input() noteid
  // @Input() deleted
  @Output() eventEmit = new EventEmitter();

  @Output() eventEmitLabel = new EventEmitter();
  accepted: Boolean;
  // public isDeleted = false;
  ngOnInit() {
    this.checkLabel();
  }
  /*
  *  @description: Deleting the notes by invoking the function call
  */
  delData(flag) {
    console.log(this.noteid)
    let array = []
    array.push(this.noteid.id)
    this.noteService.trashPost(this.body = {
      "isDeleted": flag,
      "noteIdList": array
    })
      .pipe(takeUntil(this.destroy$))

      .subscribe((response) => {
        this.eventEmit.emit({});
        LoggerService.log("successful", response);
      },
        (error) => {
          LoggerService.log("error", error);
        }
      )
  }
  /*
   *  @description: Checking the label from nodeLabelList and pushing it in an array
   */
  checkLabel() {
    this.noteService.getLabelNote()
      .pipe(takeUntil(this.destroy$))

      .subscribe(
        response => {
          this.array = response['data'].details;
          if (this.noteid != undefined) {
            if (this.noteid.noteLabels != undefined) {
              for (let i = 0; i < this.array.length; i++) {
                for (let j = 0; j < this.noteid.noteLabels.length; j++) {
                  if (this.array[i].id == this.noteid.noteLabels[j].id) {
                    this.array[i].isChecked = true;
                  }
                }
              }
            }
          }
          // LoggerService.log("Label array printing successsss ",this.array);
        },
        error => {
          LoggerService.log("error in get LABELS", error);
        }
      )
  }
  /*
  *  @description: Adding the labels to the list by invoking the api
  */
  addChecklabel(label) {
    this.eventEmitLabel.emit(label);
    // Checking the condition for labels while clicking
    if (this.noteid != null && label.isChecked == null) {
      this.noteService.addCheckLabel(this.noteid, label)
        .pipe(takeUntil(this.destroy$))

        .subscribe((response) => {
          LoggerService.log("checklist added", response);
          this.eventEmit.emit({});
        },
          (error) => {
            LoggerService.log("error occured" + error)
          }
        )
    }
    // Checking the condition for labels while it is unclicked

    if (this.noteid != null && label.isChecked == true) {

      this.noteService.removeLabelPost(this.noteid, label)
        .pipe(takeUntil(this.destroy$))

        .subscribe((response) => {
          LoggerService.log("checklist added" + response)
          this.eventEmit.emit({});
        },
          (error) => {
            LoggerService.log("error occured" + error)
          }
        )
    }
  }
  /*
   *  @description: deleteForever() is a function to delete the notes permanently
   */
  deleteForever() {

    console.log(this.noteid)
    let array = []
    array.push(this.noteid.id)
    this.model = {
      "isDeleted": true,
      "noteIdList": array
    }
    this.noteService.deleteForeverPost(this.model)
      .pipe(takeUntil(this.destroy$))

      .subscribe(response => {
        LoggerService.log("success", response);
        this.eventEmit.emit({});

        this.snackBar.open("Deleted Note Permanently", "trash", {
          duration: 10000,
        });
      },
        (error) => {
          LoggerService.log("error occured in trash", error);
        }
      )
  }

  questions() {
    this.router.navigate(['/home/notes/' + this.noteid.id + '/questionAnswers']);
    LoggerService.log("noteid", this.noteid.id);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}