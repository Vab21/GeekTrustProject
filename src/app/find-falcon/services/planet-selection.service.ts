import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlanetSelectionService {

  constructor() { }
  getVehiclesForSelectedPlanet(selectedPlanets, vehicles) {
    const vehicleOptions: any = new Array();
    if (selectedPlanets.length > 0 ) {
      const currentPlanet = selectedPlanets[selectedPlanets.length - 1];
      vehicles.forEach(vehicle => {
        if (vehicle.max_distance >= currentPlanet.distance && vehicle.total_no > 0) {
          vehicleOptions.push(vehicle);
        }
      });
      return vehicleOptions.slice();
    } else {
      return vehicles;
    }
  }
  getSelectedPlanet(event, planets): any {
    let selectedPlanet: any;
    planets.forEach(planet => {
      if (planet.name === event.value) {
        selectedPlanet = planet;
      }
    });
    return selectedPlanet;
  }
  getOptionsForNextDestination(currDestOptions, selectedPlanet): any {
    const nextDestOptions = currDestOptions.filter((element1, index, array) => {
      return (element1.name !== selectedPlanet.name);
    });
    return nextDestOptions;
  }
}
