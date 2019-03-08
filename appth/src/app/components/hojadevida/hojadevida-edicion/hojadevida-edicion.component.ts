
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CrudService } from '../../../framework/services/crud.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Constants } from '../../../framework/util/utils';
import { Catalogo } from '../../../models/catalogo';
import { Router, ActivatedRoute } from '@angular/router';
import { IOption } from 'ng-select';
import { Estudio } from '../../../models/estudio';
import { UtilsGrid } from '../../../framework/util/utils-grid';
import { Experiencia } from '../../../models/experiencia';
import { BsModalRef, BsLocaleService } from 'ngx-bootstrap';
import { esLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ToastService } from '../../../framework/services/toast.service';
import { Utils } from '../../../framework/util/utils';
import { HojadevidaVO } from '../../../models/hojadevidaVO';
import { DatePipe } from '../../../../../node_modules/@angular/common';
import { Observable } from '../../../../../node_modules/rxjs';
import { SoporteVO } from '../../../models/SoporteVO';
import { SoporteCargaComponent } from '../soporte-carga/soporte-carga.component';



@Component({
  selector: 'app-hojadevida-edicion',
  templateUrl: './hojadevida-edicion.component.html',
  styleUrls: ['./hojadevida-edicion.component.css'],
  styles: []
})
export class HojadevidaEdicionComponent implements OnInit, AfterViewInit {

  // Form
  public form: FormGroup;
  public frmEst: FormGroup;
  public frmExpLab: FormGroup;

  // Listas
  public lstTipoIdentificacion: Catalogo[] = [];
  public lstEstadoCivil: Catalogo[] = [];
  public lstProfesion: Catalogo[] = [];
  public lstTipoEstudio: Catalogo[] = [];
  public lstEntidad: Catalogo[] = [];
  public lstCargo: Catalogo[] = [];
  public lstEstudio: Estudio[] = [];
  public lstExpLab: Experiencia[] = [];
  public modalRef: BsModalRef;

  // Entidades
  dataEdit: any;

  // Variables
  public isEdit = false;
  public hojaDevidaId = -1;
  public loading = false;


  // Para el select de generos
  generos = {
    items: [
      { value: 'M', label: 'M' },
      { value: 'F', label: 'F' }
    ],
  };

  public lstFiles: File[]; // Para guardar los archivos
  public lstSoporteCargado: SoporteVO[]; // Lista los soportes cargados en el servidor

  @ViewChild(SoporteCargaComponent) SoporteCarga; // Referencia al componente de cargar soportes

  /**
   * @author Milton Sanchez
   */
  constructor(
    private formBuilder: FormBuilder,
    public crudService: CrudService,
    private router: Router,
    private route: ActivatedRoute,
    private _localeService: BsLocaleService,
    public toastService: ToastService,
    private datePipe: DatePipe
  ) {

    if (this.route.snapshot.paramMap.get('id')) {
      this.hojaDevidaId = +this.route.snapshot.paramMap.get('id');
      // console.log('hojaDevidaId:' + this.hojaDevidaId);

    }

    defineLocale('es', esLocale);
    this._localeService.use('es');

    this.lstTipoIdentificacion = [];
    this.lstFiles = [];

  }

  /**
   * @author Milton Sanchez
   * Event of page
   */
  ngAfterViewInit(): void {

  }

  /**
   * Metodo que carga los soportes de una hoja de vida en especifico
   * @author Milton Sanchez
   */
  cargarSoportes(): void {
    // Soportes
    this.crudService.get(Constants.URL_GET_SOPORTES_BY_ID_HOJADEVIDA + '/' + this.hojaDevidaId).then((data: any) => {
      this.lstSoporteCargado = data;
      // console.log('soportes: ' + JSON.stringify(this.lstSoporteCargado));
    }, error => {
      // console.log(`No se pudo obtener los archivos: ${error}`);
      this.toastService.showError('Información', `No se pudo obtener los archivos: ${error}`);
    });
  }

