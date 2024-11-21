// interface DeducibleInterface {
//   idPedido: number;
//   cupon: Cupon;
//   bono: Bono;
//   producto: Producto;
//   pago: Pago;
//   usuOperacion: string;
//   usuario: DatosUsuarioRequest;
// }
export class Deducible {
  esParaTalleres: string;
  deducible: number;
  copago: number;
  moneda: string;
  tipo: string;
  marca: string;
  taller: string;
  constructor() {} // taller: string} // marca: string, // tipo: string, // moneda: string, // copago: number, // deducible: number, // esParaTalleres: string, // {

  static async getFromText(deducibleText: string): Promise<Array<Deducible>> {
    // const instance = new Deducible();
    const lineas = Deducible._dividirTextoEnLineas(deducibleText);

    // const deducibles = await Promise.all(
    //   lineas.map(async linea => {
    //     let deducible = new Deducible();
    //     deducible = await deducible._obtenerParametrizacion(linea);
    //     return deducible;
    //   })
    // );
    let contexto = <Deducible>{
      esParaTalleres: 'NO',
      deducible: 0,
      copago: 0,
      moneda: '',
      tipo: 'NO TIPO',
      marca: 'NO MARCA',
      taller: 'NO TALLER'
    };

    const deducibles = [];
    for (let i = 0; i < lineas.length; i++) {
      let deducible = await Deducible._obtenerParametrizacion(lineas[i], contexto);
      contexto = deducible;
      deducibles.push(deducible);

      // lineas.map(async linea => {
      //   // let deducible = new Deducible();
      //   deducible = await Deducible._obtenerParametrizacion(linea);
      //   return deducible;
      // });
    }

    console.log(''.padEnd(50, '='));
    console.log(deducibles);

    // Actualizar los elementos con esParaTalleres = 'DUDA'
    for (let i = 0; i < deducibles.length; i++) {
      if (deducibles[i].esParaTalleres === 'DUDA') {
        if (i === 0) {
          deducibles[i].esParaTalleres = 'NO';
        } else {
          deducibles[i].esParaTalleres = deducibles[i - 1].esParaTalleres;
        }
      }
    }
    console.log(''.padEnd(50, '='));
    console.log(deducibles);
    // let deducible = new Deducible();
    // deducible.deducible = deducible._obtenerDeducible(deducibleText);
    // const uniqueDeducibles = Array.from(new Set(deducibles.map(d => JSON.stringify(d)))).map(str => JSON.parse(str));
    const uniqueDeducibles = Array.from(
      new Set(deducibles.filter(d => d.esParaTalleres === 'SI' && d.deducible > 0).map(d => JSON.stringify(d)))
    ).map(str => JSON.parse(str));
    console.log(''.padEnd(50, '-'));

    console.log(uniqueDeducibles);

    return Promise.resolve(uniqueDeducibles);
  }
  static _dividirTextoEnLineas(text: string): string[] {
    return text.split('\n');
  }

  static async _obtenerParametrizacion(text: string, contexto: Deducible): Promise<Deducible> {
    let deducible: Deducible;
    let esParaTalleres = this._esParaTalleres(text);
    let moneda = this._obtenerMoneda(text);
    // if (esParaTalleres === 'DUDA') {
    //   deducible = JSON.parse(JSON.stringify(contexto));
    // } else {
    //   deducible = new Deducible();
    // }

    deducible = new Deducible();

    deducible.esParaTalleres = esParaTalleres;
    deducible.deducible = this._obtenerPorcentaje(text);
    deducible.copago = this._obtenerCopago(text);
    deducible.moneda = !!moneda ? moneda : contexto.moneda;
    deducible.tipo = this._obtenerTipo(text);
    deducible.marca = this._obtenerMarca(text);
    deducible.taller = this._obtenerTaller(text);
    return deducible;
  }

  static _esParaTalleres(text: string): string {
    const incluyeTaller = /taller(?:es)?/i.test(text);
    const excluyeTaller =
      /robo|p[ée]rdida total|incendio|v[íi]as no autorizadas|daños por hueco|daños por despiste|[Vv]olcaduras|[Ii]mprudencia/i.test(
        text
      );

    if (incluyeTaller) {
      return 'SI';
    } else if (excluyeTaller) {
      return 'NO';
    } else {
      return 'DUDA';
    }
  }

