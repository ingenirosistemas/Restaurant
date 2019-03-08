
import { examenEdicionVO } from './../../../models/examenEdicionVO';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Catalogo } from '../../../models/catalogo';
import { CrudService } from '../../../framework/services/crud.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants, Utils } from '../../../framework/util/utils';
import { ExamenVO } from './../../../models/examenVO';
import { ToastService } from '../../../framework/services/toast.service';
import { DatePipe } from '../../../../../node_modules/@angular/common';

@Component({
  selector: 'app-examen-nuevo',
  templateUrl: './examen-nuevo.component.html',
  styleUrls: ['./examen-nuevo.component.css']

})
export class ExamenNuevoComponent implements OnInit {

  // Form
  public form: FormGroup;

  // objetos
  public examenEdicionVO: examenEdicionVO;

  // Listas
  public datosTipoExamen: Catalogo[] = [];
  public lstTipoIdentificacion: Catalogo[] = [];
  public lstIps: Catalogo[] = [];
  public lstTipoDiagnostico: Catalogo[] = [];

  // Models
  public examenVo: ExamenVO;
  public idExamen;
  public flat: boolean;
  public loading = false;

  // File
  selectedFile: File;

  constructor(
    private formBuilder: FormBuilder,
    private crudService: CrudService,
    private route: ActivatedRoute,
    private router: Router,
    public toastService: ToastService,
    private datePipe: DatePipe
  ) {

    this.lstIps = [];
    this.examenVo = new ExamenVO();

  }
  // metodo para inicializar el componente
  ngOnInit(): void {
    this.idExamen = this.route.snapshot.paramMap.get('id');
    this.buildForm();
    this.loadCatalogos();
    this.prepararEditar();

  }

  /**
     * @author
     */
  onFileSelected(event): void {
    this.selectedFile = <File>event.target.files[0];

  }

  // metodo que valida los campos a editar

  prepararEditar(): void {
    if (this.idExamen != null) {
      console.log('Id ' + this.idExamen);
      this.form.controls['identificacion'].disable();
      this.form.controls['id'].setValue(this.idExamen);
      this.flat = true;
      console.log(' bandera ' + this.flat);
      this.crudService.post(Constants.URL_BUSCAR_EXAMEN_EDITAR, this.idExamen).then((data: any) => {
        console.log(data);
        if (data.length < 1) {
        } else {
          this.examenVo = data;
          this.form.controls['identificacion'].setValue([this.examenVo.hojaVida]);
          this.form.controls['tipoexamen'].setValue([this.examenVo.tipoexamen]);
          this.form.controls['ips'].setValue([this.examenVo.ips]);
          this.form.controls['cie'].setValue([this.examenVo.cie]);
          this.form.controls['ciedescripcion'].setValue(this.examenVo.ciedescripcion);
          this.buscarExamen(this.identificacion.value);
        }
        console.log('data ' + data.length);
      });
    } else {
      this.flat = false;
      console.log(' bandera ' + this.flat);
    }
  }

  // formulario principal campos requeridos

