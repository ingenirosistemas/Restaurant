import { Component, OnInit } from '@angular/core';
import { UrlUtils } from '../../framework/util/utils-url';
import { LoginService } from '../../framework/services/login.service';
import { CarouselConfig } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 3000, noPause: true, showIndicators: true } }
  ]
})
export class LoginComponent implements OnInit {

  constructor(
    public loginService: LoginService

  ) { }

  ngOnInit() {

    const idUser = UrlUtils.getParam('param');
    console.log('user => ' + idUser);

    if (!sessionStorage.getItem('access_token') && idUser > 0) {
      this.loginService.login(+idUser).subscribe(data => {
        const token = JSON.stringify(data.token);
        sessionStorage.setItem('access_token', token);
        localStorage.setItem('user', JSON.stringify(data));
        console.log('token: ' + token);
        window.location.reload();
      });

    }

  }

}
