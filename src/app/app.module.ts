import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { SignupComponent } from './auth/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { ForbiddenValidatorDirective } from './auth/signup/password-check.directive';
import { InvalidInputDirective } from './auth/signup/invalid-form.directive';
import { LoginComponent } from './auth/login/login.component';
import { FlatListComponent } from './flats/flat-list/flat-list.component';
import { FeedbackCreateComponent } from './feedbacks/feedback-create.component';
import { RatingModule } from 'ng-starrating';
import { StarRatingComponent } from './star-rating/star-rating.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignupComponent,
    LoginComponent,
    FlatListComponent,
    FeedbackCreateComponent,
    StarRatingComponent,
    ForbiddenValidatorDirective,
    InvalidInputDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    HttpClientModule,
    RatingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
