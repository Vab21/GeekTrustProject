import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeekServiceService {

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

  testingService(): Observable<any> {
    return this.http
      .get<{ [key: string]: any }>(
        'https://ng-complete-guide-c56d3.firebaseio.com/posts.json'
      )
      .pipe(
        map(responseData => {
          const postsArray: any = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        })
      );
  }
}
