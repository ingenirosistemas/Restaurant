import { LoadingComponent } from './../../framework/controls/loading/loading.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CrudService } from '../../framework/services/crud.service';
import { Constants } from './../../framework/util/utils';
import { Router, ActivatedRoute } from '@angular/router';
import { Catalogo } from '../../models/catalogo';
import { BsModalRef, BsLocaleService } from 'ngx-bootstrap';
import { esLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ToastService } from '../../framework/services/toast.service';

@Component({
  selector: 'app-incapacidad',
  templateUrl: './incapacidad.component.html',
  styleUrls: ['./incapacidad.component.css'],
  styles: [
    `
      :host >>> .tooltip-inner {
        background-color: #d2d6de;
        color: #555;
      }
      :host >>> .tooltip.top .tooltip-arrow:before,
      :host >>> .tooltip.top .tooltip-arrow {
        border-top-color: #d2d6de;
      }
    `
  ]
})

export class IncapacidadComponent implements OnInit {

  lstIncapacidad: any[];
  public rowsOnPage = 5;
  public form: FormGroup;
  Loading: boolean;
  // catalogos para busqueda avanzada
  public datosTipoIncapacidad: Catalogo[] = [];
  public lstCie10: Catalogo[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private crudService: CrudService,
    private formBuilder: FormBuilder,
    private _localeService: BsLocaleService,
    public toastService: ToastService
  ) {
    this.lstIncapacidad = [];
    defineLocale('es', esLocale);
    this._localeService.use('es');
  }


  ngOnInit() {
    this.buildForm();
    this.getListaIncapacidad();
    this.loadCatalogos();
  }

  dowload(file) {
    this.crudService.dowloadFile(file);
  }

  limpiar(): void {
    if (this.form.touched) {
      this.form.reset();
      this.getListaIncapacidad();
    }

  }

  /********************************************/
  /*********Evento de botones*****************/
  /********************************************/
  editar(resultado: any): void {
    this.router.navigate(['/incapacidadnuevo', { id: resultado.id, opcion: 'editar', identificacion: resultado.identificacion }]);
  }

  crearProrroga(resultado: any): void {
    this.router.navigate(['/incapacidadnuevo', { id: resultado.id, opcion: 'prorroga', identificacion: resultado.identificacion }]);
  }

  nuevo() {
    this.router.navigate(['incapacidadnuevo', { opcion: 'nuevo' }]);
  }

  /**
   * @author Yeik Castillo
   * Formulario de busqueda
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      numerodocumento: ['', [Validators.pattern(Constants.CAMPO_NUMERICO)]],
      nombrecompleto: ['', [Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
      tipoincapacidad: [],
      cie10: [],
      fechainicio: []
    });
  }

  /**
   * @author Yeik Castillo
   * getListaIncapacidad
   */
  getListaIncapacidad(): void {
    this.crudService.post(Constants.URL_INCAPACIDAD_LISTA, this.form.value).then((data: any) => {
      this.lstIncapacidad = data;
      console.log(data);
    }, error => {
      console.log(`No se pudo obtener la informacion de las incapacidades: ${error}`);
    });

  }

  /**
   * @author Yeik Castillo
   * Metodo que permite buscar el contrato de un dinamizador
   */
  buscarIncapacidad(): void {
    this.crudService.post(Constants.URL_INCAPACIDAD_LISTA, this.form.value).then((data: any) => {
      if (data.length < 1) {
        this.toastService.showInfo('No se encontraron registros');
        this.lstIncapacidad = [];
      } else {
        // setTimeout(() => {
        //  this.Loading = false;
        this.lstIncapacidad = data;
        // }, 3000);
      }
    });

  }
  /**
    * @author Yeik Castillo
    * Metodo para la carga de catalogos
    */
  loadCatalogos(): void {
    this.getTipoIncapacidad();
    this.getC10();
  }
  /**
  * @author Yeik Castillo
  * Metodo coneccion con tipo de incapacidad
  */
  getTipoIncapacidad(): void {
    this.crudService.get(Constants.URL_CATALOGO + '/Tipoincapacidad').then((data: any) => {
      this.datosTipoIncapacidad = data;
      console.log(`data TipoIncapacidad: ${data[0].descripcion}`);
    }, error => {
      console.log(`No se pudo obtener la informacion de TipoIncapacidad: ${error}`);
    });
  }

  /**
  * @author Yeik Castillo
  * Metodo de coneccion con catalogo C10
  */
  getC10(): void {
    this.crudService.get(Constants.URL_CATALOGO + '/Cie10').then((data: any) => {
      this.lstCie10 = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de Cie10: ${error}`);
    });


  }

  // Getter and setter from form
  get numerodocumento() { return this.form.get('numerodocumento'); }
  get nombrecompleto() { return this.form.get('nombrecompleto'); }
  get tipoincapacidad() { return this.form.get('tipoincapacidad'); }
  get cie10() { return this.form.get('cie10'); }
  get fechainicio() { return this.form.get('fechainicio'); }

}
