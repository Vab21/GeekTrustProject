import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VehicleInvSelctionService {

  constructor() { }
  checkPreviousSelectedVehicle(index, selectedVehicles, vehicles) {
    let previousSelectedVehicle: any;
    const arrLength = selectedVehicles.length;
    if (arrLength === index) {
      previousSelectedVehicle = selectedVehicles[index - 1];
    }
    vehicles.forEach(vehicle => {
      if (vehicle.name === previousSelectedVehicle) {
        vehicle.total_no = vehicle.total_no + 1;
      }
    });
  }
  vehicleInventoryMgmt(event, vehicles) {
    let selectedVehicle;
    vehicles.forEach(vehicle => {
      if (vehicle.name === event.value) {
        vehicle.total_no = vehicle.total_no - 1;
        selectedVehicle = vehicle.name;
      }
    });
    return selectedVehicle;
  }

  vehiclesInventoryReset(selectedVehicles, vehicles) {
    selectedVehicles.forEach(selectedVehicle => {
      vehicles.forEach(vehicle => {
        if ( vehicle.name === selectedVehicle) {
          vehicle.total_no = vehicle.total_no + 1;
        }
      });
    });
  }
}
