import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Constants } from '../../../framework/util/utils';
import { UtilsGrid } from '../../../framework/util/utils-grid';
import { CrudService } from '../../../framework/services/crud.service';
import { Catalogo } from '../../../models/catalogo';
import { IOption } from 'ng-select';
import { ToastService } from '../../../framework/services/toast.service';
import { esLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from '../../../../../node_modules/ngx-bootstrap';
import { Novedad } from '../../../models/Novedad';


@Component({
  selector: 'app-novedad',
  templateUrl: './novedad.component.html',
  styleUrls: ['./novedad.component.css']
})
export class NovedadComponent implements OnInit {

  // form
  public form: FormGroup;
  // Listas
  public lstNovedad: Novedad[] = [];
  public lstCatNovedad: Catalogo[] = [];
  // Variables
  idContrato: any;
  public loading = false;
  // File
  selectedFile: File;

  // Entidades
  novedadObj: Novedad;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public crudService: CrudService,
    public toastService: ToastService,
    private _localeService: BsLocaleService,
  ) {

    defineLocale('es', esLocale);
    this._localeService.use('es');

    this.novedadObj = new Novedad();

  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.idContrato = params['id'];
      // console.log('id: ' + this.idContrato);
      this.cargarlistaNovedad(this.idContrato);


    });

    this.buildForm();
    this.getCatNovedad();

  }


  /**
  * @author Milton Sanchez
  */
  onFileSelected(event): void {
    this.selectedFile = <File>event.target.files[0];
    console.log('file => ' + event.target.files[0]);


  }

  /**
   * @author Milton Sanchez
   *
   * Metodo que permite agregar una novedad
   */
  addItemClick(): void {

    let existe = false;
    this.lstNovedad.forEach(item => {
      if (item.novedad === this.form.value.novedad) {
        this.toastService.showError('Información', 'El item ya se encuentra en la lista');
        existe = true;
      }
    });

    if (!existe) {
      // this.lstNovedad.push(this.form.value);
      // this.form.reset();
      this.loading = true;
      this.novedadObj.contrato = this.form.value.contrato;
      this.novedadObj.fecha = this.form.value.fecha;
      this.novedadObj.label = this.form.value.label;
      this.novedadObj.novedad = this.form.value.novedad;


      this.guardarNovedad(this.novedadObj);
      this.buildForm();

      this.novedadObj = new Novedad();


    }


  }


  /**
  * Metodo para cargar novedades
  */
  cargarlistaNovedad(idContrato): void {
    // console.log(' contra_ ' + idContrato);
    if (idContrato != null) {
      this.crudService.get(Constants.URL_NOVEDADES_BUSQUEDA + idContrato).then((data: any) => {
        this.lstNovedad = data;
        // console.log('data novedad:' + JSON.stringify(this.lstNovedad));
      }, error => {
        console.log(`No se pudo obtener la informacion de novedadaes: ${error}`);
      });
    }

  }

  /**
   * Metodo para guardar Novedad contrato
   */
  async guardarNovedad(parameter: Novedad) {

    // console.log('data: ' + JSON.stringify(this.form.value));
    try {
      const fd = new FormData();
      fd.append('file', this.selectedFile, this.selectedFile.name);

      const response = await this.crudService.uploadFile(fd); // Guardar el archivo
      // this.form.addControl('archivo', this.formBuilder.control(response.uploadname));
      parameter.archivo = response.uploadname;
    } catch (error) {
      console.warn('Error al guardar el archivo : ' + error);
    }
    this.crudService.create(Constants.URL_CONTRATO_GUARDAR + '/guardarNovedad/', parameter).then((data: any) => {
      console.log(data);
      this.toastService.showSuccess('Información', 'Item agregado correctamente');
      this.cargarlistaNovedad(this.idContrato);
      this.loading = false;
    }, error => {
      console.log(`No se pudo guardar novedad: ${error}`);
    });




  }

  /**
  * @author Milton Sanchez
  * Allow dowload file
  */
  dowload(file) {
    this.crudService.dowloadFile(file);
  }

  /**
  * Metodo que permite eliminar un elemento de la lista
  * @param item
  */
  removeRowClick(item) {
    if (item == null) { return; }
    UtilsGrid.removeRowClick(this.lstNovedad, item);
    if (item.id > 0) {
      this.deleteNovedad(item);
    }

  }

  /**
  * deleteNovedad
  * @param novedad
  */
  deleteNovedad(novedad: Novedad): void {
    this.crudService.post(Constants.URL_HOJADEVIDA_DELETE_NOVEDAD, novedad.id).then((data: any) => {
      this.toastService.showSuccess('Información', 'Registro eliminado correctamente');
    }, error => {
      console.log(`No se pudo borrar la informacion: ${error}`);
    });

  }

  /**
  *
  * @param $event
  */
  setNovedad($event: IOption) {
    // console.log($event);
    this.form.controls['label'].setValue($event.label);

  }

  /**
   * Formulario principal
   * @author Milton Sanchez
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      'contrato': [this.idContrato, [Validators.required]],
      'novedad': ['', [Validators.required]],
      'fecha': ['', [Validators.required]],
      'label': [''],
      'file': [null, Validators.required]
    });

  }

  /**
   * Metodo para cargar el catalogo de novedades
   * @author Milton Sanchez
   */
  getCatNovedad(): void {
    this.crudService.get(Constants.URL_CATALOGO + '/Novedad').then((data: any) => {
      this.lstCatNovedad = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de catalogos de novedades: ${error}`);
    });

  }



  // Getters and setters
  get contrato() { return this.form.get('contrato'); }
  get novedad() { return this.form.get('novedad'); }
  get fecha() { return this.form.get('fecha'); }
  get file() { return this.form.get('file'); }



}
