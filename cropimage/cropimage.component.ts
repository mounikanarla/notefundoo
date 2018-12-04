import { Component, OnInit,Inject,EventEmitter,Output,Input,OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { NoteService } from '../../core/services/noteServices/note.service';
import { environment } from '../../../environments/environment';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-cropimage',
  templateUrl: './cropimage.component.html',
  styleUrls: ['./cropimage.component.scss']
})
export class CropimageComponent implements OnInit,OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  URL=environment.imageUrl;

  public img;
  constructor(private noteService:NoteService,
    public dialogRef: MatDialogRef<CropimageComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) {}
  ngOnInit() {
  }
 /* First the file is assigned as null */
  public selectedFile
  public croppedImage:any;
  imageCropped(event){
    this.croppedImage=event.file
  }
   /* a method to upload the image by triggering the event */
  onImageUpload() {
    /*assigning the path & files of event to the selected file */
    this.selectedFile = this.croppedImage;
    /*it is used to transmit keyed data */
    const uploadData = new FormData();
    /* 
     * FormData.append():Appends a new value onto an existing key inside a FormData object,
     * or adds the key if it does not already exist.
     */
    uploadData.append('file', this.selectedFile, this.selectedFile.name);
    this.noteService.loadingImage(uploadData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(response => {
      console.log(response, "success in image upload");
      /* to display the image url */
      console.log("url: ", response['status'].imageUrl)
      /* setting the url */
      this.img = this.URL + response['status'].imageUrl;
       localStorage.setItem('imageUrl',response['status'].imageUrl);
        this.dialogRef.close();
      /* if error exists */
    }, error => {
      /* then display the error */
      console.log(error);
    })
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}

























