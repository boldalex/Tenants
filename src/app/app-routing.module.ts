import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { FlatListComponent } from './flats/flat-list/flat-list.component';
import { FeedbackCreateComponent } from './feedbacks/feedback-create.component';
import { GeneralCreateComponent } from './general-create/general-create.component';
import { AddressListComponent } from './flats/address-list/address-list.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'signup', component: SignupComponent},
  { path: 'login', component: LoginComponent},
  { path: 'flats', component: AddressListComponent},
  { path: 'flat/feedbacks/:flatId', component: FlatListComponent},
  { path: 'create', component: GeneralCreateComponent},
  { path: 'feedbacks/create', component: FeedbackCreateComponent},
  { path: 'home', component: HomeComponent}
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
