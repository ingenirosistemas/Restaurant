import { Constants, Utils } from '../../../framework/util/utils';
import { Catalogo } from '../../../models/catalogo';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CrudService } from '../../../framework/services/crud.service';
import { IncapacidadVO } from '../../../models/incapacidadVO';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UtilsGrid } from '../../../framework/util/utils-grid';
import { Experiencia } from '../../../models/experiencia';
import { BsModalRef, BsLocaleService } from 'ngx-bootstrap';
import { esLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ToastService } from '../../../framework/services/toast.service';
// import { locale } from './../../../../../dist/appth/assets/bower_components/moment/moment.d';


@Component({
  selector: 'app-incapacidad-nuevo',
  templateUrl: './incapacidad-nuevo.component.html',
  styleUrls: ['./incapacidad-nuevo.component.css']
})
export class IncapacidadNuevoComponent implements OnInit {

  form: FormGroup;

  // Listas
  public datosTipoIncapacidad: Catalogo[] = [];
  public lstCie10: Catalogo[] = [];

  // Entidades
  incapacidadVO: IncapacidadVO;

  // Variables
  public incapacidadId: number; // Para el id de la incapacidad
  public opcion: string; // Permite saber que se va ha realizar: editar, prorroga

  public isProrroga: boolean;

  // File
  selectedFile: File;

  // Constructor
  constructor(
    private formBuilder: FormBuilder,
    private crudService: CrudService,
    private router: Router,
    private _localeService: BsLocaleService,
    public toastService: ToastService,
    private datePipe: DatePipe,
    private route: ActivatedRoute
  ) {

    this.lstCie10 = [];
    this.incapacidadVO = new IncapacidadVO();
    this.isProrroga = false;

    defineLocale('es', esLocale);
    this._localeService.use('es');

  }


  ngOnInit() {
    this.buildForm();
    this.loadCatalogos();

    if (this.route.snapshot.paramMap.get('id')) {
      this.incapacidadId = +this.route.snapshot.paramMap.get('id');

    }

    if (this.route.snapshot.paramMap.get('opcion')) {
      this.opcion = this.route.snapshot.paramMap.get('opcion');

    }
    this.fijarHeadForm();


  }

  /**
   * Metodo que permite fijar la cabecera del formualario ,
   * si esta editando o creando una prorroga
   */
  fijarHeadForm(): void {

    if (this.opcion === 'editar') {

      this.crudService.post(Constants.URL_GET_INCAPACIDAD_BY_ID, this.incapacidadId).then((data: any) => {

        console.log('data editar: ' + JSON.stringify(data));
        this.form.get('tipoincapacidad').setValue([data.tipoincapacidad]);
        this.form.get('cie').setValue([data.cie]);
        this.form.get('fechaincidente').setValue(this.datePipe.transform(data.fechaincidente, 'dd/MM/yyyy').toString());
        this.form.get('fechainicio').setValue(this.datePipe.transform(data.fechainicio, 'dd/MM/yyyy').toString());
        this.form.get('fechafin').setValue(this.datePipe.transform(data.fechafin, 'dd/MM/yyyy').toString());
        this.form.get('diasolicitado').setValue(data.diasolicitado);
        this.form.get('diaautorizado').setValue(data.diaautorizado);
        this.form.get('incapacidadpadre').setValue(data.incapacidadpadre);

        if (data.incapacidadpadre) {

          this.isProrroga = true;

          this.form.get('prorroga').setValue(data.prorroga);

        } else {

          this.isProrroga = false;

        }

      }, error => {
        // console.log(`No se pudo obtener la informacion de incapacidad: ${error}`);
      });

    }


    if (this.opcion === 'prorroga' || this.opcion === 'editar') {

      this.crudService.get(Constants.URL_GETCONTRATACIONBUSQUEDA + this.route.snapshot.paramMap.get('identificacion')).then((data: any) => {

        this.form.get('primernombre').setValue(data.primerNombre + ' ' + (data.segundoNombre ? data.segundoNombre : ''));
        this.form.get('numerodocumento').setValue(data.nroDocumento);
        this.form.get('apellido').setValue(data.primerApellido + ' ' + (data.segundoApellido ? data.segundoApellido : ''));
        this.form.get('area').setValue(data.area);
        this.form.get('documento').setValue(data.nroDocumento);
        this.form.get('cargo').setValue(data.cargo);
        this.form.get('contrato').setValue(data.contrato);
        this.form.get('eps').setValue(data.eps);

        // console.log('eps : ' + this.form.value.eps);

      }, error => {
        // console.log(`No se pudo obtener la informacion del contrato: ${error}`);


      });


    }

    if (this.opcion === 'nuevo') {
      this.isProrroga = false;

    } else if (this.opcion === 'prorroga') {

      this.isProrroga = true;

    }


  }

