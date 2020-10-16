import { Component } from '@angular/core';
import { UnitAddress } from '../flats/address.model';
import { FlatData } from '../flats/flat-data.model';
import { Flat } from '../flats/flat.model';

@Component({
  templateUrl: './general-create.component.html',
  styleUrls: ['./general-create.component.css']
})
export class GeneralCreateComponent{

  address: UnitAddress;
  flatData: FlatData;

  onAddressSelect(address: UnitAddress){
    this.address = address;
  }

  onFlatSelect(flatData: FlatData){
    this.flatData = flatData;
    console.log(flatData);
  }

}