  buildForm(): void {
    this.form = this.formBuilder.group({
      identificacion: ['', [Validators.required, Validators.pattern(Constants.CAMPO_NUMERICO)]],
      primernombre: ['', [Validators.required, Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
      segundonombre: ['', [Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
      primerapellido: ['', [Validators.required]],
      segundoapellido: [''],
      tipodocumento: ['', [Validators.required]],
      numerodocumento: ['', [Validators.required, Validators.pattern(Constants.CAMPO_NUMERICO)]],
      fechainiciocontrato: ['', [Validators.required]],
      fechafincontrato: ['', [Validators.required]],
      tipoexamen: ['', [Validators.required]],
      ips: ['', [Validators.required]],
      cie: ['', [Validators.required]],
      ciedescripcion: ['', [Validators.required, Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
      archivo: [null, [Validators.required]],
      contrato: [''],
      id: ['']
    });
  }
  // metodo que me permite validar la busqueda de un examen por su numero de identificacion

  buscarHojaVida(): void {
    this.buscarExamen(this.form.value.identificacion);
  }
  // buscar Examen
  /**
   * @author Richard
   */
  buscarExamen(numIdentificacion): void {

    this.crudService.get(Constants.URL_GETCONTRATACIONBUSQUEDA + numIdentificacion).then((data: any) => {

      console.log('data: ' + JSON.stringify(data));

      if (null === data) {
        this.toastService.showInfo('No se encontraron registros');

      } else {

        this.form.get('tipodocumento').setValue(data.tipoDocumento);
        this.form.get('numerodocumento').setValue(data.nroDocumento);
        this.form.get('primernombre').setValue(data.primerNombre);
        this.form.get('segundonombre').setValue(data.segundoNombre);
        this.form.get('primerapellido').setValue(data.primerApellido);
        this.form.get('segundoapellido').setValue(data.segundoApellido);
        this.form.get('fechainiciocontrato').setValue(this.datePipe.transform(data.fechaInicio, 'dd/MM/yyyy'));
        this.form.get('fechafincontrato').setValue(this.datePipe.transform(data.fechaFin, 'dd/MM/yyyy'));
        this.form.get('contrato').setValue(data.contrato);
      }

    }, error => {
      console.log(`No se pudo obtener la informacion del examen medico: ${error}`);

    });

  }


  setLoading(loading: boolean): void {
    this.loading = loading;

  }

  // Metodo para guardar un examen nuevo y un examen editado
  /**
  * @author Richard
  */
  async guardar() {
    if (this.flat) {

      this.setLoading(true);

      this.examenEdicionVO = new examenEdicionVO();
      this.examenEdicionVO.id = this.form.value.id;
      this.examenEdicionVO.tipoexamen = Utils.toInt(this.form.value.tipoexamen);
      this.examenEdicionVO.ips = Utils.toInt(this.form.value.ips);
      this.examenEdicionVO.cie = Utils.toInt(this.form.value.cie);
      this.examenEdicionVO.ciedescripcion = this.form.value.ciedescripcion;



      this.crudService.put(Constants.URL_BUSCAR_EXAMEN_EDIT + '/editar/', this.examenEdicionVO).then((data: any) => {
        console.log(data);
        if (data.respuesta === 'true') {
          this.toastService.showSuccess('Información', 'Actualización Exitosa');
          setTimeout(() => {
            this.router.navigate(['examen']);
          }, 3000);
        } else {
          this.toastService.showError('Información', data.respuesta);
        }
      });


      this.setLoading(false);

    } else {

      this.setLoading(true);

      console.log('data: ' + JSON.stringify(this.form.value));
      const fd = new FormData();
      fd.append('file', this.selectedFile, this.selectedFile.name);


      const response = await this.crudService.uploadFile(fd);

      console.log(response);

      this.examenVo.tipoexamen = this.form.value.tipoexamen;
      this.examenVo.ips = this.form.value.ips;
      this.examenVo.contrato = this.form.value.contrato;
      this.examenVo.archivo = response.uploadname;
      this.examenVo.cie = this.form.value.cie;
      this.examenVo.ciedescripcion = this.form.value.ciedescripcion;
      console.log('data final: ' + JSON.stringify(this.examenVo));
      await this.crudService.create(Constants.URL_EXAMEN_GUARDAR + '/guardar/', this.examenVo).then((data: any) => {
        console.log(data);
        this.form.reset();
        this.toastService.showSuccess('Informacion', 'Registro Exitoso');
        setTimeout(() => {
          this.router.navigate(['examen']);
        }, 3000);

      }, error => {
        console.log(`No se pudo guardar el examen medico: ${error}`);
      });

      this.setLoading(false);

    }

  }

  // Metodo encargado de cargar todos los Catalogos

  loadCatalogos(): void {
    this.getTipoExamen();
    this.getIps();
    this.getCie10();

    // Declaracion de los catalogos del modulo examen medico
  }

  getTipoExamen(): void {
    this.crudService.get(Constants.URL_CATALOGO + '/TipoExamen').then((data: any) => {
      this.datosTipoExamen = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de tipo examen: ${error}`);
    });

  }

  getIps(): void {
    this.crudService.get(Constants.URL_CATALOGO + '/Ips').then((data: any) => {
      this.lstIps = data;

    }, error => {
      console.log(`No se pudo obtener la informacion de las Ips: ${error}`);
    });

  }

  getCie10(): void {
    this.crudService.get(Constants.URL_CATALOGO + '/Cie10').then((data: any) => {
      this.lstTipoDiagnostico = data;

    }, error => {
      console.log(`No se pudo obtener la informacion del Diagnostico Medico: ${error}`);
    });
  }

  cancelar(): void {
    this.router.navigate(['examen']);
  }

  // crear objeto editar examen medico
  crearObjetoEditar(): void {
    this.examenVo = new ExamenVO();
    this.examenVo.tipoexamen = this.form.value.tipoexamen;
    this.examenVo.ips = this.form.value.ips;
    this.examenVo.cie = this.form.value.cie;
    this.examenVo.ciedescripcion = this.form.value.ciedescripcion;
  }

  // Getters of form
  // Form principal
  get primernombre() { return this.form.get('primernombre'); }
  get segundonombre() { return this.form.get('segundonombre'); }
  get primerapellido() { return this.form.get('primerapellido'); }
  get segundoapellido() { return this.form.get('segundoapellido'); }
  get tipodocumento() { return this.form.get('tipodocumento'); }
  get numerodocumento() { return this.form.get('numerodocumento'); }
  get tipoexamen() { return this.form.get('tipoexamen'); }
  get ips() { return this.form.get('ips'); }
  get identificacion() { return this.form.get('identificacion'); }
  get fechainiciocontrato() { return this.form.get('fechainiciocontrato'); }
  get fechafincontrato() { return this.form.get('fechafincontrato'); }
  get cie() { return this.form.get('cie'); }
  get ciedescripcion() { return this.form.get('ciedescripcion'); }
  get archivo() { return this.form.get('archivo'); }
  get contrato() { return this.form.get('contrato'); }
  get id() { return this.form.get('id'); }

}
