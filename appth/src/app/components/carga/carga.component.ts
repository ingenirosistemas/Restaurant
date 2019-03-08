import { Component, OnInit } from '@angular/core';
import { FileItem } from '../../models/file-item';
import { CargaFilesService } from './../../framework/services/carga-files.service';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.css']
})
export class CargaComponent implements OnInit {

  estaSobreElemento = false;
  archivos: FileItem[] = [];

  constructor(public _cargaFiles: CargaFilesService) { }

  ngOnInit() {
    console.log(this.archivos);
  }

  cargarFiles() {
    this._cargaFiles.cargarFiles(this.archivos);
  }

  limpiarArchivos() {
    this.archivos = [];
  }



}
