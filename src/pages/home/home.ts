import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '../../app/sdk/clienteHttp';
import { ServicoBase } from '../../app/sdk/servico';
// import { HttpClient, HttpRequest } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';





@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  private Moedas: any[] = ['btcbrl', 'ltcbrl', 'bchbrl', 'btgbrl'];
  private Servicos: ServicoBase[] = [
    { tipo: 'tiker', utlBase: 'https://broker.negociecoins.com.br/api/v3/{0}/ticker', autenticacao: false },
    { tipo: 'orderbook', utlBase: 'https://broker.negociecoins.com.br/api/v3/{0}/orderbook', autenticacao: false },
    { tipo: 'trades', utlBase: 'https://broker.negociecoins.com.br/api/v3/{0}/trades', autenticacao: false },
    { tipo: 'balance', utlBase: 'https://broker.negociecoins.com.br/tradeapi/v1/user/balance', autenticacao: true },
  ];


  private ultimaCotacao: any;
  private balanco: any;
  private carregando: boolean = false;

  private timeout: any;

  private tempoAtualizacao: number = 5;

  constructor(public navCtrl: NavController,
    private http: HttpClient
  ) {


    // this.request('GET', this.Servicos[0].UrlBase.replace('{1}', this.Moedas[0])).subscribe(
    //   data => { this.ultimaCotacao = data; }
    // )



  }

  ionViewDidEnter() {
    this.atualizarUltimaCotacao();
    this.atualizarBalanco();
  }

  atualizarBalanco() {
    this.carregando = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.http.get(this.Servicos.find(x => { return x.tipo == 'balance' }), this.Moedas[0]).subscribe(
      (data: any) => {
        console.log(data);

        this.balanco = data.json();
        this.carregando = false;
        // this.timeout = setTimeout(() => {
        //   this.atualizarBalanco();
        // }, (this.tempoAtualizacao) ? this.tempoAtualizacao * 1000 : 5);
      });
  }

  atualizarUltimaCotacao() {
    this.carregando = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.http.get(this.Servicos.find(x => { return x.tipo == 'tiker' }), this.Moedas[0]).subscribe(
      (data: any) => {
        this.ultimaCotacao = data.json();
        this.carregando = false;
        this.timeout = setTimeout(() => {
          this.atualizarUltimaCotacao();
        }, (this.tempoAtualizacao) ? this.tempoAtualizacao * 1000 : 5);
      });
  }

  // request(method: any, url: any): any {
  //   let a: any = new HttpRequest('GET', '')
  //   let request = new HttpRequest(
  //     method,
  //     `${url}`,
  //     // {
  //     //   headers: headers,
  //     //   // body: body ? JSON.stringify(body) : undefined,
  //     // }
  //   );
  //   return this.http.request(request)
  //     .map((res: any) => (res.text() != "" ? res.json() : {}))
  //     .catch((e) => this.handleError(e));
  // }


  // public handleError(error: Response): any {
  //   console.error('handleError', error)
  //   let e: any = error.json();
  //   return Observable.throw(e.error || 'Server error');
  // }

}
