import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GeekServiceService {
  result: any;
  router: Router;
  navigationExtras: any;

  constructor(private http: HttpClient) { }
  vehicleUrl = 'https://findfalcone.herokuapp.com/vehicles';
  tokenUrl = 'https://findfalcone.herokuapp.com/token';
  planetUrl = 'https://findfalcone.herokuapp.com/planets';
  falconUrl = 'https://findfalcone.herokuapp.com/find';
  token = '';
  getVehicles(): Observable<any> {
    return this.http.get<any>(this.vehicleUrl);
  }

  getPlanets(): Observable<any> {
    return this.http.get<any>(this.planetUrl);
  }

  postToken(): Observable<any> {
    const httpOptionstoken = {
      headers: new HttpHeaders({
        Accept : 'application/json'
      })
    };
    const tokenBody = {};
    return this.http.post(this.tokenUrl, tokenBody, httpOptionstoken);
  }

  findFalcon(geekToken, planets, vehicles): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept : 'application/json',
        'Content-Type' : 'application/json'
      })
    };
    const tokenBody = {
      token: geekToken,
      planet_names: planets,
      vehicle_names: vehicles
    };
    return this.http.post(this.falconUrl, tokenBody, httpOptions);
  }

  getTokenAndResult(planets, vehicles, time, router) {
    this.postToken().subscribe((data: any) => {
      let navigationExtras: NavigationExtras;
      this.token = data.token;
      const planetNames = [];
      planets.forEach(planet => {
        planetNames.push(planet.name);
      });
      this.findFalcon(this.token, planetNames, vehicles)
      .subscribe((falconData: any) => {
        this.result = falconData;
        console.log(this.result);
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
              totalTime: time,
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
        router.navigate(['result'], navigationExtras);
      }, (error) => {
        console.log(error);
        navigationExtras = {
          queryParams: {
            error: 'error',
            status: 'undefined'
        }
      };
        router.navigate(['result'], navigationExtras);
      });
    });
  }
}
