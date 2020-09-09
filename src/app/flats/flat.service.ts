import { Injectable } from '@angular/core';
import { UnitAddress } from './address.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Flat } from './flat.model';
import { dependenciesFromGlobalMetadata } from '@angular/compiler/src/render3/r3_factory';

const BACKEND_URL = "http://localhost:3000/api/user/addresses";


@Injectable({providedIn: 'root'})
export class FlatService{
  private addresses : UnitAddress [] = [];
  private flats : Flat[] = [];
  private addressesUpdated = new Subject<{ addresses: UnitAddress[]}>();
  // private flatsUpdated = new Subject<{ flats: Flat[]}>();

  constructor(private http: HttpClient, private router: Router){}

  getAddresses(){
    // const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, addresses: any}>("http://localhost:3000/api/addresses")
    .pipe(map((addressData) => {
      return {
        message: addressData.message,
        addresses: addressData.addresses.map(address => {
          return {
            address_id: address.address_id,
            street: address.street,
            house: address.property_number,
            flats: [],
            longitude: address.longitude,
            latitude: address.latitude
          }
        })
      }
    }))
    .subscribe((transformedData) => {
      this.addresses = transformedData.addresses;
      this.addressesUpdated.next({ addresses: [...this.addresses] });
    });
  }

  getAddressUpdateListener(){
    return this.addressesUpdated.asObservable();
  }

  getFlatsByAddress(addressId: string){
    this.http.get<{message: string, flats: any}>("http://localhost:3000/api/flats/" + addressId )
    .pipe(map((flatData)=>{
      return {
        flats: flatData.flats.map(flat =>{
          return{
            address_id: flat.address_id,
            flat_id: flat.flat_id,
            flat_number: flat.flat_number,
            general_r: Math.round(flat.general_r)
          }
        })
      }
    }))
    .subscribe(response => {
      this.addresses[this.findAdress(addressId)].flats = response.flats;
      this.addressesUpdated.next({ addresses: [...this.addresses] });
    });
  }

  private findAdress(id){
    return this.addresses.findIndex(address =>{
      return address.address_id === id;
    });
  }
}
