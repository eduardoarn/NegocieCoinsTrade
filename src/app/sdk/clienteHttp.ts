import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http/src/static_response';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import * as CryptoJS from 'crypto-js';
import { ServicoBase } from './servico';


@Injectable()
export class HttpClient {

  constructor(private http: Http) { }

  private APPId: string = 'APPid';
  private APIKey: string = 'KeyChave=';



  createAuthorizationHeader(url: string, headers: Headers, autenticacao: boolean = true) {
    if (autenticacao) {
      //headers.append('','');
      // headers.append('Authorization', 'Basic ' +
      //   btoa('username:password')); 

      //Calcular UNIX time
      var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
      let requestTimeStamp: string = parseInt(timeStampInMs.toString()).toString().substring(0, 10);

      //Gera o nonce
      var nonce = Math.floor(new Date().getTime() / 1000);

      //var md5 = CryptoJS.createHash('md5').update(JSON.stringify(params)).digest();
      var md5 = CryptoJS.MD5(JSON.stringify(nonce));

      console.log('md5', md5.toString());

      // var requestContentBase64String = md5.toString('base64');
      var requestContentBase64String = md5.toString();

      var signature = `${this.APPId}${'POST'}${url.toLowerCase()}${nonce}${requestContentBase64String}`;

      console.log('signature', signature.toString());

      //var hmacsignature = crypto.createHmac('sha256', new Buffer(keys.API_SECRET, "base64")).update(signature).digest().toString('base64');
      let segredo: string = atob(this.APIKey);
      var hmacsignature = CryptoJS.HmacSHA256(signature, segredo);
      console.log('hmacsignature', hmacsignature.toString());

      var header_value = this.APPId + ":" + hmacsignature + ":" + nonce;
      console.log('header_value', header_value);

      headers.append("Authorization", 'amx ' + header_value);
      headers.append("Content-Type", 'application/json; charset=utf-8;');

      // // var header_value = 'amx 62fe74174a714dcb969c5bbe3199b31f:KQNxbnehjiK/wFe1GikviBjbrcdw4rYunnOurVokqw0=:1496332736';
      // var headers = { 'Authorization': header_value, 'Content-Type': 'application/json; charset=utf-8' };
      // var options = {
      //   host: host_name,
      //   path: uri,
      //   method: 'POST',
      //   headers: headers
      // };
    }
  }

  converteUrl(servico: ServicoBase, moeda: string = '') {
    return ((moeda) ? servico.urlBase.replace('{0}', moeda) : servico.urlBase)//.toLowerCase();
  }

  get(servico: ServicoBase, moeda: string = ''): Observable<Response> {
    let headers = new Headers();
    let url = this.converteUrl(servico, moeda);
    this.createAuthorizationHeader(url, headers, servico.autenticacao);
    return this.http.get(url, {
      headers: headers
    })
      .map((res: any) => (res.text() != "" ? res.json() : {}))
      .catch((e) => this.handleError(e));
    ;
  }

  post(url, data): Observable<Response> {
    let headers = new Headers();
    this.createAuthorizationHeader(url, headers);
    return this.http.post(url, data, {
      headers: headers
    })
      .map((res: any) => (res.text() != "" ? res.json() : {}))
      .catch((e) => this.handleError(e));
  }

  handleError(error: Response): any {
    console.error('Erro:', error);
    //return Observable.throw('Server error');
  }
}
