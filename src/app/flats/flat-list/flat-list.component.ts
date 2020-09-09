import { Component, OnInit, OnDestroy } from '@angular/core';
import { FlatService } from '../flat.service';
import { Subscription } from 'rxjs';
import { UnitAddress } from '../address.model';

@Component({
  templateUrl: './flat-list.component.html',
  styleUrls: ['./flat-list.component.css']
})
export class FlatListComponent implements OnInit, OnDestroy{
  addresses: UnitAddress[] = [];
  private addressSub: Subscription;

  constructor(public flatService: FlatService){}

  ngOnInit(){
    this.flatService.getAddresses();
    this.addressSub = this.flatService.getAddressUpdateListener()
      .subscribe((addressData: { addresses: UnitAddress[]})=>{
      this.addresses = addressData.addresses;
    });
  }

  showFlats(address: UnitAddress){
    if (address.flats.length === 0){
      this.flatService.getFlatsByAddress(address.address_id);
      console.log('flats loaded');
    }
    else{
      console.log('skipped');
    }
  }

  onRate(){}

  ngOnDestroy(){
    this.addressSub.unsubscribe();
  }
}