  // static _obtenerPorcentaje(text: string): number {
  //   const regex = /(\d+)%/;
  //   const match = text.match(regex);
  //   if (match) {
  //     return parseInt(match[1], 10);
  //   }
  //   return 0; // Valor predeterminado si no se encuentra un porcentaje
  // }

  static _obtenerPorcentaje(text: string): number {
    const regex = /(\d+(\.\d{1,2})?)%/;
    const match = text.match(regex);
    if (match) {
      return parseFloat(match[1]);
    }
    return 0; // Valor predeterminado si no se encuentra un porcentaje
  }

  // static _obtenerCopago(text: string): number {
  //   // const regex = /mínimo (?:US\$)?(\d+(\.\d{2})?)/;
  //   const regex = /m[íi]nimo (?:US\$ ?)?(\d+(\.\d{2})?)/;
  //   const match = text.match(regex);
  //   if (match) {
  //     return parseFloat(match[1]);
  //   }
  //   return 0; // Valor predeterminado si no se encuentra un copago
  // }

  // static _obtenerCopago(text: string): number {
  //   const regex = /m[íi]nimo(?: de)? (?:US\$ ?)?(\d+(\.\d{2})?)/i;
  //   const match = text.match(regex);
  //   if (match) {
  //     return parseFloat(match[1]);
  //   }
  //   return 0; // Valor predeterminado si no se encuentra un copago
  // }

  static _obtenerCopago(text: string): number {
    const regex = /m[íi]nimo(?: de)? (?:US\$ ?|S\/\. ?)?(\d+(\.\d{2})?)/i;
    const match = text.match(regex);
    if (match) {
      return parseFloat(match[1]);
    }
    return 0; // Valor predeterminado si no se encuentra un copago
  }

  static _obtenerMoneda(text: string): string {
    const regex = /(S\/\.|US\$)/;
    const match = text.match(regex);
    if (match) {
      if (match[1] === 'S/.') {
        return 'PEN';
      } else if (match[1] === 'US$') {
        return 'USD';
      }
    }
    return ''; // Valor predeterminado si no se encuentra una moneda
  }

  static _obtenerTipo(text: string): string {
    const regex = /multimarca/i;
    const match = text.match(regex);
    if (match) {
      return 'Multimarca';
    }
    return 'NO TIPO'; // Valor predeterminado si no se encuentra el tipo
  }

  // static _obtenerMarca(text: string): string {
  //   const regex = /marca\s*:\s*([^\n]+)/i;
  //   const match = text.match(regex);
  //   if (match) {
  //     return match[1].trim().toUpperCase();
  //   }
  //   return 'NO MARCA'; // Valor predeterminado si no se encuentra la marca
  // }

  static _obtenerMarca(text: string): string {
    const regex = /marca\s+([^:]+):/i;
    const match = text.match(regex);
    if (match) {
      return match[1].trim().toUpperCase();
    }
    return 'NO MARCA'; // Valor predeterminado si no se encuentra la marca
  }

  // static _obtenerTaller(text: string): string {
  //   const regex = /[Tt]aller(?:es)?\s*:\s*([^.,\n]+)/i;
  //   const match = text.match(regex);
  //   if (match) {
  //     return match[1].trim().toUpperCase();
  //   }
  //   return 'NO TALLER'; // Valor predeterminado si no se encuentra el taller
  // }

  static _obtenerTaller(text: string): string {
    const regex = /[Tt]aller(?:es)?\s+([^.,\n]+)/i;
    const match = text.match(regex);
    if (match) {
      const talleres = match[1].trim();
      if (
        !talleres ||
        talleres.toLowerCase().includes('afiliados') ||
        talleres.toLowerCase().includes('preferenciales')
      ) {
        return 'NO TALLER';
      }
      return talleres;
    }
    return 'NO TALLER'; // Valor predeterminado si no se encuentra el taller
  }
}
