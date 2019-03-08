import { ToastService } from '../../../framework/services/toast.service';
import { LlegadaTardeBusqueda } from './../../../models/LlegadaTardeBusqueda';
import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../../framework/services/crud.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constants, Utils } from '../../../framework/util/utils';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { Catalogo } from '../../../models/catalogo';
import { BsLocaleService } from '../../../../../node_modules/ngx-bootstrap';

@Component({
  selector: 'app-llegadatarde-edicion',
  templateUrl: './llegadatarde-edicion.component.html',
  styleUrls: ['./llegadatarde-edicion.component.css']
})


export class LlegadatardeEdicionComponent implements OnInit {

  // formularios
  public form: FormGroup;
  public formb: FormGroup;

  // objetos
  private llegadaTardeBusqueda: LlegadaTardeBusqueda;
  public idLlegadaTarde;
  public flat: boolean;
  Horaentrada: Date = new Date();


  // Listas
  public lstTipoTardanza: Catalogo[] = [];

  /**
   * @author Angie LO
   */

  constructor(
    private formBuilder: FormBuilder,
    private formBuilderB: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private crudService: CrudService,
    public toastService: ToastService,
    private datePipe: DatePipe,
    private _localeService: BsLocaleService // Para el idioma de los calendarios
  ) {

    this.llegadaTardeBusqueda = new LlegadaTardeBusqueda();
    this.flat = false;
    this.lstTipoTardanza = [];

    // Define el idioma de los catalogos en español
    defineLocale('es', esLocale);
    this._localeService.use('es');

  }
  /**
   * @author Angie LO
   */

  ngOnInit() {
    this.buildForm();
    this.buildFormB();
    this.idLlegadaTarde = this.route.snapshot.paramMap.get('id');
    this.prepararEditar();
    this.loadCatalogos();
  }

  changedHoraentrada(): void {
    console.log('Time changed to: ' + this.horaentrada);

  }
  /**
 * @author Angie LO
 Metodo permite editar llegada tarde
 */
  prepararEditar(): void {
    if (this.idLlegadaTarde != null) {
      console.log('Id ' + this.idLlegadaTarde);
      this.formb.controls['identificacion'].disable();
      this.flat = true;
      this.crudService.post(Constants.URL_BUSCAR_LLEGADA_EDITAR, this.idLlegadaTarde).then((data: any) => {
        if (data.length < 1) {
        } else {
          console.log(' objetc ' + data.tipotardanza);
          this.buscarHojadeVida(data.documentoidentificacion);
          this.form.controls['id'].setValue(data.id);
          this.form.controls['fecha'].setValue(Utils.string_to_date(this.datePipe.transform(data.fecha, 'dd/MM/yyyy')));
          this.form.controls['horaentrada'].setValue(data.horaentrada);
          this.form.controls['detalle'].setValue(data.detalle);
          this.formb.controls['tipotardanza'].setValue([data.tipotardanza]);
          // this.buscarHojadeVida(this.identificacion.value);
        }
      });
    } else {
      this.flat = false;
      console.log(' bandera ' + this.flat);
    }
  }
  // Metodo encargado de cargar todos los Catalogos

  loadCatalogos(): void {
    this.getLLegada();


    // Declaracion de los catalogos del modulo examen medico
  }

