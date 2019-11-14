import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GeekServiceService } from '../geek-service.service';
import { Observable } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-find-falcon',
  templateUrl: './find-falcon.component.html',
  styleUrls: ['./find-falcon.component.css']
})
export class FindFalconComponent implements OnInit {

  vehicles: any = [];
  planets: any;
  token: Observable<any>;
  selectedVehicles = [];
  selectedPlanets = [];
  result: any;
  dest1Options = [];
  dest2Options = [];
  dest3Options = [];
  dest4Options = [];
  vehicle1Options = [];
  vehicle2Options = [];
  vehicle3Options = [];
  vehicle4Options = [];
  dest2Block = false;
  dest3Block = false;
  dest4Block = false;
  timeDest1 = 0;
  timeDest2 = 0;
  timeDest3 = 0;
  timeDest4 = 0;
  displayedColumnsVehicles: string[] = ['name', 'total_no', 'max_distance', 'speed'];
  displayedColumnsPlanets: string[] = ['name', 'distance'];
  findFalconForm = this.fb.group({
    destination1: ['', Validators.required],
    vehicle1: ['', Validators.required],
    destination2: ['', Validators.required],
    vehicle2: ['', Validators.required],
    destination3: ['', Validators.required],
    vehicle3: ['', Validators.required],
    destination4: ['', Validators.required],
    vehicle4: ['', Validators.required]
  });
  constructor(private geekService: GeekServiceService, private fb: FormBuilder, private router: Router) {  }

  ngOnInit(): void {
    this.getPlanets();
    this.getVehicles();
    //this.getTokenAndResult();
  }

  private getTokenAndResult(planets, vehicles) {
    this.geekService.postToken().subscribe((data: any) => {
      this.token = data.token;
      this.geekService.findFalcon(this.token, planets, vehicles)
      .subscribe((falconData: any) => {
        this.result = falconData;
        let navigationExtras: NavigationExtras;
        if (this.result.status === 'false') {
          navigationExtras = {
            queryParams: {
                status: false
            }
        };
      } else if (this.result.status === 'success') {
          navigationExtras = {
            queryParams: {
              planet: this.result.planet_name,
              totalTime: (this.timeDest1 + this.timeDest2 + this.timeDest3 + this.timeDest4),
              status: true
          }
        };
      } else {
        navigationExtras = {
          queryParams: {
            error: 'Token not initialized. Please get a new token with token API.',
            status: 'undefined'
        }
      };
      }
        this.router.navigate(['result'], navigationExtras);
      });
    });
  }

