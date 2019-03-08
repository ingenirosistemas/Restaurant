import { environment } from './../../../environments/environment';
import { UrlUtils } from './../util/utils-url';
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

/**
 * @author Milton Sanchez
 */
@Injectable()
export class LoginGuard implements CanActivate {

    constructor() {

    }

    /**
     * @author Milton Sanchez
     */
    canActivate() {
        const access_token = sessionStorage.getItem('access_token') ? JSON.parse(sessionStorage.getItem('access_token')) : '';
        const helper = new JwtHelperService();

        if (helper.isTokenExpired(access_token)) {
            sessionStorage.clear();
            localStorage.clear();
            console.log('token expired');
            UrlUtils.navigateURL(environment.HOST_SUIIN);
            return false;

        } else {
            return true;


        }

    }
}
