import { Component, OnInit, Input} from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddCollaboratorsComponent } from '../add-collaborators/add-collaborators.component';

@Component({
  selector: 'app-collaborator',
  templateUrl: './collaborator.component.html',
  styleUrls: ['./collaborator.component.scss']
})
export class CollaboratorComponent implements OnInit {
  constructor(public dialog: MatDialog) { }
 
  @Input() noteid
  public isDeleted = false;
 
  ngOnInit() {
    if (this.noteid != undefined && this.noteid.isDeleted == true) {
      this.isDeleted = true
    }
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(AddCollaboratorsComponent,{
    data: this.noteid
    });
    dialogRef.afterClosed()
      .subscribe(result => {
      console.log('The dialog was closed');
     });
  }

}
