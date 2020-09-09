import { Directive, ElementRef, HostListener, Renderer2, OnInit } from "@angular/core";
import { AbstractControl, NgModel } from '@angular/forms';

@Directive({
  selector: '[invalidInput]'
})

export class InvalidInputDirective{

  constructor (
    private el: ElementRef,
    private ngControl: NgModel,
    private renderer: Renderer2
    ) {}


  getElement(){
    return this.el;
  }

  // ngOnInit(){
  //   this.renderer.setStyle(this.el.nativeElement, 'margin-bottom', '50');
  //   this.renderer.setStyle(this.el.nativeElement, 'background-color', 'blue');
  // }

  @HostListener('blur')onBlur() {
    const field = this.renderer.parentNode(this.el.nativeElement);
    const root = this.renderer.parentNode(field);
    const final = this.renderer.nextSibling(root);
    const kek = this.renderer.nextSibling(final);
    if (this.ngControl.invalid){
      console.log(kek);
      this.renderer.setStyle(kek, 'margin-bottom', '100px');
    }
    else{
      this.renderer.setStyle(root, 'margin-bottom', '0px');
    }
  }



}

