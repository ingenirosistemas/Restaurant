import { Constants } from '../../../framework/util/utils';
import { Catalogo } from '../../../models/catalogo';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../../framework/services/crud.service';
import { ToastService } from '../../../framework/services/toast.service';
import { Categoria } from '../../../framework/enums/aic-enum';
import { BsLocaleService } from '../../../../../node_modules/ngx-bootstrap';
import { esLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { PermisoTemporalVO } from '../../../models/permisotemporalVO';
import { PermisoDesplazamientoVO } from './../../../models/permisodesplazamientoVO';

@Component({
  selector: 'app-permiso-edicion',
  templateUrl: './permiso-edicion.component.html',
  styleUrls: ['./permiso-edicion.component.css']
})
export class PermisoEdicionComponent implements OnInit {
  // forms
  public form: FormGroup;
  public formTemporal: FormGroup;
  public formDesplazamiento: FormGroup;
  // objetos
  public permisoTemporalVO: PermisoTemporalVO;
  public permisoDesplazamientoVO: PermisoDesplazamientoVO;

  // listas
  public listTipoPermiso: Catalogo[] = [];
  public listPermiso: Catalogo[] = [];
  public listCiudadOrigen: Catalogo[] = [];
  public listCiudadDestino: Catalogo[] = [];
  public listCategoria: Catalogo[] = [];
  public listDeptoOrigen: Catalogo[];
  public listDeptoDestino: Catalogo[];
  public listMpioOrigen: Catalogo[];
  public listMpioDestino: Catalogo[];
  public listConfMpioDestino: Catalogo[];

  // variables
  public flat: boolean;
  public flagForm;
  minTimeHoaraFin: Date = new Date(); // Fija la hora minima de la hora fin
  horaInicio: Date = new Date(); // Fija la hora inicial del sistema
  fechaIni: Date = new Date(); // fija fecha inicial del sistema
  minDate: Date = new Date();
  maxDate: Date = new Date();
  fechaInicio: Date = new Date(); // fija fecha inicial del sistema
  minFechaFin: Date = new Date();



  constructor(
    private formBuilder: FormBuilder,
    private crudService: CrudService,
    private router: Router,
    public toastService: ToastService,
    private _localeService: BsLocaleService // Para el idioma de los calendarios
  ) {

    this.init();
    // Define el idioma de los catalogos en español
    defineLocale('es', esLocale);
    this._localeService.use('es');


  }

  /**
   * ngOnInit() Metodo para inicializar el componente
   */
  ngOnInit() {
    console.log('Init permisos');
    this.buildForm();
    this.buildFormTemporal();
    this.buildFormDesplazamiento();
    this.loadCatalogos();


  }

  /**
   * Metodo que permite fijar el minimo de la hora fin
   */
  changedHoraInicio(): void {
    try {
      console.log('Time changed to: ' + this.horaInicio);
      const d = new Date();
      d.setHours(this.horaInicio.getHours());
      d.setMinutes(this.horaInicio.getMinutes());
      this.minTimeHoaraFin = d;
    } catch (error) { }
    // console.log('horaInicio: ');
    /*if (this.horaInicio = this.minTimeHoaraFin) {
     console.log('error: ');
       }*/
    if (this.horaInicio === this.minTimeHoaraFin) {

      this.toastService.showInfo('feha debe ser mayor');

    } else {

      console.log('horafin ');
      // this.settearPermiso(data);

    }



  }

  /**
     * Metodo que permite fijar la fecha para un desplazamiento
     */

  changedFechainicio(): void {
    console.log('Time changed to: ' + this.fechaInicio);
    const d = new Date();
    d.setDate(this.fechaInicio.getDay());
    //  d.setMonth(this.fechaInicio.getMonth());
    this.minFechaFin = d;
  }


  /**
   * Metodo que permite fijar la fechan
   *
   */

  // changedFechaInicio(): void {
  // console.log('Time changed to: ' + this.fechaIni);
  // const bsvalue = new Date();

  // }
  /**
     * Metodo que permite fijar una fecha minima
     */

  changedFechaInicio(): void {
    console.log('Time changed to: ' + this.fechaInicio);
    const d = new Date();
    d.setDate(this.fechaInicio.getDay());
    this.minFechaFin = d;

  }




  /**
   * Inicializa propiedades del componente
   */
  init(): void {
    this.permisoTemporalVO = new PermisoTemporalVO();
    this.permisoDesplazamientoVO = new PermisoDesplazamientoVO();
    this.flagForm = true;
    this.listDeptoOrigen = [];
    this.listDeptoDestino = [];
    this.listMpioOrigen = [];
    this.listMpioDestino = [];
    this.listConfMpioDestino = [];

  }


  /**
  * Metodo que se ejecuta cuando se selecciona el municipio de destino,
  * seguidamente carga la configuracion de valores para el mismo
  * @param event
  */
  public selectedConfMunDestino(event: any): void {
    this.getConfMpioDestino(event.value);

  }


  /**
   * Metodo que se ejecuta cuando se selecciona el departamento destino,
   * seguidamente carga los municipios
   * @param event
   */
  public selectedDeptoDestino(event: any): void {
    this.getMpioDestino(event.value);

  }

  /**
   * Metodo que se ejecuta cuando se selecciona el departamento origen,
   * seguidamente carga los municipios
   * @param event
   */
  public selectedDeptoOrigen(event: any): void {
    console.log('Selected departamento origen value is: ', event);

    this.getMpioOrigen(event.value);
    // console.log(event.value); mostrar el municipi origen************
  }

  /**
   * Metodo que se ejecuta cuando selecciona la categoria
   * @param event
   */
  public selected(event: any): void {
    console.log('Selected value is: ', event);

    if (event.value === Categoria.Desplazamiento) {
      console.log('Es categoria');
      this.flagForm = false;
    } else {
      this.flagForm = true;
    }

    this.getTipoPermiso(event.value);

  }

  cancelar(): void {
    this.router.navigate(['permiso']);

  }

  /**
   * Metodo que carga los catalogos
   */
  loadCatalogos(): void {

    this.getCategoria();
    this.getDepto();


  }

  /**
* Metodo para cargar la configuracion por municipio
*/
  getConfMpioDestino(id: number): void {
    this.crudService.get(Constants.URL_CATALOGO_GET_CONF_BY_MUNICIPIO + id).then((data: any) => {
      this.listConfMpioDestino = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de los municipios: ${error}`);
    });

  }




  /**
   * Metodo para cargar los departamentos
   */
  getDepto(): void {

    this.crudService.get(Constants.URL_CATALOGO + '/Departamento').then((data: any) => {
      this.listDeptoOrigen = data;
      this.listDeptoDestino = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de departamentos origen: ${error}`);
    });


  }


  /**
 * Metodo para cargar los municipios por departamento
 */
  getMpioDestino(id: number): void {
    this.crudService.get(Constants.URL_CATALOGO_GET_MUNICIPIO_BY_DEPARTAMENTO + id).then((data: any) => {
      this.listMpioDestino = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de los municipios: ${error}`);
    });

  }

  /**
  * Metodo para cargar los municipios por departamento
  */
  getMpioOrigen(id: number): void {
    this.crudService.get(Constants.URL_CATALOGO_GET_MUNICIPIO_BY_DEPARTAMENTO + id).then((data: any) => {
      this.listMpioOrigen = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de los municipios: ${error}`);
    });

  }

  /**
   * Metodo para cargar los tipos de permiso
   */
  getTipoPermiso(id: number): void {
    this.crudService.get(Constants.URL_CATALOGO_TIPO_PERMISO + id).then((data: any) => {
      this.listTipoPermiso = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de tipo cargo: ${error}`);
    });

  }


  /**
  * Metodo para cargar el catalog de categorias
  * @author
  */
  getCategoria(): void {
    this.crudService.get(Constants.URL_CATALOGO + '/Categoria').then((data: any) => {
      this.listCategoria = data;
      console.log('data: ' + JSON.stringify(data));
    }, error => {
      console.log(`No se pudo obtener la informacion de categorias: ${error}`);
    });

  }


  // formulario principal
  buildForm(): void {
    this.form = this.formBuilder.group({
      identificacion: ['', [Validators.required]],
      tipodocumento: ['', [Validators.required]],
      primernombre: ['', [Validators.required, Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
      segundonombre: ['', [Validators.required]],
      primerapellido: ['', [Validators.required, Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
      segundoapellido: ['', [Validators.required, Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
      cargo: ['', [Validators.required]],
      area: ['', [Validators.required]],
      numerodocumento: ['', [Validators.required]],
      tipocategoria: ['', [Validators.required]],
      tipopermiso: ['', [Validators.required]],
      contrato: ['', [Validators.required]],
    });
  }
  // subformularios


  buildFormTemporal(): void {
    this.formTemporal = this.formBuilder.group({
      fecha: ['', [Validators.required]],
      horainicio: ['', [Validators.required]],
      horafin: ['', [Validators.required]],
      objetivo: ['', [Validators.required]],
    });

  }

  /**
   * Formulario desplazamiento
   */
  buildFormDesplazamiento(): void {
    this.formDesplazamiento = this.formBuilder.group({
      fechasolicitud: ['', [Validators.required]],
      fecharegreso: ['', [Validators.required]],
      deptoorigen: ['', [Validators.required]],
      deptodestino: ['', [Validators.required]],
      ciudadorigen: ['', [Validators.required]],
      ciudaddestino: ['', [Validators.required]],
      confmpiodestino: ['', [Validators.required]],
      objetivodes: ['', [Validators.required]]
    });
  }


  // Metodo para buscar registros de la tabla contrato
  buscaPermiso(): void {
    console.log('identificación', this.form.value.identificacion);
    this.crudService.get(Constants.URL_GETCONTRATACIONBUSQUEDA + this.form.value.identificacion).then((data: any) => {

      if (data === null) {

        this.toastService.showInfo('No se encontraron registros');

      } else {

        console.log('contrato: ', data);
        this.settearPermiso(data);

      }



    }, error => {
      this.form.controls['identificacion'].setValue('');
      this.form.reset();
      console.log(`No existe contratante: ${error}`);
    });


  }


  /**
   * Permite guardar un permiso
   */
  guardar(): void {
    if (this.flagForm === false) {
      this.guardarPermisoDesplazamiento();
    } else {
      this.guardarPermisoTemporal();
    }


  }


  /**
   * Permite guardar un permiso temporal
   */
  guardarPermisoTemporal(): void {

    if (this.formTemporal.valid && this.form.valid) {

      this.setFormTemporal();

      this.crudService.post(Constants.URL_PERMISO_TEMPORAL_GUARDAR, this.permisoTemporalVO).then((data: any) => {

        console.log(' => ' + JSON.stringify(data));

        this.form.reset();
        this.formTemporal.reset();
        this.toastService.showSuccess('Informacion', 'Registro Exitoso');
        setTimeout(() => {
          this.router.navigate(['permiso']);
        }, 3000);

      });

    } else {
      this.toastService.showError('Informacion', 'Los campos marcados con * son obligatorios.');
    }
  }

  /**
   * Permite guardar un permiso de desplazamiento
   */
  guardarPermisoDesplazamiento(): void {

    if (this.formDesplazamiento.valid && this.form.valid) {

      this.setFormDesplazamiento();

      this.crudService.post(Constants.URL_PERMISO_DESPLAZAMIENTO_GUARDAR, this.permisoDesplazamientoVO).then((data: any) => {

        console.log(' => ' + JSON.stringify(data));

        this.form.reset();
        this.formDesplazamiento.reset();
        this.toastService.showSuccess('Informacion', 'Registro Exitoso');
        setTimeout(() => {
          this.router.navigate(['permiso']);
        }, 3000);

      });
    } else {
      this.toastService.showError('Informacion', 'Los campos marcados con * son obligatorios.');
    }

  }

  /**
   * Permite fijar el formulario de permisos temporales
   */
  setFormTemporal() {
    this.permisoTemporalVO.contrato = this.form.value.contrato;
    this.permisoTemporalVO.tipopermiso = this.form.value.tipopermiso;
    this.permisoTemporalVO.fecha = this.formTemporal.value.fecha;
    this.permisoTemporalVO.horainicio = this.formTemporal.value.horainicio;
    this.permisoTemporalVO.horafin = this.formTemporal.value.horafin;
    this.permisoTemporalVO.objetivo = this.formTemporal.value.objetivo;

  }

  /**
   * Permite fijar el formulario de desplazamiento
   */
  setFormDesplazamiento() {
    this.permisoDesplazamientoVO.contrato = this.form.value.contrato;
    this.permisoDesplazamientoVO.tipopermiso = this.form.value.tipopermiso;
    this.permisoDesplazamientoVO.fechasolicitud = this.formDesplazamiento.value.fechasolicitud;
    this.permisoDesplazamientoVO.fecharegreso = this.formDesplazamiento.value.fecharegreso;
    this.permisoDesplazamientoVO.ciudadorigen = this.formDesplazamiento.value.ciudadorigen;
    this.permisoDesplazamientoVO.ciudaddestino = this.formDesplazamiento.value.ciudaddestino;
    this.permisoDesplazamientoVO.confmpiodestino = this.formDesplazamiento.value.confmpiodestino;
    this.permisoDesplazamientoVO.objetivodes = this.formDesplazamiento.value.objetivodes;

  }



  /**
   * llenar objeto permiso
   * @param permiso
   */
  settearPermiso(permisoBusqueda): void {
    this.form.controls['contrato'].setValue(permisoBusqueda.contrato);
    this.form.controls['tipodocumento'].setValue(permisoBusqueda.tipoDocumento);
    this.form.controls['primernombre'].setValue(permisoBusqueda.primerNombre);
    this.form.controls['primerapellido'].setValue(permisoBusqueda.primerApellido);
    this.form.controls['cargo'].setValue(permisoBusqueda.cargo);
    this.form.controls['area'].setValue(permisoBusqueda.area);
    this.form.controls['numerodocumento'].setValue(permisoBusqueda.nroDocumento);
    this.form.controls['segundonombre'].setValue(permisoBusqueda.segundoNombre);
    this.form.controls['segundoapellido'].setValue(permisoBusqueda.segundoApellido);
  }



  // Getters of form

  // variables busqueda hoja de vida
  get primernombre() { return this.form.get('primernombre'); }
  get segundonombre() { return this.form.get('segundonombre'); }
  get primerapellido() { return this.form.get('primerapellido'); }
  get segundoapellido() { return this.form.get('segundoapellido'); }
  get tipodocumento() { return this.form.get('tipodocumento'); }
  get identificacion() { return this.form.get('identificacion'); }
  get numerodocumento() { return this.form.get('numerodocumento'); }

  // variables para contrato
  get cargo() { return this.form.get('cargo'); }
  get area() { return this.form.get('area'); }
  get tipopermiso() { return this.form.get('tipopermiso'); }
  get tipocategoria() { return this.form.get('tipocategoria'); }

  // Variables para formulario temporal
  get fecha() { return this.formTemporal.get('fecha'); }
  get horainicio() { return this.formTemporal.get('horainicio'); }
  get horafin() { return this.formTemporal.get('horafin'); }
  get objetivo() { return this.formTemporal.get('objetivo'); }

  // Variables para formulario desplazamiento
  get fechasolicitud() { return this.formDesplazamiento.get('fechasolicitud'); }
  get fecharegreso() { return this.formDesplazamiento.get('fecharegreso'); }
  get ciudadorigen() { return this.formDesplazamiento.get('ciudadorigen'); }
  get ciudaddestino() { return this.formDesplazamiento.get('ciudaddestino'); }
  get objetivodes() { return this.formDesplazamiento.get('objetivodes'); }
  get fechasolicitar() { return this.formDesplazamiento.get('fechasolicitar'); }
  get horainifinsemana() { return this.formDesplazamiento.get('horainifinsemana'); }
  get objetivofinsemana() { return this.formDesplazamiento.get('objetivofinsemana'); }
  get deptoorigen() { return this.formDesplazamiento.get('deptoorigen'); }
  get deptodestino() { return this.formDesplazamiento.get('deptodestino'); }
  get confmpiodestino() { return this.formDesplazamiento.get('confmpiodestino'); }


}

