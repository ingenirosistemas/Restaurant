import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../framework/services/login.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  public user: Usuario;

  constructor(public loginService: LoginService) {

    this.user = new Usuario(null, null, null, null, null, null);

  }

  ngOnInit() {

    if (localStorage.getItem('user')) {
      const data = JSON.parse(localStorage.getItem('user'));
      this.user.primernombre = data.primernombre;
      this.user.primerapellido = data.primerapellido;
      this.user.login = data.login;

    }

  }

  cerrarSesion() {
    this.loginService.cerrarSesion();
  }

}
