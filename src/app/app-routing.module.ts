import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { FlatListComponent } from './flats/flat-list/flat-list.component';
import { FeedbackCreateComponent } from './feedbacks/feedback-create.component';

const routes: Routes = [
  { path: 'signup', component: SignupComponent},
  { path: 'login', component: LoginComponent},
  { path: 'flats', component: FlatListComponent},
  { path: 'feedbacks/create', component: FeedbackCreateComponent},
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
