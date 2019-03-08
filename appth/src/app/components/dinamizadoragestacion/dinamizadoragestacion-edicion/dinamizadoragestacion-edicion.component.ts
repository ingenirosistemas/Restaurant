import { moment } from 'ngx-bootstrap/chronos/test/chain';

import { DinamizadoraVO } from './../../../models/dinamizadoraVO';
import { ToastService } from '../../../framework/services/toast.service';
import { DinamizadoraGestacionBusqueda } from './../../../models/DinamizadoraGestacionBusqueda';
import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../../framework/services/crud.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Constants, Utils } from './../../../framework/util/utils';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from '../../../../../node_modules/ngx-bootstrap';
import { Observable } from '../../../../../node_modules/rxjs';




@Component({
  selector: 'app-dinamizadoragestacion-edicion',
  templateUrl: './dinamizadoragestacion-edicion.component.html',
  styleUrls: ['./dinamizadoragestacion-edicion.component.css']
})


export class DinamizadoragestacionEdicionComponent implements OnInit {
  // formularios
  public form: FormGroup;
  public formb: FormGroup;

  // objetos
  private dinzamizadoraGestacionBusqueda: DinamizadoraGestacionBusqueda;
  private DinamizadoraVO: DinamizadoraVO;
  public idDinamizadoraGestion;
  public flat: boolean;

  // variables
  minDate: Date = new Date();
  maxDate: Date = new Date();
  public isEdit = false;
  // fechaini: Date = new Date();
  // fechafin: Date = new Date();

  fechaini: Date = new Date();
  fechafin: Date = new Date();
  dias: Number;
  fecha_parto: Number;
  siete: Number = 7;


  selectedFile: File;


  /**
   * @author Angie LO
   */

  constructor(
    private formBuilder: FormBuilder,
    private crudService: CrudService,
    private formBuilderB: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    public toastService: ToastService,
    private datePipe: DatePipe,
    private _localeService: BsLocaleService // Para el idioma de los calendarios
  ) {
    this.dinzamizadoraGestacionBusqueda = new DinamizadoraGestacionBusqueda();
    this.flat = false;


    // Define el idioma de los catalogos en español
    defineLocale('es', esLocale);
    this._localeService.use('es');

  }
  /**
   * @author Angie LO
   *  inicializaicon de componente
   */

  ngOnInit() {
    this.buildForm();
    this.buildFormB();
    this.idDinamizadoraGestion = this.route.snapshot.paramMap.get('id');
    this.editar();
  }




  /**
     * @author
     */
  onFileSelected(event): void {
    this.selectedFile = <File>event.target.files[0];

  }




  /**
 * @author Angie LO
 Metodo permite editar llegada tarde
 */
  editar(): void {
    if (this.idDinamizadoraGestion != null) {
      console.log('Id ' + this.idDinamizadoraGestion);
      this.formb.controls['identificacion'].disable();
      this.flat = true;
      this.crudService.post(Constants.URL_BUSCAR_DINAMIZADORA_EDITAR, this.idDinamizadoraGestion).then((data: any) => {
        if (data.length < 1) {
        } else {
          this.buscarDinamizadora(data.documentoidentificacion);
          this.form.controls['id'].setValue(data.id);
          this.form.controls['fechaparto'].setValue(Utils.string_to_date(this.datePipe.transform(data.fechaprobabaleparto, 'dd/MM/yyyy')));
          this.form.controls['diasgestacion'].setValue(data.edadgestacional);
          this.form.controls['tomarvacaciones'].setValue(data.tomavacaciones);
          this.form.controls['fechafum'].setValue(Utils.string_to_date(this.datePipe.transform(data.fechafum, 'dd/MM/yyyy')));

        }
      });
    } else {
      this.flat = false;
      console.log(' bandera ' + this.flat);
    }
  }


  buildFormB(): void {
    this.formb = this.formBuilderB.group({
      primernombre: ['', [Validators.required]],
      segundonombre: ['', [Validators.required]],
      primerapellido: ['', [Validators.required]],
      segundoapellido: ['', [Validators.required]],
      tipodocumento: ['', [Validators.required]],
      numerodocumento: ['', [Validators.required]],
      cargo: ['', [Validators.required]],
      identificacion: ['', [Validators.required, Validators.pattern(Constants.CAMPO_NUMERICO)], this.existeGestante.bind(this)],
      area: ['', [Validators.required]],
    });
  }

