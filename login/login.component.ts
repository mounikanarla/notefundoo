import { Component, OnInit, OnDestroy  } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/userServices/user.service';
import { Subject } from 'rxjs';
// import 'rxjs/add/operator/takeUntil';
import { takeUntil } from 'rxjs/operators';

// import { MessagingService } from './messaging.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();

  hide = "true";
  model: any = {
    email: '',
    password: ''
  }
 body:any={}
  constructor(private userService:UserService,public snackBar: MatSnackBar, public router: Router) { }
  email = new FormControl('', [Validators.required, Validators.email]);
  token = localStorage.getItem('id');

  ngOnInit() {
    if (this.token != null) {
      this.router.navigateByUrl('/home/notes');
    }
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';

  }
  
  login() {
   
    let obs = this.userService.loginPost({
      "email": this.model.email,
      "password": this.model.password,

    })
    .pipe(takeUntil(this.destroy$))

    obs.subscribe((response) => {
      // console.log("login successfull")
      localStorage.setItem('id', response["id"]);
      localStorage.setItem('firstName', response["firstName"]);
      localStorage.setItem('lastName', response["lastName"]);
      localStorage.setItem('email', response["email"]);
      localStorage.setItem('userId', response["userId"])
      localStorage.setItem('imageUrl',response["imageUrl"])
      this.router.navigate(['home']);
      this.snackBar.open("login succesfull", "ok", {
        duration: 2000,
      });
      let body={
      "pushToken":localStorage.getItem('pushtoken')
      }
      this.userService.pushToken(body)
      .pipe(takeUntil(this.destroy$))

      .subscribe((response)=>{
        console.log(response)
        console.log('api hit sucessfull');
      },
      error=>{
        console.log('failed');
        
      }
    )
    },
      (error) => {
        // console.log(error)
        // console.log("login unsuccessfull")
        this.snackBar.open("Invalid details", "false", {
          duration: 2000,
        });
      }
    )
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}