import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http/src/static_response';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpClient {

  constructor(private http: Http) { }

  createAuthorizationHeader(headers: Headers) {
    //headers.append('','');
    // headers.append('Authorization', 'Basic ' +
    //   btoa('username:password')); 
  }

  get(url): Observable<Response> {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  post(url, data): Observable<Response> {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    })
    .map((res: any) => (res.text() != "" ? res.json() : {}));
  }
}
