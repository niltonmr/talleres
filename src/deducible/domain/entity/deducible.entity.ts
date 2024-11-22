export class Deducible {
  esParaTalleres: string;
  deducible: number;
  copago: number;
  moneda: string;
  tipo: string;
  marca: string;
  taller: string;
  constructor() {}

  static async getFromText(deducibleText: string): Promise<Array<Deducible>> {
    const lineas = Deducible._dividirTextoEnLineas(deducibleText);

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
    }

    console.log(''.padEnd(50, '='));
    console.log(deducibles);

    const uniqueDeducibles = Array.from(
      new Set(deducibles.filter(d => d.esParaTalleres === 'SI' && d.deducible > 0).map(d => JSON.stringify(d)))
    ).map(str => JSON.parse(str));
    console.log(''.padEnd(50, '-'));

    console.log(uniqueDeducibles);

    return uniqueDeducibles;
  }
  static _dividirTextoEnLineas(text: string): string[] {
    return text.split('\n');
  }

  static async _obtenerParametrizacion(text: string, contexto: Deducible): Promise<Deducible> {
    let deducible: Deducible;
    let esParaTalleres = this._esParaTalleres(text);
    let moneda = this._obtenerMoneda(text);

    deducible = new Deducible();

    deducible.esParaTalleres = (esParaTalleres === 'DUDA' ? contexto.esParaTalleres : esParaTalleres).toUpperCase();
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

  static _obtenerPorcentaje(text: string): number {
    const regex = /(\d+(\.\d{1,2})?)%/;
    const match = text.match(regex);
    if (match) {
      return parseFloat(match[1]);
    }
    return 0;
  }

  static _obtenerCopago(text: string): number {
    const regex = /m[íi]nimo(?: de)? (?:US\$ ?|S\/\. ?)?(\d+(\.\d{2})?)/i;
    const match = text.match(regex);
    if (match) {
      return parseFloat(match[1]);
    }
    return 0;
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
    return '';
  }

  static _obtenerTipo(text: string): string {
    const regex = /multimarca/i;
    const match = text.match(regex);
    if (match) {
      return 'Multimarca';
    }
    return 'NO TIPO';
  }

  static _obtenerMarca(text: string): string {
    const regex = /marca\s+([^:]+):/i;
    const match = text.match(regex);
    if (match) {
      return match[1].trim().toUpperCase();
    }
    return 'NO MARCA';
  }

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
    return 'NO TALLER';
  }
}
