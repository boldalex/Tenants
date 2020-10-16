import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FlatService } from '../flat.service';
import { Subscription } from 'rxjs';
import { UnitAddress } from '../address.model';
import { Flat } from '../flat.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css']
})
export class AddressListComponent implements OnInit, OnDestroy{
  addresses: UnitAddress[] = [];
  private addressSub: Subscription;

  @Input() createMode: boolean = false;
  @Output() addressPush = new EventEmitter<UnitAddress>();

  constructor(public flatService: FlatService){}

  ngOnInit(){
    this.flatService.getAddresses();
    this.addressSub = this.flatService.getAddressUpdateListener()
      .subscribe((addressData: { addresses: UnitAddress[]})=>{
      this.addresses = addressData.addresses;
    });
  }

  showFlats(address: UnitAddress){
    if (address.flats.length === 0 && !this.createMode){
      this.flatService.getFlatsByAddress(address.addressId);
    }
  }

  onNewFlat(address: UnitAddress){
    this.addressPush.emit(address);
  }

  ngOnDestroy(){
    this.addressSub.unsubscribe();
  }
}
