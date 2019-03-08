import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilsGrid } from '../../../framework/util/utils-grid';
import { ToastService } from '../../../framework/services/toast.service';

@Component({
  selector: 'app-soporte-carga',
  templateUrl: './soporte-carga.component.html',
  styleUrls: ['./soporte-carga.component.css']
})
export class SoporteCargaComponent implements OnInit {

  @Output() fileSeleccionado: EventEmitter<File[]> = new EventEmitter<File[]>();

  public lstFiles: File[] = [];


  constructor(public toastService: ToastService) { }

  ngOnInit() {
  }

  /**
   * @author Milton Sanchez
   */
  onFileSelected(event): void {
    const archivosLista: FileList = event.target.files;
    // tslint:disable-next-line:forin
    for (const propiedad in Object.getOwnPropertyNames(archivosLista)) {
      const archivoTemporal = archivosLista[propiedad];

      if (this._archivoYaFueCargado(archivoTemporal.name)) {
        this.toastService.showWarning('Información', 'El archivo ' + archivoTemporal.name + ' ya esta agregado');
      } else {
        this.lstFiles.push(archivoTemporal);
      }

    }
    this.fileSeleccionado.emit(this.lstFiles);

    // this.toastService.showSuccess('Información', 'Archivo cargado correctamente.');


  }

  /**
   * @author Milton Sanchez
   */
  resetListFiles(): void {
    this.lstFiles = [];
  }


  /**
   * @author Milton Sanchez
   * Metodo que permite eliminar un elemento de la lista
   * @param item
   */
  removeRowClick(item) {
    if (item == null) { return; }
    UtilsGrid.removeRowClick(this.lstFiles, item);
    this.fileSeleccionado.emit(this.lstFiles);
    this.toastService.showSuccess('Información', 'Archivo eliminado correctamente.');

  }

  /**
   * @author Milton Sanchez
   * Verifica si el archivo ya esta cargado
   * @param nombreArchivo
   */
  private _archivoYaFueCargado(nombreArchivo: string): boolean {

    for (const archivo of this.lstFiles) {

      if (archivo.name === nombreArchivo) {
        console.log('El archivo ' + nombreArchivo + ' ya esta agregado.');
        return true;
      }

    }

    return false;
  }

}
