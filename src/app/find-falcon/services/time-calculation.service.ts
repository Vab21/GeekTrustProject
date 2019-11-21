import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeCalculationService {

  constructor() { }

  timeToReachDestination(destination, planets, selectedVehicle, vehicles) {
    let timeTaken: any;
    const destinationDistance = this.calculateDestinationDistance(destination, planets);
    const vehicleSpeed = this.calculateVehicleSpeed(selectedVehicle, vehicles);
    timeTaken = (destinationDistance / vehicleSpeed);
    return timeTaken;

  }
  calculateDestinationDistance(destination, planets): number {
    let distance: number;
    planets.forEach(planet => {
      if (planet.name === destination) {
        distance = planet.distance;
      }
    });
    return distance;
  }
  calculateVehicleSpeed(vehicleName, vehicles): number {
    let vehicleSpeed: any;
    vehicles.forEach(vehicle => {
      if (vehicle.name === vehicleName) {
        vehicleSpeed = vehicle.speed;
      }
    });
    return vehicleSpeed;
  }
  calculateTotalTime(timeTaken): number {
    let totalTime = 0;
    timeTaken.forEach(time => {
      totalTime = totalTime + time;
    });
    return totalTime;
  }

}
