import { Constants } from '../../../framework/util/utils';
import { NovedadesGestantes } from './../../../models/NovedadesGestantes';
import { UtilsGrid } from './../../../framework/util/utils-grid';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { esLocale } from 'ngx-bootstrap/locale';
import { IOption } from 'ng-select';
import { CrudService } from '../../../framework/services/crud.service';
import { Catalogo } from '../../../models/catalogo';
import { ToastService } from '../../../framework/services/toast.service';
import { BsLocaleService } from '../../../../../node_modules/ngx-bootstrap';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ActivatedRoute, Params, Router } from '@angular/router';


@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.css']
})
export class NovedadesComponent implements OnInit {
  // form
  public form: FormGroup;
  // lista
  public lstNovedades: NovedadesGestantes[] = [];
  public lstCatNovedad: Catalogo[] = [];
  // Variables
  idEmbarazo: any;
  public loading = false;
  // File
  selectedFile: File;
  // Entidades
  novedadObj: NovedadesGestantes;

  constructor(
    private route: ActivatedRoute,
    public crudService: CrudService,
    private formBuilder: FormBuilder,
    private _localeService: BsLocaleService,
    public toastService: ToastService,
  ) {
    defineLocale('es', esLocale);
    this._localeService.use('es');

    this.novedadObj = new NovedadesGestantes();
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.idEmbarazo = params['id'];
      this.cargarlistaNovedad(this.idEmbarazo);
    });
    this.buildForm();
    this.getCatNovedad();
  }

  /**
  * @author Angie Lopez
  */
  onFileSelected(event): void {
    this.selectedFile = <File>event.target.files[0];
    console.log('file => ' + event.target.files[0]);


  }

  /**
   * @author Angie Lopez
   *
   * Metodo que permite agregar una novedad
   */
  addItemClick(): void {

    let existe = false;
    this.lstNovedades.forEach(item => {
      if (item.novedad === this.form.value.novedad) {
        this.toastService.showError('Información', 'El item ya se encuentra en la lista');
        existe = true;
      }
    });

    if (!existe) {

      this.novedadObj.embarazoactual = this.form.value.embarazoactual;
      this.novedadObj.fecha = this.form.value.fecha;
      this.novedadObj.label = this.form.value.label;
      this.novedadObj.novedad = this.form.value.novedad;


      this.guardarNovedad(this.novedadObj);
      this.buildForm();

      this.novedadObj = new NovedadesGestantes();


    }


  }




/**
* Metodo para cargar novedades
*/
  cargarlistaNovedad(idEmbarazo): void {
    // console.log(' contra_ ' + idContrato);
    if (idEmbarazo != null) {
      this.crudService.get(Constants.URL_NOVEDADES_BUSQUEDA_EMBARAZO + idEmbarazo).then((data: any) => {
        this.lstNovedades = data;
        console.log('data novedad:' + JSON.stringify(this.lstNovedades));
      }, error => {
        console.log(`No se pudo obtener la informacion de novedadaes: ${error}`);
      });
    }

  }



  /**
   * Metodo para guardar Novedad contrato
   */
  async guardarNovedad(parameter: NovedadesGestantes) {

    // console.log('data: ' + JSON.stringify(this.form.value));
    const fd = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);

    const response = await this.crudService.uploadFile(fd); // Guardar el archivo

    // this.form.addControl('archivo', this.formBuilder.control(response.uploadname));
    parameter.archivo = response.uploadname;

    this.crudService.create(Constants.URL_EMBARAZO_ACTUAL + '/guardarNovedad/', parameter).then((data: any) => {
      console.log(data);
      this.toastService.showSuccess('Información', 'Item agregado correctamente');
      this.cargarlistaNovedad(this.idEmbarazo);
    }, error => {
      console.log(`No se pudo guardar novedad: ${error}`);
    });
  }

  /**
  * @author Angie Lopez
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
    UtilsGrid.removeRowClick(this.lstNovedades, item);
    if (item.id > 0) {
      this.deleteNovedad(item);
    }

  }

  /**
  * deleteNovedad
  * @param novedad
  */
  deleteNovedad(novedad: NovedadesGestantes): void {
    this.crudService.post(Constants.URL_DINAMIZADORA_DELETE_NOVEDAD, novedad.id).then((data: any) => {
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
      'embarazoactual': [this.idEmbarazo, [Validators.required]],
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
  get embarazoactual() { return this.form.get('embarazoactual'); }
  get novedad() { return this.form.get('novedad'); }
  get fecha() { return this.form.get('fecha'); }
  get file() { return this.form.get('file'); }

}
