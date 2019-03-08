

export class Experiencia {
    id?: number;
    entidad: number;
    cargo: number;
    fechainicio: Date;
    fechafin: Date;
    desentidad?: string;
    desccargo?: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
