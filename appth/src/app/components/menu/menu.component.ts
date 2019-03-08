import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public user: Usuario;

  constructor() {

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

}
