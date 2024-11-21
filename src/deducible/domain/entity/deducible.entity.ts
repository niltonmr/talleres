export class Deducible {
  _valor = true;
  constructor() {}
  get valor(): boolean {
    return this._valor;
  }
  set valor(valor: boolean) {
    this._valor = valor;
  }
}
