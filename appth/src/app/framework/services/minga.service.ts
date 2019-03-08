import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable()
export class MingaService {


    constructor(private http: HttpClient) { }

    /**
     * @author Milton Sanchez <milton.sanchez7@gmail.com>
     * @description Permite obtener el curriculum de una persona por medio de su identificacion
     * @param identificacion
     */
    getCurriculumXIdentificacion(identificacion: string) {

      return this.http.get(`${ environment.HOST_MINGA_TEJER }api/curriculum/CurriculumXIdentificacion?identificacion=${ identificacion }`);

    }

}
