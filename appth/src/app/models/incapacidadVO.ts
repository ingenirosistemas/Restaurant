


export class IncapacidadVO {
    id?: number;
    tipoincapacidad: number;
    contrato: number;
    cie: number;
    fechainicio: Date;
    fechafin: Date;
    diaautorizado: number;
    diasolicitado: number;
    fechaincidente: Date;
    prorroga?: number;
    opcion: string;
    incapacidadpadre: number;
    archivo?: string;
}

