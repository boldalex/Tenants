import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import {NgForm} from '@angular/forms';
import { InvalidInputDirective } from './invalid-form.directive';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  hide = true;
  constructor(public authService: AuthService) {}

  onSignUp(form: NgForm){
    console.log(form.invalid);
    if (form.invalid) {
      return;
    }
    this.authService.createUser(form.value.email, form.value.username, form.value.password1);
  }

}
