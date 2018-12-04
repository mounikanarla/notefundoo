import { Component, OnInit,Input, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { environment } from '../../../environments/environment';
import { UserService } from '../../core/services/userServices/user.service';
import { LoggerService } from '../../core/services/loggerService/logger.service';
import { NoteService } from '../../core/services/noteServices/note.service';

@Component({
  selector: 'app-add-collaborators',
  templateUrl: './add-collaborators.component.html',
  styleUrls: ['./add-collaborators.component.scss']
})
export class AddCollaboratorsComponent implements OnInit {
  searchword: any;
  constructor(private userService: UserService ,private noteService:NoteService,public  dialogRef: MatDialogRef<AddCollaboratorsComponent>,
  @Inject(MAT_DIALOG_DATA) public data:any){ }
  @Input() noteid
  ngOnInit() {
    for(let i=0;i<this.data['collaborators'].length;i++){
      this.searcharray.push(this.data['collaborators'][i])
    }
    // console.log(this.data.user)
  }
  private usersData
  private owner=this.data['user']
  private ownerimage=environment.imageUrl+this.owner.imageUrl
  private image=localStorage.getItem('imageUrl');
  img=environment.imageUrl+this.image;
  email=localStorage.getItem('email');
  firstName=localStorage.getItem('firstName');
  lastName=localStorage.getItem('lastName');
  userId=localStorage.getItem('userId')
  /*
  * @description : Getting the userdata by searching using searchpeople function
  */
  searchpeople(searchword){
    if(searchword!=null && searchword != undefined && searchword!=""){
    var body={
      "searchWord":searchword
    }
    this.userService.searchpeople(body).subscribe(data=>{
      LoggerService.log("success in collaborator search",data)
      this.usersData=data['data'].details;
    },
    error=>{
      LoggerService.log("error in collaborator search",error);
    })
  }
  }
  /*
  * @description : addCollab(search) adds the persons emails by passing the data in body
  */
  collabArray=[]
  addCollab(search){
    var body={
      "firstName":search.firstName,
      "lastName":search.lastName,
      "email":search.email,
      "userId":search.userId
    }
    this.noteService.addCollaborators(this.data,body).subscribe(data=>{
      LoggerService.log("success in addcollaborator",data)
      this.collabArray=data['data'].details;
      this.data['collaborators'].push(search);

    },
    error=>{
      LoggerService.log("success in addcollaborator",error)
     })
  }
  private searcharray=[]
  onEnterClick(searchword){
    for(let index=0;index<this.usersData.length;index++){
      if(this.usersData[index].email==searchword)
      {
        this.searcharray.push(this.usersData[index])
      }

    }
    this.searchword='';

  }
  // word=this.search

  select(searchword){  
  this.searchword=searchword;
  }
  /*
  * @description : removeCollab(id) removes the persons emails by passing userid of the particular mail
  */
  removecollab(id){
    this.noteService.removeCollaborators(this.data,id).subscribe(data=>{
     LoggerService.log("success in removecollaborator",data);
    for(let i=0;i<this.searcharray.length;i++)
    {
      if(this.searcharray[i].userId==id){
        this.searcharray.splice(i,1)
        this.data['collaborators'].splice(i,1);

      }

    }
    },
    error=>{
      LoggerService.log("success in addcollaborator",error)
     })
  }
  cancel(){
    this.dialogRef.close();
  }
  addCollabdone(){
    if(this.searchword!="null")
    {
    this.searcharray.push(this.searchword)
    this.dialogRef.close();
    }
    else{
      this.searcharray.splice(this.searchword)
    }
  }
}
