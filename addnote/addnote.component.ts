import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UpdateComponent } from '../update/update.component';
import { DataServiceService } from '../../core/services/dataServices/data-service.service';
import { NoteService } from '../../core/services/noteServices/note.service';
import{ NoteModel } from '../../core/models/note-model'
import { Subject } from 'rxjs';
// import 'rxjs/add/operator/takeUntil';
import { takeUntil } from 'rxjs/operators';
import { AddCollaboratorsComponent } from '../add-collaborators/add-collaborators.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-addnote',
  templateUrl: './addnote.component.html',
  styleUrls: ['./addnote.component.scss']
})
export class AddnoteComponent implements OnInit,OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

 constructor(private noteService:NoteService, public router: Router,public dialog: MatDialog,private data: DataServiceService) { }
  list:NoteModel[]=[]
  public array = [];
  token = localStorage.getItem('id');
  public condition=false;
  public isChecked=false;
  public  today = new Date();
  public  tomorrow=new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 1, 8, 0, 0)
  public flag
  /*
  * @description: @INPUT AND @Output are decorators used to bind the data
  */
  @Input() noteid
  @Input() newData;
  @Input() searchInput;
  @Output() eventEmit = new EventEmitter();
  //  @Output() 
  /*
  * @description:ngOnInit is used for all the initialization/declaration and avoid stuff to work in the 
  */
  ngOnInit() {
    // if (this.newData != null && this.newData.isDeleted == true) {}
    this.data.currentMessage1
    .pipe(takeUntil(this.destroy$))

    .subscribe(message => {
      this.condition = message;
      // console.log(this.condition)
    }
    )
  }
  labelDisplay(event){
  this.data.changelabel(event)
  }
  /*
  * @description : emit(event) is used to emit the event coming from child component at the time of action
  */
  emit(event) {
    console.log(event)
    if (event) {
      this.eventEmit.emit({});
    }
  }
  /*
  * @description : Performing the dialog action when clicking on the card
  */
  openDialog(note): void {
    const dialogRef = this.dialog.open(UpdateComponent,{
          data: note
    });
    dialogRef.afterClosed()
    .pipe(takeUntil(this.destroy$))

    .subscribe(result => {
      console.log('The dialog was closed');
      this.eventEmit.emit({});

    });
  }

  opendialog(note): void {
    const dialogRef = this.dialog.open(AddCollaboratorsComponent,{
          data: note
    });
    dialogRef.afterClosed()
    .pipe(takeUntil(this.destroy$))
    .subscribe(result => {
      this.openDialog(note)
      console.log('The dialog was closed');
      this.eventEmit.emit({});
    });
  }
  /*
  * @description : labelEmit(event) is used to emit the event coming from label component at the time of action
  */
  labelEmit(event) {
    if (event) {
      this.eventEmit.emit({});
    }
  }
  /*
  * @description : labelEmit(event) is used to emit the event coming from label component at the time of action
  */
  eventEmitLabel(event) {
    if (event) {
      this.eventEmit.emit(event)
    }
  }
  /*
  * @description : eventEmitReminder(event) is used to emit the event coming from reminder component at the time of action
  */
  eventEmitReminder(event){
    if (event) {
      this.eventEmit.emit(event)
    }
  }
 /*
  * @description : removelabel(index, label) is used to remove the labels while clicking on the cancel button
  */
  removelabel(index, label) {
    console.log(index)
    console.log(label);
    this.noteService.removeLabelPost( index, label)
    .pipe(takeUntil(this.destroy$))

    .subscribe((response) => {
        // console.log("checklist added" + response)
        this.eventEmit.emit({});
      },
        (error) => {
          // console.log("error occured" + error)
        }
      )
  }
  /*
  * @description : Updating the check box by checking the status of the checkbox
  */
  public modifiedCheckList
  checkBox(checkList,index) {

    if (checkList.status == "open") {
      checkList.status = "close"
    }
    else {
      checkList.status = "open"
    }
    console.log(checkList);
    this.modifiedCheckList = checkList;
    this.updatelist(index.id);
  }
  /*
  * @description : In order to update the checkbox we are getting the data from the database by sending the api 
  */
  updatelist(id){
    let checklistData = {
      "itemName": this.modifiedCheckList.itemName,
      "status": this.modifiedCheckList.status
    }
    this.noteService.updateCheckbox(id,this.modifiedCheckList,JSON.stringify(checklistData)).subscribe(response => {
      console.log(response);

    })
  }
  qAndA(noteid){
     this.router.navigate(["home/notes/"+noteid+"/questionAnswers"]);

  }
  /*
  * @description : Invoking the function for removing of reminders by clicking on close button
  */
  removeRemainder(label) {
    let id =[];
    id.push(label)
    let body={
      "noteIdList" : id
    }
    this.noteService.removeRemainPost(body)
    .pipe(takeUntil(this.destroy$))

      .subscribe((response) => {
        console.log("Reminder deleted" + response)
        this.eventEmit.emit({});
      },
        (error) => {
          console.log("error occured" + error)
        }
      )
  }
  /*
  * @description :checking the reminders to print today and tomorrow by comparing with present date and time
  */
  checkReminder(date){
    // this.flag=false;
    let reminderPresent=new Date().getTime();
    let value=new Date(date).getTime();
    if(value > reminderPresent){
    // this.flag;
    return true;

    }
    else 
    // this.flag;
    return false;

  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