  /**
   * Init del componente
   *
   * @author Milton Sanchez
   */
  ngOnInit(): void {
    this.buildForm();
    this.buildFrmEst();
    this.buildFrmExpLab();
    this.loadCatalogos();

    if (this.hojaDevidaId !== -1) {
      this.isEdit = true;

      this.cargarSoportes();

      this.crudService.post(Constants.URL_GETHOJADEVIDABYID, this.hojaDevidaId).then((data: any) => {

        // console.log('data: ' + JSON.stringify(data));
        this.form.get('id').setValue(data.id);
        this.form.get('primernombre').setValue(data.primernombre);
        this.form.get('segundonombre').setValue(data.segundonombre);
        this.form.get('numerodocumento').setValue(data.numerodocumento);
        this.form.get('primerapellido').setValue(data.primerapellido);
        this.form.get('segundoapellido').setValue(data.segundoapellido);
        this.form.get('correoelectronico').setValue(data.correoelectronico);
        this.form.get('tipodocumento').setValue([data.tipodocumento]);
        this.form.get('estadocivil').setValue([data.estadocivil]);
        this.form.get('genero').setValue([data.genero]);
        this.form.get('telefonocasa').setValue(data.telefonocasa);
        this.form.get('telefonomovil').setValue(data.telefonomovil);
        this.form.get('profesion').setValue([data.profesion]);
        this.form.get('fechanacimiento').setValue(data.fechaNacimiento);

        this.lstEstudio = data.listaEstudios;
        this.lstExpLab = data.listaExpLaboral;


      }, error => {
        // console.log(`No se pudo obtener la informacion de la hoja de vida: ${error}`);
        this.toastService.showError('Información', `No se pudo obtener la informacion de la hoja de vida para actualizar: ${error}`);
      });

    } else {

      this.isEdit = false;

    }


  }


  /**
   * Permite validar si una hoja de vida ya existe en la base de datos
   *
   * @author Milton Sanchrez
   * @param control
   */
  existeHojadevida(control: FormControl): Promise<any> | Observable<any> {
    const promesa = new Promise(
      (resolve, reject) => {

        if (this.isEdit === false) {
          this.crudService.get(Constants.URL_GET_VALIDAR_EXISTE_HOJADEVIDA + '/' + control.value).then((data: any) => {

            // console.log('Existe: ' + data);
            if (data === true) {
              resolve({ existe: true });
            } else {
              resolve(null);
            }

          }, error => {

            // console.log(`No se pudo validar la existencia de la hoja de vida: ${error}`);
            this.toastService.showError('Información', `No se pudo validar la existencia de la hoja de vida: ${error}`);
          });
        } else {
          resolve(null);
        }

      }
    );

    return promesa;

  }

  /**
   * @author Milton Sanchez
   * @param event
   */
  blurNumeroDocumento(event: any): void {
    // console.log('NumeroDocumento: ' + event.target.value);

    if (event.target.value && this.form.controls['numerodocumento'].valid && !this.isEdit) {

      this.crudService.get(Constants.URL_GET_PERSONA_SUIIN_BY_IDENTIFICACION + '/' + event.target.value).then((data: any) => {

        // console.log('persona suiin: ' + JSON.stringify(data));

        if (null !== data) {


          this.toastService.showSuccess('Información', 'Información traida desde SUIIN');

          // this.form.get('tipodocumento').setValue([data.tipoidentificacion.id]);
          this.form.get('primernombre').setValue(data.primernombre);
          this.form.get('segundonombre').setValue(data.segundonombre);
          this.form.get('numerodocumento').setValue(data.documentoidentificacion);
          this.form.get('primerapellido').setValue(data.primerapellido);
          this.form.get('segundoapellido').setValue(data.segundoapellido);
          this.form.get('correoelectronico').setValue(data.correoelectronico);
          // this.form.get('tipodocumento').setValue([data.tipoidentificacion.id]);
          this.form.get('estadocivil').setValue([data.estadocivil.id]);
          this.form.get('genero').setValue([data.sexo]);
          this.form.get('telefonocasa').setValue(data.telefonocasa);
          this.form.get('telefonomovil').setValue(data.telefonomovil);
          // this.form.get('fechanacimiento').setValue(data.fechanacimiento);

        }


      }, error => {

        // console.log(`No se pudo validar la existencia de la hoja de vida: ${error}`);

        this.toastService.showWarning('Información', `No se pudo obtener la información desde SUIIN, por favor continue: ${error}`);

      });

    }


  }


