import { Catalogo } from './../../models/catalogo';
import { Component, OnInit, TemplateRef } from '@angular/core'; // agregeue el templateref
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CrudService } from '../../framework/services/crud.service';
import { Constants } from '../../framework/util/utils';
import { Router } from '@angular/router';
import { ToastService } from '../../framework/services/toast.service';
import { UtilsGrid } from '../../framework/util/utils-grid';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-permiso',
  templateUrl: './permiso.component.html',
  styleUrls: ['./permiso.component.css']
})
export class PermisoComponent implements OnInit {

  public form: FormGroup;
  public rowsOnPage = 5;
  public flagForm: boolean;
  loading: boolean;
  edItem: Event;
  liderproceso: true;
  coordinadorarea: false; // var autorizaciones
  cordinadorpolitico: boolean; // var autorizaciones
  talentohumano: boolean; // var autorizaciones
  template: boolean;
  checkModel: boolean;
  checkModel1: boolean;
  checkModel2: boolean;

  datosTipoPermiso: Catalogo[] = [];

  lstPermiso: any[] = [];
  modalRef: BsModalRef; // variable modal



  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private crudService: CrudService,
    public toastService: ToastService,
    private modalService: BsModalService       // cons para el modal
  ) {

    this.loading = true;

  }

  ngOnInit() {
    this.buildForm();
    this.getListaPermiso();
    // this.loadCatalogos();
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      numerodocumento: ['', [Validators.pattern(Constants.CAMPO_NUMERICO)]],
      nombrecompleto: ['', [Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
    });
  }
  // caragar  modal
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }



  onChange($event) {
    this.checkModel = $event.target.checked;
    

    console.log($event.target.checked);
  }





  getListaPermiso(): void {
    console.log(Constants.URL_PERMISO_LISTA, '/' + this.form.value);
    this.crudService.post(Constants.URL_PERMISO_LISTA, this.form.value).then((data: any) => {

      setTimeout(() => {
        this.loading = false;
        this.lstPermiso = data;
      }, 200);


      console.log(data);
    }, error => {
      console.log(`No se pudo obtener la informacion de los Permisos: ${error}`);
    });

  }

  buscarPermiso() {
    this.loading = true;
    this.crudService.post(Constants.URL_PERMISO_LISTA, this.form.value).then((data: any) => {
      if (data.length < 1) {
        this.toastService.showInfo('No se encontraron registros');
        this.lstPermiso = [];
        this.loading = false;
      } else {
        setTimeout(() => {
          this.loading = false;
          this.lstPermiso = data;
        }, 3000);
      }
    });

  }


  /**
    * Metodo que permite eliminar un elemento de la lista
    * @param item
    */
  removeRowPermisoClick(item) {
    if (item == null) { return; }
    UtilsGrid.removeRowClick(this.lstPermiso, item);
    this.deletePermiso(item.id);

  }

  /**
   * Metodo que permite eliminar un permiso
   *
   * @param id
   */
  deletePermiso(id: number): void {
    this.crudService.post(Constants.URL_PERMISO_DELETE, id).then((data: any) => {
      this.toastService.showSuccess('Información', 'Registro eliminado correctamente');
    }, error => {
      console.log(`No se pudo borrar la informacion: ${error}`);
    });

  }

  /**
   * Metodo para cargar el catalog de tipo permiso
   * @author
   */
  nuevo(): void {
    this.router.navigate(['permisoedicion']);
  }

  /**
   * @author
   */
  loadCatalogos(): void {
    this.getTipoPermiso();
  }

  /**
   * @author
   */
  getTipoPermiso(): void {
    this.crudService.get(Constants.URL_CATALOGO + '/Tipopermiso').then((data: any) => {
      this.datosTipoPermiso = data;
      console.log(`data TipoPermiso: ${data[0].descripcion}`);
    }, error => {
      console.log(`No se pudo obtener la informacion de TipoPermiso: ${error}`);
    });
  }
  get numerodocumento() { return this.form.get('numerodocumento'); }
  get nombrecompleto() { return this.form.get('nombrecompleto'); }
  get idcontrato() { return this.form.get('idContrato'); }
}