  private getPlanets() {
    this.geekService.getPlanets().subscribe((data: any) => {
      this.planets = data;
      this.dest1Options = this.planets;
    });
  }
  private getVehicles() {
    this.geekService.getVehicles().subscribe((data: any) => {
      this.vehicles = data;
    });
  }
  /*Get the vehicle options for destination 1 and planets options for destination 2*/
  getVehiclesAndPlanetOptions1(event) {
    let selectedPlanet: any;
    selectedPlanet = this.getSelectedPlanet(event);
    this.dest2Options = this.getOptionsForNextDestination(this.dest1Options, selectedPlanet);
    this.vehicle1Options = this.getVehiclesForSelectedPlanet(selectedPlanet, this.vehicles);
  }
  /*Get the vehicle options for destination 2 and planets options for destination 3*/
  getVehiclesAndPlanetOptions2(event) {
    let selectedPlanet: any;
    selectedPlanet = this.getSelectedPlanet(event);
    this.dest3Options = this.getOptionsForNextDestination(this.dest2Options, selectedPlanet);
    this.vehicle2Options = this.getVehiclesForSelectedPlanet(selectedPlanet, this.vehicles);
    this.findFalconForm.controls.destination1.disable();
    this.findFalconForm.controls.vehicle1.disable();
  }
  /*Get the vehicle options for destination 3 and planets options for destination 4*/
  getVehiclesAndPlanetOptions3(event) {
    let selectedPlanet: any;
    selectedPlanet = this.getSelectedPlanet(event);
    this.dest4Options = this.getOptionsForNextDestination(this.dest3Options, selectedPlanet);
    this.vehicle3Options = this.getVehiclesForSelectedPlanet(selectedPlanet, this.vehicles);
    this.findFalconForm.controls.destination2.disable();
    this.findFalconForm.controls.vehicle2.disable();
  }
  /*Get the vehicle options for destination 4*/
  getVehiclesOptions4(event) {
    let selectedPlanet: any;
    selectedPlanet = this.getSelectedPlanet(event);
    this.vehicle4Options = this.getVehiclesForSelectedPlanet(selectedPlanet, this.vehicles);
    this.findFalconForm.controls.destination3.disable();
    this.findFalconForm.controls.vehicle3.disable();
  }
  getVehiclesForSelectedPlanet(selectedPlanet, prevVehicleOptions) {
    const vehicleOptions: any = new Array();
    prevVehicleOptions.forEach(element => {
      if (element.max_distance >= selectedPlanet.distance && element.total_no > 0) {
        vehicleOptions.push(element);
      }
    });
    return vehicleOptions.slice();
  }
  getSelectedPlanet(event): any {
    let selectedPlanet: any;
    this.planets.forEach(element => {
      if (element.name === event.value) {
        selectedPlanet = element;
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
  checkPreviousSelectedVehicle(index) {
    let previousSelectedVehicle: any;
    const arrLength = this.selectedVehicles.length;
    if (arrLength === index) {
      previousSelectedVehicle = this.selectedVehicles[index - 1];
      this.selectedVehicles.pop();
    } else if (arrLength > index) {
      previousSelectedVehicle = this.selectedVehicles[index - 1];
      this.selectedVehicles[index - 1] = this.selectedVehicles[arrLength - 1];
      this.selectedVehicles[arrLength - 1] = previousSelectedVehicle;
    }
    this.vehicle1Options.forEach(element => {
      if (element.name === previousSelectedVehicle) {
        element.total_no = element.total_no + 1;
      }
    });
  }
  vehicleInventoryMgmt(event) {
    this.vehicles.forEach(element => {
      if (element.name === event.value) {
        element.total_no = element.total_no - 1;
        this.selectedVehicles.push(element.name);
      }
    });
  }
  calculateDestinationDistance(destination): number {
    let distance: number;
    this.planets.forEach(element => {
      if (element.name === destination) {
        distance = element.distance;
      }
    });
    return distance;
  }
  calculateVehicleSpeed(vehicle): number {
    let vehicleSpeed: any;
    this.vehicles.forEach(element => {
      if (element.name === vehicle) {
        vehicleSpeed = element.speed;
      }
    });
    return vehicleSpeed;
  }
  timeToReachDestination(destination, vehicle) {
    const destinationDistance = this.calculateDestinationDistance(destination);
    const vehicleSpeed = this.calculateVehicleSpeed(vehicle);
    return (destinationDistance / vehicleSpeed);

  }
  onSelectingVehicle1(event) {
    this.checkPreviousSelectedVehicle(1);
    this.vehicleInventoryMgmt(event);
    this.timeDest1 = this.timeToReachDestination(this.findFalconForm.controls.destination1.value, event.value);
    this.dest2Block = true;
  }
  onSelectingVehicle2(event) {
    this.dest3Block = true;
    this.checkPreviousSelectedVehicle(2);
    this.vehicleInventoryMgmt(event);
    this.timeDest2 = this.timeToReachDestination(this.findFalconForm.controls.destination2.value, event.value);
  }
  onSelectingVehicle3(event) {
    this.dest4Block = true;
    this.checkPreviousSelectedVehicle(3);
    this.vehicleInventoryMgmt(event);
    this.timeDest3 = this.timeToReachDestination(this.findFalconForm.controls.destination3.value, event.value);
  }
  onSelectingVehicle4(event) {
    this.checkPreviousSelectedVehicle(4);
    this.vehicleInventoryMgmt(event);
    this.timeDest4 = this.timeToReachDestination(this.findFalconForm.controls.destination4.value, event.value);
  }
  vehiclesInventoryReset() {
    this.selectedVehicles.forEach(selectedVehicle => {
      this.vehicles.forEach(vehicle => {
        if ( vehicle.name === selectedVehicle) {
          vehicle.total_no = vehicle.total_no + 1;
        }
      });
    });
    this.selectedVehicles = [];
  }
  onReset() {
    this.enableFields();
    this.dest2Block = this.dest3Block = this.dest4Block = false;
    this.timeDest1 = this.timeDest2 = this.timeDest3 = this.timeDest4 = 0;
    this.vehiclesInventoryReset();
    this.findFalconForm.reset();
  }
  enableFields() {
    this.findFalconForm.controls.destination1.enable();
    this.findFalconForm.controls.destination2.enable();
    this.findFalconForm.controls.destination3.enable();
    this.findFalconForm.controls.vehicle1.enable();
    this.findFalconForm.controls.vehicle2.enable();
    this.findFalconForm.controls.vehicle3.enable();
  }
  disableFields() {
    this.findFalconForm.controls.destination1.disable();
    this.findFalconForm.controls.destination2.disable();
    this.findFalconForm.controls.destination3.disable();
    this.findFalconForm.controls.vehicle1.disable();
    this.findFalconForm.controls.vehicle2.disable();
    this.findFalconForm.controls.vehicle3.disable();
  }
  onSubmit() {
    this.enableFields();
    console.log(this.findFalconForm.value);
    this.selectedPlanets = [this.findFalconForm.controls.destination1.value,
      this.findFalconForm.controls.destination2.value,
      this.findFalconForm.controls.destination3.value,
      this.findFalconForm.controls.destination4.value];
    this.getTokenAndResult(this.selectedPlanets, this.selectedVehicles);
    console.log(this.result);
    this.disableFields();
  }

}
