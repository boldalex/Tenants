import { Injectable } from '@angular/core';
import { UnitAddress } from './address.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Flat } from './flat.model';
import { dependenciesFromGlobalMetadata } from '@angular/compiler/src/render3/r3_factory';
import { FlatData } from './flat-data.model';
import { FeedbackModel } from '../feedbacks/feedback.model';
import { FeedbackData } from '../feedbacks/feedback-data.model';
import { UnitData } from './unit-data.model';

const BACKEND_URL = "http://localhost:3000/api/user/addresses";


@Injectable({providedIn: 'root'})
export class FlatService{
  private data: any;
  private addresses : UnitAddress [] = [];
  private unit: UnitData = {
    address: null,
    feedbacks: [],
    flat: null
  };
  // private feedbacks : FeedbackData[] = [];
  private addressesUpdated = new Subject<{ addresses: UnitAddress[]}>();
  // private feedbacksUpdated = new Subject<{ feedbacks: FeedbackData[]}>();
  // private flatsUpdated = new Subject<{ flats: Flat[]}>();
  private unitUpdated = new Subject<{ unit: UnitData }>()

  constructor(private http: HttpClient, private router: Router){}

  getAddresses(){
    // const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, addresses: any}>("http://localhost:3000/api/addresses")
    .pipe(map((addressData) => {
      return {
        message: addressData.message,
        addresses: addressData.addresses.map(address => {
          return {
            addressId: address.address_id,
            fullAddress: address.full_address,
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

  getUnitUpdateListener(){
    return this.unitUpdated.asObservable();
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
      return address.addressId === id;
    });
  }

  createFlat(flat: FlatData){
    if (flat.address.addressId === null){
      this.data = {
        fullAddress: flat.address.fullAddress,
        longitude: flat.address.longitude,
        latitude: flat.address.latitude,
        flatNumber: flat.flatNumber
      }
    } else {
      this.data = {
        addressId : flat.address.addressId,
        fullAddress: flat.address.fullAddress,
        longitude: flat.address.longitude,
        latitude: flat.address.latitude,
        flatNumber: flat.flatNumber
      }
    }
    return this.http.post<{message:string,flatId:number}>("http://localhost:3000/api/flats/",this.data);
  }

  createFeedback(feedback: FeedbackModel){
    this.http.post<{message:string}>("http://localhost:3000/api/feedbacks/",feedback).subscribe((response) => {
      console.log(response);
    });
  }

  getUnitData(flatId: number){
    this.http.get<{message: string, feedbacks: any}>("http://localhost:3000/api/feedbacks/" + flatId )
    .pipe(map((feedbackData)=>{
      return {
        feedbacks: feedbackData.feedbacks.map(feedback =>{
          return{
            userId: feedback.user_id,
            userName: feedback.username,
            feedbackDate: feedback.feedback_date,
            neighborhood_r: feedback.neighborhood_r,
            neighborhood_c: feedback.neighborhood_c,
            flat_r: feedback.flat_r,
            flat_c: feedback.flat_c,
            location_r: feedback.location_r,
            location_c: feedback.location_c,
            owner_r: feedback.owner_r,
            owner_c: feedback.owner_c,
            infrastructure_r: feedback.infrastructure_r,
            infrastructure_c: feedback.infrastructure_c,
            general_c: feedback.general_c,
            general_r: feedback.general_r
          }
        })
      }
    }))
    .subscribe(response => {
      this.unit.feedbacks = response.feedbacks;
    });

    this.http.get<{ message:string, unit: any}>("http://localhost:3000/api/flats/unit/" + flatId )
    .subscribe((response) =>{
      const uAddress = {
        addressId: response.unit.address_id,
        fullAddress: response.unit.full_address,
        longitude: response.unit.longitude,
        latitude: response.unit.latitude
      }
      const uFlat = {
        flat_id: response.unit.flat_id,
        address_id: response.unit.address_id,
        flat_number: response.unit.flat_number,
        general_r: response.unit.general_r
      }
      this.unit.address = uAddress;
      this.unit.flat = uFlat;
      this.unitUpdated.next({ unit: {... this.unit} });
    });
  }
}
