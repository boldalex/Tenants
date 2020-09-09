import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-star-rating',
  templateUrl:'./star-rating.component.html',
  styleUrls: ['./star-rating.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, multi: true,
      useExisting: forwardRef(() => StarRatingComponent),
    }
  ]
})
export class StarRatingComponent implements ControlValueAccessor{

  stars: number[] = [1,2,3,4,5];
  @Input() value: number;
  @Input() readonly: boolean;
  hovered: number;

  private onChange: (rating: number) => void;
  private onTouched: () => void;

  @Output() onRate = new EventEmitter<number>();

  onMouseEnter(star: number){
    if (!this.readonly){
      this.hovered = star;
    }
  }

  onMouseLeave(star: number){
    if (!this.readonly){
      this.hovered = 0;
    }
    this.onTouched();
  }

  onClick(star:number){
    if (!this.readonly){
      this.value = star;
      this.onChange(star);
    }
  }

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

}
