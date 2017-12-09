import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';



@Component({
  selector: 'page-configuracoes',
  templateUrl: 'configuracoes.html',
})
export class ConfiguracoesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    this.carregar();
  }

  private appId: any;
  private appKey: any;
  private opcoes: any;
  private carregando: boolean = false;

  private tempoAtualizacao: number = 5;

  salvar() {
    this.carregando = true;
    this.storage.set('chave', { appId: this.appId, appKey: this.appKey, atualizacao: this.tempoAtualizacao }).then(() => {
      this.carregando = false;
    })
  }

  carregar() {
    this.carregando = true;
    this.storage.get('chave').then((val) => {
      if (val) {
        if (val.appId) this.appId = val.appId;
        if (val.appKey) this.appKey = val.appKey;
        if (val.atualizacao) this.tempoAtualizacao = val.atualizacao;
      }
      this.carregando = false;
    })
  }

  ionViewDidLoad() {
  }

}
