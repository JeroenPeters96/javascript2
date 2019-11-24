import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';



@Injectable(
  {
    providedIn: 'root'
  }
)
export class GoogleService {

  constructor(private http: HttpClient) {
  }

  lookup(address: string) {
    let baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    baseUrl += address;
    baseUrl += '&key=AIzaSyCO-xUs0S_llZR2oHUlRxR1bMyTmMJF4F0';
    return this.http.get(baseUrl);
  }
}