  /**
     * @author Yeik Castillo
     * Metodo contruccion del formulario
     */
  buildForm(): void {
    this.form = this.formBuilder.group({

      primernombre: ['', [Validators.required, Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
      apellido: ['', [Validators.required, Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
      numerodocumento: ['', [Validators.required, Validators.pattern(Constants.CAMPO_NUMERICO)]],
      documento: ['', [Validators.required]],
      cargo: ['', [Validators.required]],
      area: ['', [Validators.required]],
      contrato: [''],
      tipoincapacidad: ['', [Validators.required]],
      cie: ['', [Validators.required]],
      fechainicio: ['', [Validators.required]],
      fechafin: ['', [Validators.required]],
      diaautorizado: ['', [Validators.required, Validators.pattern(Constants.DIAS)]],
      diasolicitado: ['', [Validators.required, Validators.pattern(Constants.DIAS)]],
      fechaincidente: ['', [Validators.required]],
      prorroga: [null],
      eps: [],
      incapacidadpadre: [],
      file: [null, Validators.required]


    });

  }

  /**
   * @author Yeik Castillo
   * Metodo para la consulta y extraccion de datos y muestra de los mismos
   */
  buscarContrato(): void {

    this.crudService.get(Constants.URL_GETCONTRATACIONBUSQUEDA + this.form.value.numerodocumento).then((data: any) => {

      // console.log('data: ' + JSON.stringify(data));

      this.form.get('primernombre').setValue(data.primerNombre + ' ' + (data.segundoNombre ? data.segundoNombre : ''));
      this.form.get('numerodocumento').setValue(data.nroDocumento);
      this.form.get('apellido').setValue(data.primerApellido + ' ' + (data.segundoApellido ? data.segundoApellido : ''));
      this.form.get('area').setValue(data.area);
      this.form.get('documento').setValue(data.nroDocumento);
      this.form.get('cargo').setValue(data.cargo);
      this.form.get('contrato').setValue(data.contrato);
      this.form.get('eps').setValue(data.eps);
      // console.log('eps : ' + this.form.value.eps);

    }, error => {
      // console.log(`No se pudo obtener la informacion del contrato: ${error}`);


    });

  }

  /**
     * @author
     */
  onFileSelected(event): void {
    this.selectedFile = <File>event.target.files[0];


  }


  /**
  * @author Yeik Csstillo
  * Metodo para guardar la informacion
  */
  async guardar() {

    console.log('data: ' + JSON.stringify(this.form.value));


    if (this.opcion === 'prorroga' || this.opcion === 'editar') {
      this.incapacidadVO.id = this.incapacidadId;
    } else {
      this.incapacidadVO.id = 0;
    }

    if ('editar' === this.opcion) {
      this.incapacidadVO.tipoincapacidad = Utils.toInt(this.form.value.tipoincapacidad);
      this.incapacidadVO.cie = Utils.toInt(this.form.value.cie);
      this.incapacidadVO.fechainicio = Utils.string_to_date(this.form.value.fechainicio);
      this.incapacidadVO.fechafin = Utils.string_to_date(this.form.value.fechafin);
      this.incapacidadVO.fechaincidente = Utils.string_to_date(this.form.value.fechaincidente);
    } else {
      this.incapacidadVO.tipoincapacidad = this.form.value.tipoincapacidad;
      this.incapacidadVO.cie = this.form.value.cie;
      this.incapacidadVO.fechainicio = this.form.value.fechainicio;
      this.incapacidadVO.fechafin = this.form.value.fechafin;
      this.incapacidadVO.fechaincidente = this.form.value.fechaincidente;
    }
    this.incapacidadVO.incapacidadpadre = this.form.value.incapacidadpadre;
    this.incapacidadVO.diaautorizado = this.form.value.diaautorizado;
    this.incapacidadVO.diasolicitado = this.form.value.diasolicitado;

    this.incapacidadVO.prorroga = this.form.value.prorroga;
    this.incapacidadVO.contrato = this.form.value.contrato;
    this.incapacidadVO.opcion = this.opcion;


    console.log('data: ' + JSON.stringify(this.form.value));
    const fd = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);


    const response = await this.crudService.uploadFile(fd); // Guardar el archivo

    console.log(response);

    this.incapacidadVO.archivo = response.uploadname;

    console.log('data final: ' + JSON.stringify(this.incapacidadVO));

    this.crudService.create(Constants.URL_INCAPACIDAD_GUARDAR + '/guardar/', this.incapacidadVO).then((data: any) => {
      console.log(data);
      if (JSON.parse(data).respuesta === 'true') {

        if ('editar' === this.opcion) {
          this.toastService.showSuccess('Información', 'Actualización Exitosa');
        } else {
          this.toastService.showSuccess('Información', 'Registro Exitosa');
          // alert('Registro Exitoso.');
          this.form.reset();
          setTimeout(() => {
            this.router.navigate(['incapacidad']);

          }, 500);
        }

      } else {
        alert(JSON.parse(data).respuesta);
      }

    }, error => {
      console.log(`No se pudo guardar la incapacidad: ${error}`);
    });

  }

  /**
   * @author gay castillo
   */
  cancelar(): void {
    this.router.navigate(['incapacidad']);
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
  * Metodo de coneccion con catalogo C10
  */
  getC10(): void {
    this.crudService.get(Constants.URL_CATALOGO + '/Cie10').then((data: any) => {
      this.lstCie10 = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de Cie10: ${error}`);
    });


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

  // Getters de formulario
  get primernombre() { return this.form.get('primernombre'); }
  get apellido() { return this.form.get('apellido'); }
  get numerodocumento() { return this.form.get('numerodocumento'); }
  get cargo() { return this.form.get('cargo'); }
  get area() { return this.form.get('area'); }
  get nombredoc() { return this.form.get('nombredoc'); }
  get registropro() { return this.form.get('registropro'); }
  get documento() { return this.form.get('documento'); }
  get cie() { return this.form.get('cie'); }
  get contrato() { return this.form.get('contrato'); }
  get incapacidadpadre() { return this.form.get('incapacidadpadre'); }
  get file() { return this.form.get('file'); }

}
