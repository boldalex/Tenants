import { Component } from "@angular/core";
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  hide = true;
  constructor (public authService: AuthService) {}

  onLogin(form: NgForm){
    console.log(form.invalid);
    if (form.invalid) {
      return;
    }
    this.authService.login(form.value.email, form.value.password);
  }

}
