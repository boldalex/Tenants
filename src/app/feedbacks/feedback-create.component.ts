import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  templateUrl: './feedback-create.component.html',
  styleUrls: ['./feedback-create.component.css']
})
export class FeedbackCreateComponent{
  neighborhoodRating = 2;
  flatRating: number;
  locationRating: number;
  ownerRating: number;
  infrastructureRating: number;



  createFeedback(form: NgForm) {
    console.log(form.value);
  }

}
