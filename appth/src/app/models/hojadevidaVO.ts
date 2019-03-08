import { Estudio } from './estudio';
import { Experiencia } from './experiencia';
import { SoporteVO } from './SoporteVO';

export class HojadevidaVO {
    id?: number;
    primernombre: string;
    segundonombre: string;
    primerapellido: string;
    segundoapellido: string;
    tipodocumento: number;
    estadocivil?: number;
    fechanacimiento: Date;
    telefonocasa: string;
    numerodocumento: string;
    genero: string;
    correoelectronico: string;
    telefonomovil: string;
    profesion?: number;
    listaEstudios?: Estudio[];
    listaExpLaboral?: Experiencia[];
    listaSoporte?: SoporteVO[];

}