  /**
   * Permite validar si una gestante ya existe en la base de datos
   *
   * @author Milton Sanchrez
   * @param control
   */
  existeGestante(control: FormControl): Promise<any> | Observable<any> {
    const promesa = new Promise(
      (resolve, reject) => {

        if (this.isEdit === false) {
          this.crudService.get(Constants.URL_GET_VALIDAR_EXISTE_GESTANTE + '/' + control.value).then((data: any) => {

            console.log('Existe: ' + data);
            if (data === true) {
              resolve({ existe: true });
            } else {
              resolve(null);
            }

          }, error => {

            // console.log(`No se pudo validar la existencia de la gestante: ${error}`);
            this.toastService.showError('Información', `No se pudo validar la existencia de la gestante: ${error}`);
          });
        } else {
          resolve(null);
        }

      }
    );

    return promesa;

  }


  /**
  * Formulario principal
  * @author
  */
  buildForm(): void {
    this.form = this.formBuilder.group({
      fechaparto: ['', [Validators.required]],
      fechafum: ['', [Validators.required]],
      diasgestacion: ['', [Validators.required, Validators.pattern(Constants.DIAS)]],
      tomarvacaciones: ['', [Validators.required]],
      contrato: [''],
      id: [''],
    });
  }

  buscaEmbarazoActual(): void {
    this.buscarDinamizadora(this.formb.value.identificacion);
  }


  /**
   * Metodo para buscar dinamizadora
   */
  buscarDinamizadora(numIdentificacion): void {

    this.crudService.get(Constants.URL_GETCONTRATACIONBUSQUEDA + numIdentificacion).then((data: any) => {

      console.log('data: ' + JSON.stringify(data));

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

  /**
* Metodo para guardar o editar objeto dinamizadora en gestacion
* @param url
*/

  async guardardinamizadora() {
    if (this.flat) {

      this.crudService.put(Constants.URL_EDITAR_DINAMIZADORAGESTACION + '/editar/', this.form.value).then((data: any) => {
        console.log(data);
        if (data.respuesta === 'true') {
          this.toastService.showSuccess('Información', 'Actualización Exitosa');
          setTimeout(() => {
            this.router.navigate(['dinamizadoragestacion']);
          }, 3000);
        } else {
          this.toastService.showError('Información', data.respuesta);
        }
      });
    } else {
      console.log('data: ' + JSON.stringify(this.form.value));
      const fd = new FormData();
      fd.append('file', this.selectedFile, this.selectedFile.name);

      const response = await this.crudService.uploadFile(fd);

      console.log(response);
      this.DinamizadoraVO = new DinamizadoraVO();
      this.DinamizadoraVO.diasgestacion = this.form.value.diasgestacion;
      this.DinamizadoraVO.fechaparto = this.form.value.fechaparto;
      this.DinamizadoraVO.fechafum = this.form.value.fechafum;
      this.DinamizadoraVO.tomarvacaciones = this.form.value.tomarvacaciones;
      this.DinamizadoraVO.archivo = response.uploadname;
      this.DinamizadoraVO.contrato = this.form.value.contrato;

      console.log('data final: ' + JSON.stringify(this.DinamizadoraVO));
      await this.crudService.create(Constants.URL_DINAMIZADORAGESTACION_GUARDAR + '/guardar/', this.DinamizadoraVO).then((data: any) => {
        console.log(data);

        if (JSON.parse(data).respuesta === 'true') {

          this.form.reset();
          this.toastService.showSuccess('Informacion', 'Registro Exitoso');
          setTimeout(() => {
            this.router.navigate(['dinamizadoragestacion']);
          }, 3000);

        } else {
          this.toastService.showError('Informacion', JSON.parse(data).respuesta);
        }



      }, error => {
        console.log(`No se pudo guardar la dinamizadora en gestacion: ${error}`);
      });


    }
  }



  /**
    * cancelar
    */


  cancelar(): void {
    this.router.navigate(['dinamizadoragestacion']);
  }



  // Getters of form
  // variables de llegadas tarde
  get fechaparto() { return this.form.get('fechaparto'); }
  get diasgestacion() { return this.form.get('diasgestacion'); }
  get tomarvacaciones() { return this.form.get('tomarvacaciones'); }
  // variables de busqueda de dinamizador
  get contrato() { return this.form.get('contrato'); }
  get id() { return this.form.get('id'); }
  get primernombre() { return this.formb.get('primernombre'); }
  get segundonombre() { return this.formb.get('segundonombre'); }
  get primerapellido() { return this.formb.get('primerapellido'); }
  get segundoapellido() { return this.formb.get('segundoapellido'); }
  get tipodocumento() { return this.formb.get('tipodocumento'); }
  get identificacion() { return this.formb.get('identificacion'); }
  get fechafum() { return this.form.get('fechafum'); }
  get cargo() { return this.formb.get('cargo'); }
  get area() { return this.formb.get('area'); }

}

