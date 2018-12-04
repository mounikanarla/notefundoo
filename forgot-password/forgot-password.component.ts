import { Component, OnInit,OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../core/services/userServices/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit ,OnDestroy{
  destroy$: Subject<boolean> = new Subject<boolean>();

  model: any = {
    "email": ""
  }
  constructor(public userService:UserService, public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  forgotPass() {
    if (this.model.email.length == 0) {
      this.snackBar.open("failed", "Enter Email", {
        duration: 2000,
      });
      return;
    }
    this.userService.resetPost({
      "email": this.model.email
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe((response => {
      this.snackBar.open("password is send to your email", "Ok", {
        duration: 2000,
      })
    }),
      (error => {
        this.snackBar.open("Error occured", "Try again", {
          duration: 2000,
        });
      })
    )
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
