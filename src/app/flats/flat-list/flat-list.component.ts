import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FlatService } from '../flat.service';
import { Subscription } from 'rxjs';
import { UnitAddress } from '../address.model';
import { Flat } from '../flat.model';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FeedbackModel } from 'src/app/feedbacks/feedback.model';
import { FeedbackData } from 'src/app/feedbacks/feedback-data.model';
import { UnitData } from '../unit-data.model';

@Component({
  selector: 'app-flat-list',
  templateUrl: './flat-list.component.html',
  styleUrls: ['./flat-list.component.css']
})
export class FlatListComponent implements OnInit, OnDestroy{

  public isLoading = true;
  averageRatings = {
    neighborhood: 0,
    flat: 0,
    location: 0,
    owner: 0,
    infrastructure: 0
  }
  flatId : number;
  address: UnitAddress;
  flat: Flat;
  feedbacks: FeedbackData[];
  unit: UnitData;
  private unitSub: Subscription;

  constructor(public flatService: FlatService, public route: ActivatedRoute){}

  ngOnInit(){
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.flatId = parseInt(paramMap.get('flatId'));
    });

    this.flatService.getUnitData(this.flatId);
    this.unitSub = this.flatService.getUnitUpdateListener()
      .subscribe((unitData: { unit: UnitData})=>{
      this.unit = unitData.unit;
      console.log(this.unit);
      for (let feedback of this.unit.feedbacks){
        this.averageRatings.neighborhood += feedback.neighborhood_r;
        this.averageRatings.flat += feedback.flat_r;
        this.averageRatings.infrastructure += feedback.infrastructure_r;
        this.averageRatings.location += feedback.location_r;
        this.averageRatings.owner += feedback.owner_r;
      }
      this.averageRatings.neighborhood /= this.unit.feedbacks.length;
      this.averageRatings.owner /= this.unit.feedbacks.length;
      this.averageRatings.location /= this.unit.feedbacks.length;
      this.averageRatings.infrastructure /= this.unit.feedbacks.length;
      this.averageRatings.flat /= this.unit.feedbacks.length;

      this.isLoading = false;
    });
  }

  show(){
    console.log(this.unit);
    console.log(this.averageRatings);

    console.log();
  }

  truncateDecimals(num: number){
    if (Number.isInteger(num)){
      return num;
    }
    return Number(num).toFixed(1);
  }

  ngOnDestroy(){
    this.unitSub.unsubscribe();
  }
}
