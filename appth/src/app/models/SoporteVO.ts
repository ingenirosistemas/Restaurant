

export class SoporteVO {
    id?: number;
    nombre: string;
    tamanio?: string;
    tipo?: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}