  buildFormB(): void {
    this.formb = this.formBuilderB.group({
      primernombre: ['', [Validators.required]],
      segundonombre: ['', [Validators.required]],
      primerapellido: ['', [Validators.required]],
      segundoapellido: ['', [Validators.required]],
      tipodocumento: ['', [Validators.required]],
      numerodocumento: ['', [Validators.required]],
      identificacion: ['', [Validators.required, Validators.pattern(Constants.CAMPO_NUMERICO)]],
      cargo: ['', [Validators.required]],
      area: ['', [Validators.required]],
      tipotardanza: ['', [Validators.required]],
    });
  }
  /**
   * Formulario principal
   * @author
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      fecha: ['', [Validators.required]],
      horaentrada: ['', [Validators.required]],
      detalle: ['', [Validators.required]],
      contrato: [''],
      id: [''],
    });
  }

  buscaLlegadatarde(): void {
    this.buscarHojadeVida(this.formb.value.identificacion);
  }

  /**
   * Metodo para buscar llegada tarde
   */
  buscarHojadeVida(numIdentificacion): void {

    this.crudService.get(Constants.URL_GETCONTRATACIONBUSQUEDA + numIdentificacion).then((data: any) => {

      // console.log('data: ' + JSON.stringify(data));

      if (null === data) {
        this.toastService.showInfo('No se encontraron registros');
      } else {

        this.form.controls['contrato'].setValue(data.contrato);
        this.formb.controls['primernombre'].setValue(data.primerNombre);
        this.formb.controls['segundonombre'].setValue(data.segundoNombre);
        this.formb.controls['primerapellido'].setValue(data.primerApellido);
        this.formb.controls['segundoapellido'].setValue(data.segundoApellido);
        this.formb.controls['tipodocumento'].setValue(data.tipoDocumento);
        this.formb.controls['numerodocumento'].setValue(data.nroDocumento);
        this.formb.controls['cargo'].setValue(data.cargo);
        this.formb.controls['area'].setValue(data.area);
      }
    });

  }
  // /**
  //  * verificarArray
  //  * @param objetc
  //  * @param nomVar
  //  */
  // verifyArray(objetc, nomVar): number {
  //   if (objetc instanceof Array) {
  //     return this.form.get(nomVar).value[0];
  //   }
  //   return objetc;
  // }


  crearObjetoEditar(): void {
    this.llegadaTardeBusqueda = new LlegadaTardeBusqueda();
    this.llegadaTardeBusqueda.fecha = this.form.value.fecha;
    this.llegadaTardeBusqueda.horaentrada = this.form.value.horaentrada;
    this.llegadaTardeBusqueda.detalle = this.form.value.detalle;
    this.llegadaTardeBusqueda.tipotardanza = this.formb.value.tipotardanza;
    // this.llegadaTardeBusqueda.tipotardanza = this.verifyArray(this.formb.value.tipotardanza, 'tipotardanza');
  }
  /**
 * Metodo para guardar o editar objeto llegada tarde
 * @param url
 */

  guardarllegada(): void {
    if (this.flat) {
      // this.crearObjetoEditar();..................................................................

      this.form.addControl('tipotardanza', this.formBuilder.control(this.formb.value.tipotardanza));

      this.crudService.put(Constants.URL_EDITAR_LLEGADA_TARDE + '/editar/', this.form.value).then((data: any) => {
        console.log(data);
        if (data.respuesta === 'true') {
          this.toastService.showSuccess('Información', 'Actualización Exitosa');
          setTimeout(() => {
            this.router.navigate(['llegadatarde']);
          }, 2000);
        } else {
          this.toastService.showError('Información', data.respuesta);
        }
      });
    } else {

      this.form.addControl('tipotardanza', this.formBuilder.control(this.formb.value.tipotardanza));

      this.crudService.create(Constants.URL_LLEGADATARDE_GUARDAR + '/guardar/', this.form.value).then((data: any) => {
        console.log(data);
        this.form.reset();
        this.formb.reset();
        this.toastService.showSuccess('Informacion', 'Registro Exitoso');
        setTimeout(() => {
          this.router.navigate(['llegadatarde']);
        }, 2000);

      }, error => {
        console.log(`No se pudo guardar llegada tarde: ${error}`);

      });
    }
  }

  getLLegada(): void {
    this.crudService.get(Constants.URL_CATALOGO + '/TipoTardanza').then((data: any) => {
      this.lstTipoTardanza = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de tipo: ${error}`);
    });

  }

  /**
    * cancelar
    */
  cancelar(): void {
    this.router.navigate(['llegadatarde']);
  }

  // Getters of for...
  // variables de llegadas tarde
  get fecha() { return this.form.get('fecha'); }
  get horaentrada() { return this.form.get('horaentrada'); }
  get detalle() { return this.form.get('detalle'); }

  // variables de busqueda de dinamizador
  get contrato() { return this.form.get('contrato'); }
  get id() { return this.form.get('id'); }
  get primernombre() { return this.formb.get('primernombre'); }
  get segundonombre() { return this.formb.get('segundonombre'); }
  get primerapellido() { return this.formb.get('primerapellido'); }
  get segundoapellido() { return this.formb.get('segundoapellido'); }
  get tipodocumento() { return this.formb.get('tipodocumento'); }
  get identificacion() { return this.formb.get('identificacion'); }
  get tipotardanza() { return this.formb.get('tipotardanza'); }
  get cargo() { return this.formb.get('cargo'); }
  get area() { return this.formb.get('area'); }

}
