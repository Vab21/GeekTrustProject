import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup, FormControl } from '@angular/forms';
import { GeekServiceService } from './services/geek-service.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TimeCalculationService } from './services/time-calculation.service';
import { PlanetSelectionService } from './services/planet-selection.service';
import { VehicleInvSelctionService } from './services/vehicle-inv-selction.service';
import { BreakpointObserver } from '@angular/cdk/layout';
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
  destOptions = [];
  displayedColumnsVehicles: string[] = ['name', 'total_no', 'max_distance', 'speed'];
  displayedColumnsPlanets: string[] = ['name', 'distance'];
  findFalconForm = this.fb.group({
    destBlocks: this.fb.array([
      this.fb.group({
        destination: ['', Validators.required],
        vehicle: ['', Validators.required],
        timeTaken: ['']
      })
    ])
  });
  vehicleOptions = [];
  timeTaken = [];
  submitBlock: boolean;
  totalTime = 0;
  constructor(private geekService: GeekServiceService,
              private fb: FormBuilder,
              private router: Router,
              private timeService: TimeCalculationService,
              private planetSelection: PlanetSelectionService,
              private vehicleInvSelection: VehicleInvSelctionService) {}

  ngOnInit(): void {
    this.getPlanets();
    this.getVehicles();
  }
  getControls() {
    const destBlocks = this.findFalconForm.get('destBlocks') as FormArray;
    return destBlocks.controls;
  }
  private getPlanets() {
    this.geekService.getPlanets().subscribe((data: any) => {
      this.planets = data;
      this.destOptions[0] = this.planets;
    });
  }
  private getVehicles() {
    this.geekService.getVehicles().subscribe((data: any) => {
      this.vehicles = data;
    });
  }
  onSelectingPlanet(event, index) {
    const destBlocks = this.getControls();
    if ( index > 0 ) {
      destBlocks[index - 1].disable();
    }
    destBlocks[index].get('vehicle').setValue('');
    destBlocks[index].get('timeTaken').setValue('');
    this.selectedPlanets[index] = this.planetSelection.getSelectedPlanet(event, this.planets);
    this.destOptions[index + 1] = this.planetSelection.getOptionsForNextDestination(this.destOptions[index], this.selectedPlanets[index]);
    this.vehicleOptions[index] = this.planetSelection.getVehiclesForSelectedPlanet(this.selectedPlanets, this.vehicles);
  }
  onSelectingVehicle(event, index) {
    this.vehicleInvSelection.checkPreviousSelectedVehicle(index + 1, this.selectedVehicles, this.vehicles);
    this.selectedVehicles[index] = this.vehicleInvSelection.vehicleInventoryMgmt(event, this.vehicles);
    const destBlocks = this.findFalconForm.get('destBlocks') as FormArray;
    const destination = destBlocks.controls[index].value.destination;
    const time = this.timeService.timeToReachDestination(destination, this.planets, event.value, this.vehicles);
    destBlocks.controls[index].get('timeTaken').setValue(time);
    this.addNewDestBlock(index);
    this.timeTaken[index] = destBlocks.controls[index].get('timeTaken').value;
    this.totalTime = this.timeService.calculateTotalTime(this.timeTaken);
  }
  addNewDestBlock(index) {
    const destBlocks = this.findFalconForm.get('destBlocks') as FormArray;
    /*change here to increase or decrease number of destinations to be travelled.*/
    if (destBlocks.length < 4 && destBlocks.length === (index + 1)) {
      destBlocks.push(
        new FormGroup({
          destination: new FormControl('', Validators.required),
          vehicle: new FormControl('', Validators.required),
          timeTaken: new FormControl('')
        })
      );
    } else {
      this.submitBlock = true;
    }
  }
  onReset() {
    this.totalTime = 0;
    this.timeTaken = [];
    const destBlocks = this.findFalconForm.get('destBlocks') as FormArray;
    // tslint:disable-next-line:prefer-for-of
    const destBlocksLength = destBlocks.length - 1;
    for (let i = destBlocksLength; i > 0; i--) {
      destBlocks.removeAt(i);
    }
    this.vehicleInvSelection.vehiclesInventoryReset(this.selectedVehicles, this.vehicles);
    this.selectedVehicles = [];
    this.selectedPlanets = [];
    this.enableFields();
    this.findFalconForm.reset();
    this.submitBlock = false;
  }
  enableFields() {
    const destBlocks = this.getControls();
    destBlocks.forEach(control => {
      control.enable();
    });
  }
  onSubmit() {
    this.enableFields();
    console.log(this.findFalconForm.value);
    this.geekService.getTokenAndResult(this.selectedPlanets, this.selectedVehicles, this.totalTime, this.router);
  }
}
