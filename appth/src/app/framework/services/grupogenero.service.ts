import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../util/utils';

@Injectable()
export class GrupoGeneroService {

    constructor(private http: HttpClient) { }

    getGruposGenero() {

        return this.http.get<GrupoGenero[]>(Constants.URL_GRUPO_GENERO, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });

    }

}
