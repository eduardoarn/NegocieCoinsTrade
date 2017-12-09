import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '../../app/sdk/clienteHttp';
import { ServicoBase } from '../../app/sdk/servico';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
// import { HttpClient, HttpRequest } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';





@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private AppId: string;
  private AppKey: string;

  private Moedas: any[] = ['btcbrl', 'ltcbrl', 'bchbrl', 'btgbrl'];
  private Servicos: ServicoBase[] = [
    { tipo: 'negocieCoins', operacao: 'tiker', urlBase: 'https://broker.negociecoins.com.br/api/v3/{0}/ticker', autenticacao: false },
    { tipo: 'negocieCoins', operacao: 'orderbook', urlBase: 'https://broker.negociecoins.com.br/api/v3/{0}/orderbook', autenticacao: false },
    { tipo: 'negocieCoins', operacao: 'trades', urlBase: 'https://broker.negociecoins.com.br/api/v3/{0}/trades', autenticacao: false },
    { tipo: 'negocieCoins', operacao: 'balance', urlBase: `https://api.negociecoins.tk/api/NegocieCoins/{AppId}/k/{AppKey}/o/user/balance`, autenticacao: false },
    { tipo: 'coinMarketCap', operacao: 'tiker', urlBase: `https://api.coinmarketcap.com/v1/ticker/?convert=BRL&limit=1`, autenticacao: false },
    { tipo: 'poloniex', operacao: 'tiker', urlBase: `https://poloniex.com/public?command=returnTicker`, autenticacao: false },
  ];


  private ultimaCotacao: any;
  private coinMarketCap: any;
  private poloniex: any;
  private balanco: any;
  private valorCalcular: number;
  private carregando: boolean = false;
  private carregandoCoinMarketCap: boolean = false;
  private carregandoPoloniex: boolean = false;
  private carregandoSaldo: boolean = false;

  private timeout: any;
  private timeoutCoinMarketCap: any;
  private timeoutPoloniex: any;

  private tempoAtualizacao: number = 5;

  constructor(public navCtrl: NavController,
    private http: HttpClient,
    private storage: Storage
  ) {


  }

  ionViewDidEnter() {
    this.atualizarUltimaCotacao();
    this.atualizaCoinMarketCap();
    this.atualizaPloniex();
    this.carregaDados();
  }

  async carregaDados() {
    let val = await this.storage.get('chave');
    if (val) {
      if (val.appId) this.AppId = val.appId;
      if (val.appKey) this.AppKey = val.appKey;
      if (val.atualizacao) this.tempoAtualizacao = val.atualizacao;
      this.atualizarBalanco();
    }

  }

  atualizarBalanco() {
    if (this.AppId && this.AppKey) {
      this.carregandoSaldo = true;
      if (this.timeout) clearTimeout(this.timeout);
      let servico: ServicoBase = this.Servicos.find(x => { return x.operacao == 'balance' });
      servico.urlBase = servico.urlBase.replace('{AppId}', this.AppId).replace('{AppKey}', this.AppKey)
      this.http.get(servico).subscribe(
        (data: any) => {
          try {
            this.balanco = JSON.parse(data);
            let BTC: any = this.balanco.coins.find((x) => x.name == 'BTC');
            this.valorCalcular = BTC.total;
          } catch (error) {
            console.log('erro carregar balanço', error);

          }
          this.carregandoSaldo = false;
          // this.timeout = setTimeout(() => {
          //   this.atualizarBalanco();
          // }, (this.tempoAtualizacao) ? this.tempoAtualizacao * 1000 : 5);
        },
        err => { this.carregandoSaldo = false; },
        () => { });
    }
  }

  atualizarUltimaCotacao() {
    this.carregando = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.http.get(this.Servicos.find(x => { return x.tipo == 'negocieCoins' && x.operacao == 'tiker' }), this.Moedas[0]).subscribe(
      (data: any) => {
        this.ultimaCotacao = data;
        this.carregando = false;
        this.timeout = setTimeout(() => {
          this.atualizarUltimaCotacao();
        }, (this.tempoAtualizacao) ? this.tempoAtualizacao * 1000 : 5);
      });
  }

  atualizaCoinMarketCap() {
    this.carregandoCoinMarketCap = true;
    if (this.timeoutCoinMarketCap) clearTimeout(this.timeoutCoinMarketCap);
    this.http.get(this.Servicos.find(x => { return x.tipo == 'coinMarketCap' && x.operacao == 'tiker' }), this.Moedas[0]).subscribe(
      (data: any) => {
        this.coinMarketCap = data[0];
        this.carregandoCoinMarketCap = false;
        this.timeoutCoinMarketCap = setTimeout(() => {
          this.atualizaCoinMarketCap();
        }, (this.tempoAtualizacao) ? this.tempoAtualizacao * 1000 : 5);
      });

  }

  atualizaPloniex() {
    this.carregandoPoloniex = true;
    if (this.timeoutPoloniex) clearTimeout(this.timeoutPoloniex);
    this.http.get(this.Servicos.find(x => { return x.tipo == 'poloniex' && x.operacao == 'tiker' }), this.Moedas[0]).subscribe(
      (data: any) => {
        this.poloniex = data.USDT_BTC;
        this.carregandoPoloniex = false;
        this.timeoutPoloniex = setTimeout(() => {
          this.atualizaPloniex();
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
