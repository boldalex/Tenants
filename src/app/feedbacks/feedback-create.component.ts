import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FlatData } from '../flats/flat-data.model';
import { FlatService } from '../flats/flat.service';


@Component({
  selector: 'app-feedback-create',
  templateUrl: './feedback-create.component.html',
  styleUrls: ['./feedback-create.component.css']
})
export class FeedbackCreateComponent{

  @Input() flat: FlatData;

  public showError = false;

  constructor(private flatService: FlatService, private _snackBar: MatSnackBar, private router: Router){}

  rating = 0;
  // public neighborhoodRating = 0;
  flatRating = 0;
  locationRating = 0;
  ownerRating = 0;
  infrastructureRating = 0;



  createFeedback(form: NgForm) {
    const data = {
      userId: localStorage.getItem('userId'),
      feedbackDate: new Date(),
      neighborhoodRating: form.value.neighborhoodRating,
      neighborhoodComment: form.value.neighborhoodComment,
      flatRating: form.value.flatRating,
      flatComment: form.value.flatComment,
      locationRating: form.value.locationRating,
      locationComment: form.value.locationComment,
      ownerRating: form.value.ownerRating,
      ownerComment: form.value.ownerComment,
      infrastructureRating: form.value.infrastructureRating,
      infrastructureComment: form.value.infrastructureComment,
      generalComment: form.value.generalComment
    }
    console.log(data);
    if (form.invalid){
      this.showError = true;
      return;
    }


    this.flatService.createFlat(this.flat).subscribe((response) => {
      const data = {
        flatId: response.flatId,
        userId: localStorage.getItem('userId'),
        feedbackDate: new Date(),
        neighborhood_r: form.value.neighborhoodRating,
        neighborhood_c: form.value.neighborhoodComment,
        flat_r: form.value.flatRating,
        flat_c: form.value.flatComment,
        location_r: form.value.locationRating,
        location_c: form.value.locationComment,
        owner_r: form.value.ownerRating,
        owner_c: form.value.ownerComment,
        infrastructure_r: form.value.infrastructureRating,
        infrastructure_c: form.value.infrastructureComment,
        general_c: form.value.generalComment
      }
      this.flatService.createFeedback(data);
      this._snackBar.open('Отзыв успешно создан', 'Ok', {
        duration: 2000,
      });
      this.router.navigate(['/login']);
    });
  }

}
