import { Injectable } from '@angular/core';
import { FileItem } from '../../models/file-item';

@Injectable()
export class CargaFilesService {

  public CARPETA_ARCHIVOS = 'uploads';

  constructor() { }


  cargarFiles(files: FileItem[]) {

    console.log(files);

  }


}
