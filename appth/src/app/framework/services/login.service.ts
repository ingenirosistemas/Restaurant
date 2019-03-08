import { Usuario } from './../../models/usuario';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../util/utils';
import { UrlUtils } from '../util/utils-url';
import { environment } from '../../../environments/environment';


@Injectable()
export class LoginService {

    constructor(private http: HttpClient) {
    }


    login(idUser: number) {
        return this.http.post<Usuario>(Constants.URL_USER, idUser);
    }

    estaLogeado() {
        const token = sessionStorage.getItem('access_token');
        return token != null ? 1 : 0;
    }

    cerrarSesion() {
        sessionStorage.clear();
        localStorage.clear();
        UrlUtils.navigateURL(environment.HOST_SUIIN);
    }


}
