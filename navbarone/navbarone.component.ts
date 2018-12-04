import { Component, Output, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AddlabelComponent } from '../../component/addlabel/addlabel.component';
import { DataServiceService } from '../../core/services/dataServices/data-service.service';
import { CropimageComponent } from '../../component/cropimage/cropimage.component';
import { NoteService } from '../../core/services/noteServices/note.service';
import { NoteModel } from '../../core/models/note-model'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-navbarone',
  templateUrl: './navbarone.component.html',
  styleUrls: ['./navbarone.component.scss']
})
export class NavbaroneComponent {
  destroy$: Subject<boolean> = new Subject<boolean>();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  searchInput: any
  URL=environment.imageUrl;

  public array = [];
  list:NoteModel[]=[]
  profileclick: boolean = false;
  private id = localStorage.getItem('id');
  public firstName = localStorage.getItem('firstName');
  public lastName = localStorage.getItem('lastName');
  public email = localStorage.getItem('email');
  public number = 1;
  public image = localStorage.getItem('imageUrl');
  public img = this.URL+ this.image;
  name="Fundoo Notes"
  @Output() eventEmit = new EventEmitter();


  constructor(private breakpointObserver: BreakpointObserver,private service:NoteService,public snackBar: MatSnackBar, public route: ActivatedRoute, public router: Router, public dialog: MatDialog, private data: DataServiceService) { }
  ngOnInit() {
    this.checkLabel();
    this.data.currentMessage2.subscribe(message => this.name = message)
    // this.route.firstChild.paramMap
    // .subscribe((params:ParamMap)=>{
    //   this.name=params['params'].label;;
    //   console.log(this.name)
    // })
    // if(this.router.url=='/home/notes'){
    //   this.name="Fundoo"
    // }
    // if(this.router.url=='/home/archive'){
    //   this.name="Archive"
    // }
    // if(this.router.url=='/home/trash'){
    //   this.name="Trash"
    // }
    // if(this.router.url=='/home/reminder'){
    //   this.name="Reminder"
    // }
    // if(this.router.url=='/home/search'){
    //   this.name="search"
    // }
    // else{
    //   this.name=="Fundoo"
    // }
   }
  
  titleDisplay(routeName){
    this.name=routeName;
  }
  labelDisplay(list){
    this.name=list.label;
  }
  clicksearch() {
    // console.log('in')
    this.router.navigate(['/home/search']);
  }
  profile() {
    this.profileclick = !this.profileclick;
  }
  logout() {
    // console.log(this.id)
    this.service.logoutPost(this.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((response) => {
        console.log(response);
        localStorage.removeItem('id');
        localStorage.removeItem('firstname');
        localStorage.removeItem('lastname');
        localStorage.removeItem('email');
        this.router.navigate(['login']);
        this.snackBar.open("Logout", "Success", {
          duration: 2000,
        });
      }, (error) => {
        // console.log("unsuccess");
        // console.log(error);
        this.snackBar.open("Logout", "failed", {
          duration: 2000,
        });
      }
      )
  }
  /**addlabel() method to open the add-label dialog box when it is clicked */
  addlabel() {
    /*open dialog  */
    this.dialog.open(AddlabelComponent, {
      data: {

        panelClass: 'myapp-no-padding-dialog'

      }
    });
  }
  checkLabel() {
    this.service.getLabelNote()
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      response => {
        this.array = [];
        this.list=response['data'].details
        // console.log(response['data'].details);
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].isDeleted == false) {
            this.array.push(this.list[i])
          }
        }
        // console.log(this.array, "Label array printing successsss ");
      },
      error => {
        console.log("error in get LABELS", error);
      }
    )
  }
  newMessage() {
    this.data.changeMessage(this.searchInput)
  }
  listview() {
    this.number = 0;
    this.data.changeView(true);
  }
  gridview() {
    this.number = 1;
    this.data.changeView(false);
  }

  fileSelected(event): void {
    const dialogRef = this.dialog.open(CropimageComponent, {
      data: event
    });

    dialogRef.afterClosed()
    .pipe(takeUntil(this.destroy$))
    .subscribe(result => {
      console.log('The dialog was closed');
      // this.eventEmit.emit({});
      this.image = localStorage.getItem('imageUrl');
      this.img = this.URL+ this.image;
    });
  }

  croppedImage: any = '';
  imageCropped(event: any) {
    this.croppedImage = event.base64;
  }
  ngOnDestroy(){
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}







