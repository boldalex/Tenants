import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FlatService } from '../flat.service';
import { UnitAddress } from '../address.model';
import { Flat } from '../flat.model';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { FlatData } from '../flat-data.model';

@Component({
  selector: 'app-flat-create',
  templateUrl: './flat-create.component.html',
  styleUrls: ['./flat-create.component.css']
})
export class FlatCreateComponent implements OnInit{

  constructor(public flatService: FlatService, private fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {}

  flatForm = this.fb.group({
    flatNumber: ['',Validators.required],
    fullAddress: ['',Validators.required]
  });

  @ViewChild('search')
  public searchElement: ElementRef;
  public defLongitude = 37.6222431;
  public defLatitude = 55.75694430000001;
  public zoom = 9;
  public longitude: number;
  public latitude: number;
  public latlongs: any = [];

  public fullAddress: string;

  @Input() address: UnitAddress;

  @Output() flat = new EventEmitter<{address: UnitAddress, flatNumber: number}>();

  ngOnInit() {
    console.log(this.address);
    if (this.address){
      this.flatForm.patchValue({
        fullAddress: this.address.fullAddress
      });
      this.latitude = this.address.latitude;
      this.longitude = this.address.longitude;
    }
      this.zoom = 20;
      // this.seacrhControl = new FormControl();
      this.mapsAPILoader.load().then(() => {
        const autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement,{
          types: ['address'],
          componentRestrictions: {country: 'RU'}
        });

        autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            const place: google.maps.places.PlaceResult = autocomplete.getPlace();
            if (place.geometry === undefined || place.geometry === null){
              console.log('skipped');
              return;
            }
            const latlong = {
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng()
            }

            this.fullAddress = place.name;
            this.defLatitude = latlong.latitude;
            this.defLongitude = latlong.longitude;
            this.longitude = latlong.longitude;
            this.latitude = latlong.latitude;
            this.zoom = 12;

            // this.seacrhControl.reset();

            console.log(place.formatted_address);

          });

        })
      });
  }

  private setCurrentPosition(){
    if ('geolocation' in navigator){
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
      })
    }
  }

  onSubmit(){
    if (!this.address){
      this.address = {
        addressId: null,
        fullAddress: this.fullAddress,
        longitude: this.longitude,
        latitude: this.latitude
      }
    }
    const flatCreated : FlatData = {
      address: this.address,
      flatNumber: this.flatForm.get('flatNumber').value
    }
    this.flat.emit(flatCreated);
  }




}
