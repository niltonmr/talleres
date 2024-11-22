export interface GetDeducibleRequest {
  payload: {
    text: string;
  };
  query: object;
  path: object;
}
export interface GetDeducibleResponse {
  payload: Array<Deducible>;
}

export interface Deducible {
  deducible: number;
  copago: number;
  moneda: string;
  tipo: string;
  marca: string;
  taller: string;
}
