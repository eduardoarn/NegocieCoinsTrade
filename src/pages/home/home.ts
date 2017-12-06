import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Headers, Request, RequestOptions } from '@angular/http';
//import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


class ServicoBase {
  Type: string;
  UrlBase: string;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private Moedas: any[] = ['btcbrl', 'ltcbrl', 'bchbrl', 'btgbrl'];
  private Servicos: ServicoBase[] = [
    { Type: 'Tiker', UrlBase: 'https://broker.negociecoins.com.br/api/v3/{0}/ticker' },
    { Type: 'orderbook', UrlBase: 'https://broker.negociecoins.com.br/api/v3/{0}/orderbook' },
    { Type: 'trades', UrlBase: 'https://broker.negociecoins.com.br/api/v3/{0}/trades' },
  ];

  private ultimaCotacao: any;

  constructor(public navCtrl: NavController,
    protected http: Http
  ) {
    
    this.request('GET', this.Servicos[0].UrlBase.replace('{1}',this.Moedas[0])).subscribe(
      data => { this.ultimaCotacao = data; }
    )
  }




  public request(
    method: string,
    url: string,

    urlParams: any = {},
    postBody: any = {},
    customHeaders?: Function
  ): Observable<any> {

    // Headers to be sent
    let headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // Authenticate request
    this.authenticate(url, headers);

    let body: any;
    let postBodyKeys = typeof postBody === 'object' ? Object.keys(postBody) : []
    if (postBodyKeys.length === 1) {
      body = postBody[postBodyKeys.shift()];
    } else {
      body = postBody;
    }
    let filter: string = '';

    if (typeof customHeaders === 'function') {
      headers = customHeaders(headers);
    }
    let request: Request = new Request(
      new RequestOptions({
        headers: headers,
        method: method,
        url: `${url}${filter}`,
        body: body ? JSON.stringify(body) : undefined,
      })
    );
    return this.http.request(request)
      .map((res: any) => (res.text() != "" ? res.json() : {}))
      .catch((e) => this.handleError(e));

  }


  public authenticate(url: string, headers: Headers): void {

    // headers.append(
    //   'Authorization',
    //   ''
    // );

  }

  public handleError(error: Response): any {
    console.error('handleError', error)
    let e: any = error.json();
    return Observable.throw(e.error || 'Server error');
  }

}