  /**
   * Formulario principal
   * @author Milton Sanchez
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      id: [''],
      primernombre: ['', [Validators.required, Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
      segundonombre: ['', [Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
      primerapellido: ['', [Validators.required]],
      segundoapellido: [''],
      tipodocumento: ['', [Validators.required]],
      estadocivil: ['', [Validators.required]],
      fechanacimiento: ['', [Validators.required]],
      telefonocasa: ['', [Validators.pattern(Constants.FIJO_VALID)]],
      numerodocumento: ['', [Validators.required, Validators.pattern(Constants.CAMPO_NUMERICO)], this.existeHojadevida.bind(this)],
      genero: ['', [Validators.required]],
      correoelectronico: ['', [Validators.required, Validators.pattern(Constants.CORREO_VALID)]],
      telefonomovil: ['', [Validators.required, Validators.pattern(Constants.TELEFONO_VALID)]],
      profesion: ['', [Validators.required]]
    });

  }


  /**
   * Metodo encargado de cargar todos los catalogos
   * @author Milton Sanchez
   */
  loadCatalogos(): void {
    this.getTipoIdentificacion();
    this.getEstadoCivil();
    this.getProfesion();
    this.getTipoEstusio();
    this.getEntidad();
    this.getCargo();

  }

  /**
   * Metodo para cargar el catalog de tipo identificacion
   * @author Milton Sanchez
   */
  getTipoIdentificacion(): void {
    this.crudService.get(Constants.URL_CATALOGO + '/Tipoidentificacion').then((data: any) => {
      this.lstTipoIdentificacion = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de tipo identificacion: ${error}`);
    });

  }

  /**
   * Metodo para cargar el catalog de estado civil
   * @author Milton Sanchez
   */
  getEstadoCivil(): void {
    this.crudService.get(Constants.URL_CATALOGO + '/Estadocivil').then((data: any) => {
      this.lstEstadoCivil = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de tipo identificacion: ${error}`);
    });

  }

  /**
  * Metodo para cargar el catalog de profesion
  * @author Milton Sanchez
  */
  getProfesion(): void {
    this.crudService.get(Constants.URL_CATALOGO + '/Profesion').then((data: any) => {
      this.lstProfesion = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de Profesion: ${error}`);
    });

  }

  /**
  * Permite armar el objeto que se va ha ebviar al back end, para editar  crear
  * @author Milton Sanchez
  * @param form
  */
  createObject(form: FormGroup): HojadevidaVO {
    const object: HojadevidaVO = new HojadevidaVO();
    if (this.isEdit) { object.id = form.value.id; }
    object.primernombre = form.value.primernombre;
    object.segundonombre = form.value.segundonombre;
    object.primerapellido = form.value.primerapellido;
    object.segundoapellido = form.value.segundoapellido;
    object.tipodocumento = Utils.toInt(form.value.tipodocumento);
    object.estadocivil = Utils.toInt(form.value.estadocivil);
    try {
      object.fechanacimiento = Utils.string_to_date(this.datePipe.transform(this.form.value.fechanacimiento, 'dd/MM/yyyy'));
    } catch (error) {
      object.fechanacimiento = Utils.string_to_date(this.form.value.fechanacimiento);
    }
    object.telefonocasa = form.value.telefonocasa;
    object.numerodocumento = form.value.numerodocumento;
    object.genero = String(form.value.genero);
    object.correoelectronico = form.value.correoelectronico;
    object.telefonomovil = form.value.telefonomovil;
    object.profesion = Utils.toInt(form.value.profesion);
    object.listaExpLaboral = this.isEdit ? this.fijarExpLaboral(this.lstExpLab) : this.form.value.listaExpLaboral;
    object.listaEstudios = this.isEdit ? this.lstEstudio : this.form.value.listaEstudios;
    object.listaSoporte = this.form.value.listaSoporte;
    return object;

  }


  /**
   * Permite guardar una hoja de vida
   *
   * @author Milton Sanchez
   */
  async guardar() {
    try {
      this.form.setControl('listaEstudios', this.formBuilder.array(this.lstEstudio || []));
      this.form.setControl('listaExpLaboral', this.formBuilder.array(this.fijarExpLaboral(this.lstExpLab) || []));

      const lstSoporte: SoporteVO[] = [];
      let soporte: SoporteVO;
      this.loading = true;
      try {
        for (const file of this.lstFiles) {
          const fd = new FormData();
          fd.append('file', file, file.name);
          const response = await this.crudService.uploadFile(fd);
          soporte = new SoporteVO();
          soporte.id = -1;
          soporte.nombre = response.uploadname;
          soporte.tamanio = file.size.toString();
          soporte.tipo = file.type;
          lstSoporte.push(soporte);
        }
      } catch (error) {
        this.toastService.showWarning('Información', 'No fue posible cargar los archivos, por favor comuniquese con el administrador');
      }
      this.form.setControl('listaSoporte', this.formBuilder.array(lstSoporte || []));

      this.crudService.create(Constants.URL_HOJADEVIDA_GUARDAR + '/guardar/', this.createObject(this.form)).then((data: any) => {
        // console.log(data);

        if (JSON.parse(data).respuesta === 'true') {
          this.form.reset();
          this.toastService.showSuccess('Información', 'Registro Exitoso');
          setTimeout(() => {
            this.router.navigate(['hojadevida']);
          }, 3000);
        } else {
          this.toastService.showError('Información', JSON.parse(data).respuesta);
        }

      }, error => {
        console.log(`No se pudo guardar la hoja de vida: ${error}`);
      });
      this.loading = false;
    } catch (error) {
      await this.handleError(error);
    }
  }

  /**
   * Obtiene el error generado
   *
   * @author Milton Sanchez
   * @param error
   */
  public handleError(error) {
    return Observable.throw(error.json().error || 'Server error');

  }

  /**
   * Metodo que sirve para crear o actualizar una hoja de vida
   *
   * @author Milton Sanchez
   */
  save(): void {
    if (this.isEdit) {
      this.actualizar();
    } else {
      this.guardar();
    }

  }

  /**
   * Permite actualizar una hoja de vida
   *
   * @author Milton Sanchez
   */
  async actualizar() {
    // console.log('data: ' + this.form.value);

    const lstSoporte: SoporteVO[] = [];
    let soporte: SoporteVO;
    this.loading = true;
    try {
      for (const file of this.lstFiles) {
        const fd = new FormData();
        fd.append('file', file, file.name);
        const response = await this.crudService.uploadFile(fd);
        soporte = new SoporteVO();
        soporte.id = -1;
        soporte.nombre = response.uploadname;
        soporte.tamanio = file.size.toString();
        soporte.tipo = file.type;
        lstSoporte.push(soporte);
      }
    } catch (error) {
      this.toastService.showWarning('Información', 'No fue posible cargar los archivos, por favor comuniquese con el administrador');
    }
    this.form.setControl('listaSoporte', this.formBuilder.array(lstSoporte || []));

    this.crudService.put(Constants.URL_HOJADEVIDA_ACTUALIZAR + '/actualizar/',
      this.createObject(this.form)).then((data: any) => {

        // console.log('data:' + JSON.stringify(data.respuesta));

        if (data.respuesta === 'true') {
          this.toastService.showSuccess('Información', 'Actualización Exitosa');
          this.cargarSoportes();
        } else {
          this.toastService.showError('Información', data.respuesta);
        }


      });

    this.SoporteCarga.resetListFiles();
    this.loading = false;
  }


  /**
   * Permite armar la lista de experiencia laboral
   *
   * @author Milton Sanchez
   * @param lstItems
   */
  fijarExpLaboral(lstItems: Experiencia[]): Experiencia[] {
    let experiencia: Experiencia;
    const listAux: Experiencia[] = [];

    lstItems.forEach(item => {
      experiencia = new Experiencia();
      experiencia.entidad = item.entidad;
      experiencia.cargo = item.cargo;
      experiencia.fechainicio = this.isEdit ?
        Utils.string_to_date(this.datePipe.transform(item.fechainicio, 'dd/MM/yyyy')) : item.fechainicio;
      experiencia.fechafin = this.isEdit ?
        Utils.string_to_date(this.datePipe.transform(item.fechafin, 'dd/MM/yyyy')) : item.fechafin;
      if (this.isEdit) {
        experiencia.id = item.id;
        experiencia.desentidad = item.desentidad;
        experiencia.desccargo = item.desccargo;
      }
      listAux.push(experiencia);
    });
    // console.log(JSON.stringify(listAux));
    return listAux;

  }

  /**
   * Permite redireccionar al listado principal de hojas de vida
   *
   * @author  Milton Sanchez
   */
  cancelar(): void {
    this.router.navigate(['hojadevida']);

  }


  /*************************************************/
  /************Información Academica****************/
  /*************************************************/

  deleteEstudio(estudio: Estudio): void {
    this.crudService.post(Constants.URL_HOJADEVIDA_DELETE_ESTUDIO, estudio.id).then((data: any) => {
      this.toastService.showSuccess('Información', 'Registro eliminado correctamente');
    }, error => {
      console.log(`No se pudo borrar la informacion: ${error}`);
    });

  }


  /**
   * @author Milton Sanchez
   */
  buildFrmEst(): void {
    this.frmEst = this.formBuilder.group({
      'tipoestudio': ['', Validators.required],
      'label': [''],
      'descripcion': ['', [Validators.required, Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
    });

  }

  /**
     * Metodo para cargar el catalog de tipo estudio
     * @author Milton Sanchez
     */
  getTipoEstusio(): void {
    this.crudService.get(Constants.URL_CATALOGO + '/Tipoestudio').then((data: any) => {
      this.lstTipoEstudio = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de Tipoestudio: ${error}`);
    });

  }

  /**
  * @author Milton Sanchez
  */
  addItemClick(): void {

    this.lstEstudio.push(this.frmEst.value);
    this.frmEst.reset();
    this.toastService.showSuccess('Información', 'Item agregado correctamente');


  }

  /**
    * Metodo que permite eliminar un elemento de la lista
    * @param item
    */
  removeRowClick(item) {
    if (item == null) { return; }
    UtilsGrid.removeRowClick(this.lstEstudio, item);
    if (this.isEdit && item.id > 0) {
      this.deleteEstudio(item);
    }

  }

  /**
   *
   * @param $event
   */
  setTipoEstudio($event: IOption) {
    // console.log($event);
    this.frmEst.controls['label'].setValue($event.label);
  }


  /*************************************************/
  /************Experiencia Laboral******************/
  /*************************************************/

  deleteExpLaboral(experiencia: Experiencia): void {
    this.crudService.post(Constants.URL_HOJADEVIDA_DELETE_EXPLAB, experiencia.id).then((data: any) => {
      this.toastService.showSuccess('Información', 'Registro eliminado correctamente');
    }, error => {
      console.log(`No se pudo borrar la informacion: ${error}`);
    });

  }


  /**
  * Metodo que permite construir el formulario para gestionar la experiencia laboral
  * @author Milton Sanchez
  */
  buildFrmExpLab(): void {
    this.frmExpLab = this.formBuilder.group({
      'entidad': ['', Validators.required],
      'cargo': ['', Validators.required],
      'fechainicio': ['', Validators.required],
      'fechafin': ['', Validators.required],
      'desentidad': ['', Validators.required], // Aux que permiten mostrar la descripcion de la entidad seleccionada
      'desccargo': ['', Validators.required], // Aux que permite mostrar la descripcion del cargo seleccionado
    });

  }


  /**
   * Metodo que permite agregar experiancial laboral a la lista
   *
   * @author Milton Sanchez
   */
  addItemExpLabClick(): void {

    let flag: boolean;
    flag = false;
    this.lstExpLab.forEach(item => {

      if (item.entidad === this.frmExpLab.value.entidad &&
        item.cargo === this.frmExpLab.value.cargo) {
        flag = true;
        this.toastService.showError('Información', 'El item ya se encuentra en la lista');

      }

    });
    if (flag === false) {
      this.lstExpLab.push(this.frmExpLab.value);
      this.frmExpLab.reset();
      this.toastService.showSuccess('Información', 'Item agregado correctamente');
    }

  }

  /**
    * Metodo que permite eliminar un elemento de la lista
    * @param item
    */
  removeRowExpLabClick(item) {
    if (item == null) { return; }
    UtilsGrid.removeRowClick(this.lstExpLab, item);
    if (this.isEdit && item.id > 0) {
      this.deleteExpLaboral(item);
    }

  }


  /**
   * Metodo para cargar el catalog de entidad
   * @author Milton Sanchez
   */
  getEntidad(): void {
    this.crudService.get(Constants.URL_CATALOGO + '/Entidad').then((data: any) => {
      this.lstEntidad = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de cargo: ${error}`);
    });

  }

  /**
    * Metodo para cargar el catalog de entidad
    * @author Milton Sanchez
    */
  getCargo(): void {
    this.crudService.get(Constants.URL_CATALOGO + '/Cargo').then((data: any) => {
      this.lstCargo = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de cargo: ${error}`);
    });

  }


  /**
  *
  * @param $event
  */
  setEntidad($event: IOption) {
    // console.log($event);
    this.frmExpLab.controls['desentidad'].setValue($event.label);
  }


  /**
   *
   * @param $event
   */
  setCargo($event: IOption) {
    // console.log($event);
    this.frmExpLab.controls['desccargo'].setValue($event.label);
  }


  /**************************/
  /*******SOPORTES***********/
  /**************************/

  obtenerFiles(event) {
    this.lstFiles = event;
    // console.log(this.lstFiles);

  }

  // Getters of form
  // Frm principal
  get id() { return this.form.get('id'); }
  get primernombre() { return this.form.get('primernombre'); }
  get segundonombre() { return this.form.get('segundonombre'); }
  get primerapellido() { return this.form.get('primerapellido'); }
  get segundoapellido() { return this.form.get('segundoapellido'); }
  get tipodocumento() { return this.form.get('tipodocumento'); }
  get estadocivil() { return this.form.get('estadocivil'); }
  get fechanacimiento() { return this.form.get('fechanacimiento'); }
  get telefonocasa() { return this.form.get('telefonocasa'); }
  get numerodocumento() { return this.form.get('numerodocumento'); }
  get genero() { return this.form.get('genero'); }
  get correoelectronico() { return this.form.get('correoelectronico'); }
  get telefonomovil() { return this.form.get('telefonomovil'); }
  get profesion() { return this.form.get('profesion'); }
  // Frm estudios
  get tipoestudio() { return this.frmEst.get('tipoestudio'); }
  get descripcion() { return this.frmEst.get('descripcion'); }
  // Frm Experianecia Laboral
  get entidad() { return this.frmExpLab.get('entidad'); }
  get cargo() { return this.frmExpLab.get('cargo'); }
  get fechainicio() { return this.frmExpLab.get('fechainicio'); }
  get fechafin() { return this.frmExpLab.get('fechafin'); }


}
