import { Component, OnInit,Input, ViewChild, ElementRef } from '@angular/core';
import { QuesAnsService } from '../../core/services/quesAndAnsServices/ques-ans.service';
import { LoggerService } from '../../core/services/loggerService/logger.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.scss']
})
export class AddQuestionsComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  value: any;
  avgRate: number;
  liked: number;

  constructor(private route: ActivatedRoute, private quesNotesService:QuesAnsService, public router: Router) { }
  private noteId;
  private noteTitle;
  private noteDescription;
  private noteDetails;
  private checkListData = [];
  private message;
  private parentId;
  private userName;
  private userDetails;
  private img;
  private img1;
  private replyId;
  private questionAnswerArray;
  private show = true;
  private hide=true;
  private new =true;
  showHide=false;
  lyke=0;
  // public replyMessage;
  clickable=true;
  @ViewChild('replyMessage') replyMessage: ElementRef;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.noteId = params['noteid'];
      LoggerService.log('noteDetails', this.noteId);
    });
    this.findNoteInQuestion();
  }
  changeShowStatus(){
    this.showHide = !this.showHide;
  }
  /*
  * @description:Getting the note detail of the user
  */
  findNoteInQuestion() {
    this.quesNotesService.singleNote(this.noteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        LoggerService.log('getNoteDetail', data);
        this.userDetails = data['data']['data'][0].user;
        this.img = environment.imageUrl ;
        this.noteDetails = data['data'].data[0];
        this.noteTitle = this.noteDetails.title;
        this.noteDescription = this.noteDetails.description;
        this.img1=environment.imageUrl +this.noteDetails.questionAndAnswerNotes[0].user.imageUrl;
        console.log(this.img1)
       
      for (let i = 0; i < data['data']['data'][0].noteCheckLists.length; i++) {
          if (data['data']['data'][0].noteCheckLists[i].isDeleted == false) {
            this.checkListData.push(data['data']['data'][0].noteCheckLists[i])
          }
        }
      if (this.noteDetails.questionAndAnswerNotes[0] != undefined) {
          this.message = this.noteDetails.questionAndAnswerNotes[0].message;
          this.questionAnswerArray = this.noteDetails.questionAndAnswerNotes;
        }
        if (this.noteDetails.questionAndAnswerNotes != undefined) {
          this.questionAnswerArray = this.noteDetails.questionAndAnswerNotes;
           LoggerService.log('questionArray', this.questionAnswerArray)
          }
    })
  }
  /*
  * @description:Getting the note detail of the user
  */
  questionAsked(question) {
    let content = {
      'message': question,
      'notesId': this.noteId
    }
    this.quesNotesService.questionNote(content).subscribe(data => {
      LoggerService.log('success in adding', data);
      this.message = data['data']['details'].message;
      this.findNoteInQuestion()
    })
  }

  /*
  * @description:like() is used to like the user data while clicking on the icon
  */
  like(value) {
    let content = {
      'like': true
    }
    this.quesNotesService.like(value,content)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.lyke=1;
        this.findNoteInQuestion()
        LoggerService.log('success in like', data);
      });
  }
  
  /*
  * @description:reply() is used to like the rate the data while clicking on the icon
  */
  ratingAnswer(value, event) {
    let content = {
      'rate': event
    }
    this.quesNotesService.rate(value.id, content)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        LoggerService.log('success in rating', data);
        this.findNoteInQuestion()

    })
  }

 
  replyAnswer(value) {
    this.show = !this.show;
    this.replyId=value;
  }
 /*
  * @description:leavereply() is used to reply to the user while clicking on the icon
  */
  leaveReply() {
    let content = {
      'message': ''
    }
    LoggerService.log(content.message);
    LoggerService.log(this.replyId);
    content.message=this.replyMessage.nativeElement.innerHTML;
    this.quesNotesService.reply(this.replyId,content)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.findNoteInQuestion()
        LoggerService.log('success in replying', data);
    })
  }
  /*
  * @description:averagestar() is average the user ratings
  */
  averagestar(rateArray) {
    this.value = 0;
    if (rateArray.length != 0) {
    for (let i = 0; i < rateArray.length; i++) {
    this.value += rateArray[i].rate
    }
    this.avgRate = this.value / rateArray.length;
    return this.avgRate;
    }
    }
  /*
  * @description:viewreply() determines the total replies of the card
  */
private replies
  viewreply(question){
    this.replies=0;
    for(let j=0;j<this.questionAnswerArray.length;j++){
      if(question.id==this.questionAnswerArray[0].id)
      {
        this.replies++;
      }
    }
  return this.replies;
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
