import { element } from 'protractor';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CrudService } from '../../../framework/services/crud.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constants, Utils } from '../../../framework/util/utils';
import { Catalogo } from '../../../models/catalogo';
import { HojadeVidaBusquedaVO } from '../../../models/HojadeVidaBusquedaVO';
import { Router, ActivatedRoute } from '@angular/router';
import { ContratoVO } from '../../../models/contratoVO';
import { EditarContratoVO } from '../../../models/EditarContratoVO';
import { ToastService } from '../../../framework/services/toast.service';
import { DatePipe } from '@angular/common';
import { Novedad } from '../../../models/Novedad';
import { UtilsGrid } from '../../../framework/util/utils-grid';
import { IOption } from '../../../../../node_modules/ng-select';
import { MingaService } from '../../../framework/services/minga.service';
import { Usuario } from 'src/app/models/usuario';
import { LoginService } from 'src/app/framework/services/login.service';

@Component({
  selector: 'app-contratos-datosgenerales',
  templateUrl: './contratos-datosgenerales.component.html',
  styleUrls: ['./contratos-datosgenerales.component.css'],
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
export class ContratosDatosgeneralesComponent implements OnInit {
  // pruebass editor
  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: String = '';
  @ViewChild('myckeditor') ckeditor: any;

  // Formularios
  public form: FormGroup;
  public formb: FormGroup;
  public formN: FormGroup;
  public user: Usuario;

  // objetos
  private hojadeVidaBusquedaVO: HojadeVidaBusquedaVO;
  private contratoVO: ContratoVO;
  private editarContratoVO: EditarContratoVO;
  // listas
  public listCargo: Catalogo[] = [];
  public listTipoNovedad: Catalogo[] = [];
  public listArea: Catalogo[] = [];
  public listArl: Catalogo[] = [];
  public listFondoPension: Catalogo[] = [];
  public listSede: Catalogo[] = [];
  public listTipoContrato: Catalogo[] = [];
  public listEstadoContrato: Catalogo[] = [];
  public lisEps: Catalogo[] = [];
  public listNovedades: Novedad[] = [];
  public listEstudios: any[] = []; // Lista de estudios de minga para tejer
  public listExperiencia: any[] = []; // Lista de experiencia de minga para tejer

  // variables
  public idContrato;
  public flat: boolean;
  public oneAtATime: boolean;
  public isFirstDisabled = false;
  fechaIni: Date = new Date();
  fechaminDate: Date = new Date();


  constructor(
    private formBuilder: FormBuilder,
    private formBuilderB: FormBuilder,
    private route: ActivatedRoute,
    private crudService: CrudService,
    private router: Router,
    public toastService: ToastService,
    private datePipe: DatePipe,
    public loginService: LoginService,
    private mingaService: MingaService // Servicio que permite buscar el curriculum de una persona
  ) {
    this.hojadeVidaBusquedaVO = new HojadeVidaBusquedaVO();
    this.contratoVO = new ContratoVO();
    this.editarContratoVO = new EditarContratoVO();
    this.flat = false;
    this.oneAtATime = true;
    this.user = new Usuario(null, null, null, null, null, null);
  }

  ngOnInit() {
    this.cargarUsuario();
    this.consecutivo();
    this.buildFormB();
    this.buildForm();
    this.buildFormnN();
    this.loadCatalogos();
    this.idContrato = this.route.snapshot.paramMap.get('id');
    this.prepararEditar();
    // pruebasss editor
    this.ckeConfig = Constants.CHECK_CONFIG;
  }

  onChange($event: any): void {
    console.log('onChange');
  }

  consecutivo(): void {
    this.crudService.get(Constants.URL_CONSECUTIVO_CONTRATO + this.user.idSede).then((data: any) => {
      this.form.controls['numeroContrato'].setValue(data.respuesta);
    }, error => {
      console.log(`No se pudo el consecutivo: ${error}`);
    });
  }

  /**
   * cargar usuario login
   */
  cargarUsuario(): void {
    if (localStorage.getItem('user')) {
      const data = JSON.parse(localStorage.getItem('user'));
      this.user.primernombre = data.primernombre;
      this.user.primerapellido = data.primerapellido;
      this.user.login = data.login;
      this.user.idSede = data.idSede;
    }
  }

  prepararEditar(): void {
    if (this.idContrato != null) {
      this.flat = true;
      this.crudService.post(Constants.URL_BUSCAR_CONTRATO_EDITAR, this.idContrato).then((data: any) => {
        if (data.length < 1) {
        } else {
          this.contratoVO = data;
          this.formb.controls['identificacion'].setValue(this.contratoVO.documentoidentificacion);
          this.buscarHojaVida();
          this.formb.controls['identificacion'].disable();
          this.settearContrato(this.contratoVO);
          this.disablePersonalInformation();
          this.disabledDotacion(this.form.value.salario);
          this.formN.controls['contratoNovedad'].setValue(this.idContrato);
        }
      });
      // carga catalogo tipo novedad
      this.getTipoNovedadCatalogo('/Tiponovedad');
      // Carga novedad
      this.cargarlistaNovedad(this.idContrato);
      // setea el contrato para la novedad
    } else {
      this.flat = false;
    }
  }

  /**
   * metodo para cargar novedades
   */
  cargarlistaNovedad(idContrato): void {
    if (idContrato != null) {
      this.crudService.get(Constants.URL_NOVEDADES_BUSQUEDA + idContrato).then((data: any) => {
        this.listNovedades = data;
      }, error => {
        console.log(`No se pudo obtener la informacion de novedadaes: ${error}`);
      });
    }
  }

  /**
   * cargue catalogos
   */
  loadCatalogos(): void {
    this.getCargoCatalogo('/Cargo');
    this.getAreaCatalogo('/Area');
    this.getArlCatalogo('/Arl');
    this.getFondoPensionCatalogo('/FondoPension');
    this.getSedeCatalogo('/Sede');
    this.getTipoContratoCatalogo('/TipoContrato');
    this.getEstadoContratoCatalogo('/Estadocontrato');
    this.getEstadoEpsCatalogo('/Eps');

  }

  buildFormB(): void {
    this.formb = this.formBuilderB.group({
      primernombre: ['', [Validators.required]],
      segundonombre: ['', [Validators.required]],
      primerapellido: ['', [Validators.required]],
      segundoapellido: ['', [Validators.required]],
      tipodocumento: ['', [Validators.required]],
      numerodocumento: ['', [Validators.required]],
      identificacion: ['', [Validators.required, Validators.pattern(Constants.CAMPO_SALARIO)]],
      sexo: [''],
      email: [''],
      fechanacimiento: [''],
      telefonomovil: ['']
    });
  }

  disablePersonalInformation(): void {
    this.form.controls['numeroContrato'].disable();
    this.form.controls['objetivo'].disable();
    this.form.controls['fechaInicio'].disable();
    this.form.controls['fechaFin'].disable();
  }

  /**
   *
   * @param contratoVO llenarObjeto contrato
   */
  settearContrato(contratoVO): void {
    this.form.controls['contrato'].setValue(contratoVO.contrato);
    this.form.controls['cargo'].setValue([contratoVO.cargo]);
    this.form.controls['area'].setValue([contratoVO.area]);
    this.form.controls['arl'].setValue([contratoVO.arl]);
    this.form.controls['fondoPension'].setValue([contratoVO.fondoPension]);
    this.form.controls['sede'].setValue([contratoVO.sede]);
    this.form.controls['tipoContrato'].setValue([contratoVO.tipoContrato]);
    this.form.controls['estadoContrato'].setValue([contratoVO.estadoContrato]);
    this.form.controls['eps'].setValue([contratoVO.eps]);
    this.form.controls['numeroContrato'].setValue(contratoVO.numeroContrato);
    this.form.controls['objetivo'].setValue(contratoVO.objetivo);
    this.form.controls['fechaInicio'].setValue(Utils.string_to_date(contratoVO.fechaInicio));
    this.form.controls['fechaFin'].setValue(Utils.string_to_date(contratoVO.fechaFin));
    this.form.controls['salario'].setValue(contratoVO.salario);
    this.form.controls['tallaCamisa'].setValue(contratoVO.tallaCamisa);
    this.form.controls['tallaPantalon'].setValue(contratoVO.tallaPantalon);
    this.form.controls['tallaCalzado'].setValue(contratoVO.tallaCalzado);
    this.form.controls['doccontrato'].setValue(contratoVO.doccontrato);
  }
  /**
   * formulario noveddaes
   */
  buildFormnN(): void {
    this.formN = this.formBuilder.group({
      'contratoNovedad': [''],
      'tipoNovedad': ['', Validators.required],
      'codigo': ['', [Validators.required, Validators.pattern(Constants.CAMPO_NUMERO)]],
      'label': [''],
      'descripcion': ['', [Validators.required, Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
    });
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      hojaVida: [''],
      numeroContrato: ['', [Validators.required, Validators.pattern(Constants.ESPECIAL)]],
      cargo: ['', [Validators.required]],
      area: ['', [Validators.required]],
      arl: ['', [Validators.required]],
      eps: ['', [Validators.required]],
      fondoPension: ['', [Validators.required]],
      sede: ['', [Validators.required]],
      tipoContrato: ['', [Validators.required]],
      estadoContrato: ['', [Validators.required]],
      objetivo: ['', [Validators.required, Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      salario: ['', [Validators.required, Validators.pattern(Constants.CAMPO_SALARIO)]],
      tallaCamisa: ['', [Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
      tallaPantalon: ['', [Validators.pattern(Constants.CAMPO_TALLAC)]],
      tallaCalzado: ['', [Validators.pattern(Constants.CAMPO_TALLAC)]],
      contrato: [''],
      doccontrato: [''],
    });
  }

  /**
   * metodo para inhabilitar seccion de dotación
   * @param event
   */
  onBlur(event: any) { // without type info
    if (event.target.value >= 1562484) {
      this.isFirstDisabled = true;
    } else {
      this.isFirstDisabled = false;
    }
  }
  /**
   * Meotodo inhabilita dotación
   * @param dotacion i
   */
  disabledDotacion(dotacion): void {
    if (dotacion >= 1562484) {
      this.isFirstDisabled = true;
    } else {
      this.isFirstDisabled = false;
    }
  }

  /**
   * getTipoNovedadCatalogo
   * @param entidad
   */
  getTipoNovedadCatalogo(entidad): void {
    this.crudService.get(Constants.URL_CATALOGO + entidad).then((data: any) => {
      this.listTipoNovedad = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de tipo cargo: ${error}`);
    });
  }
  /**
   * cat cargo
   */
  getCargoCatalogo(entidad): void {
    this.crudService.get(Constants.URL_CATALOGO + entidad).then((data: any) => {
      this.listCargo = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de tipo cargo: ${error}`);
    });
  }
  /**
   * cat area
   */
  getAreaCatalogo(entidad): void {
    this.crudService.get(Constants.URL_CATALOGO + entidad).then((data: any) => {
      this.listArea = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de tipo cargo: ${error}`);
    });
  }

  /**
   * cat arl
   */
  getArlCatalogo(entidad): void {
    this.crudService.get(Constants.URL_CATALOGO + entidad).then((data: any) => {
      this.listArl = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de tipo cargo: ${error}`);
    });
  }

  /**
   * cat fondo de pensión
   */
  getFondoPensionCatalogo(entidad): void {
    this.crudService.get(Constants.URL_CATALOGO + entidad).then((data: any) => {
      this.listFondoPension = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de tipo cargo: ${error}`);
    });
  }
  /**
   * cat sede
   */
  getSedeCatalogo(entidad): void {
    this.crudService.get(Constants.URL_CATALOGO + entidad).then((data: any) => {
      this.listSede = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de tipo cargo: ${error}`);
    });
  }
  /**
   * catalogo tipo contrato
   */
  getTipoContratoCatalogo(entidad): void {
    this.crudService.get(Constants.URL_CATALOGO + entidad).then((data: any) => {
      this.listTipoContrato = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de tipo cargo: ${error}`);
    });
  }
  /**
   * catalogo estado contrato
   */
  getEstadoContratoCatalogo(entidad): void {
    this.crudService.get(Constants.URL_CATALOGO + entidad).then((data: any) => {
      this.listEstadoContrato = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de tipo cargo: ${error}`);
    });
  }

  /**
   * getEstadoEpsCatalogo
   */
  getEstadoEpsCatalogo(entidad): void {
    this.crudService.get(Constants.URL_CATALOGO + entidad).then((data: any) => {
      this.lisEps = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de tipo cargo: ${error}`);
    });
  }

  /**
   * agredar iten lista noveddaes
   */
  addItemClick(): void {
    this.listNovedades.push(this.formN.value);
    this.guardarNovedad(this.formN.value);
    this.formN.reset();
    this.toastService.showSuccess('Información', 'Item agregado correctamente');
  }

  /**
   * elimina objeto de la lista noveddaes
   * @param item
   */
  removeRowClick(item) {
    if (item == null) { return; }
    UtilsGrid.removeRowClick(this.listNovedades, item);
    if (this.flat && item.contratoNovedad > 0) {
      this.deleteNovedad(item);
    }
  }

  /**
   * deleteNovedad
   * @param novedad
   */
  deleteNovedad(novedad: Novedad): void {
    this.crudService.post(Constants.URL_HOJADEVIDA_DELETE_NOVEDAD, '').then((data: any) => {
      this.toastService.showSuccess('Información', 'Registro eliminado correctamente');
    }, error => {
      console.log(`No se pudo borrar la informacion: ${error}`);
    });

  }

  /**
   * setea tipo de novedad del cbx
   * @param $event
   */
  setTipoNovedad($event: IOption) {
    this.formN.controls['label'].setValue($event.label);
  }

  /**
   * @author Whilmer Fernandez
   * Permite obtener una hoja de vida pararealizar un contrato
   *
   * @author Milton Sanchez
   * 03/01/2018
   * Se modifica para que permita obtener la hoja de vida desde Minga para tejer
   *
   * Metodo para buscar hoja de vida
   */
  buscarHojaVida(): void {

    this.mingaService.getCurriculumXIdentificacion(this.formb.value.identificacion)
      .subscribe((data: any) => {
        this.hojadeVidaBusquedaVO.primernombre = data.curriculum.nom1;
        this.hojadeVidaBusquedaVO.segundonombre = data.curriculum.nom2;
        this.hojadeVidaBusquedaVO.primerapellido = data.curriculum.ape1;
        this.hojadeVidaBusquedaVO.segundoapellido = data.curriculum.ape2;
        this.hojadeVidaBusquedaVO.numerodocumento = data.curriculum.num_doc;
        this.hojadeVidaBusquedaVO.tipodocumento = data.curriculum.tip_doc;
        this.hojadeVidaBusquedaVO.sexo = data.curriculum.genero;
        this.hojadeVidaBusquedaVO.correoelectronico = data.curriculum.email;
        this.hojadeVidaBusquedaVO.fechanacimiento = data.curriculum.fecha_nac;
        this.hojadeVidaBusquedaVO.telefonomovil = data.curriculum.celular.replace(/\D+/g, '');
        this.listEstudios = data.estudios;
        this.listExperiencia = data.experiencia;
        this.settearHojadevida(this.hojadeVidaBusquedaVO);
      });

  }



  /**
   * llenar objeto hoja de vida
   * @param hojadeVidaBusqueda
   */
  settearHojadevida(hojadeVidaBusquedaVO): void {
    this.formb.controls['primernombre'].setValue(hojadeVidaBusquedaVO.primernombre);
    this.formb.controls['segundonombre'].setValue(hojadeVidaBusquedaVO.segundonombre);
    this.formb.controls['primerapellido'].setValue(hojadeVidaBusquedaVO.primerapellido);
    this.formb.controls['segundoapellido'].setValue(hojadeVidaBusquedaVO.segundoapellido);
    this.formb.controls['tipodocumento'].setValue(hojadeVidaBusquedaVO.tipodocumento);
    this.formb.controls['numerodocumento'].setValue(hojadeVidaBusquedaVO.numerodocumento);
    this.formb.controls['sexo'].setValue(hojadeVidaBusquedaVO.sexo);
    this.formb.controls['email'].setValue(hojadeVidaBusquedaVO.correoelectronico);
    this.formb.controls['fechanacimiento'].setValue(hojadeVidaBusquedaVO.fechanacimiento);
    this.formb.controls['telefonomovil'].setValue(hojadeVidaBusquedaVO.telefonomovil);
  }

  /**
   * verificarArray
   * @param objetc
   * @param nomVar
   */
  verifyArray(objetc, nomVar): number {
    if (objetc instanceof Array) {
      return this.form.get(nomVar).value[0];
    }
    return objetc;
  }

  /**
   * crearObjetoEditar
   */
  createObject(form: FormGroup, editMode: boolean) {
    this.editarContratoVO = new EditarContratoVO();
    this.editarContratoVO.contrato = form.value.contrato;
    this.editarContratoVO.hojaVida = form.value.hojaVida;
    this.editarContratoVO.cargo = this.verifyArray(form.value.cargo, 'cargo');
    this.editarContratoVO.area = this.verifyArray(form.value.area, 'area');
    this.editarContratoVO.arl = this.verifyArray(form.value.arl, 'arl');
    this.editarContratoVO.fondoPension = this.verifyArray(form.value.fondoPension, 'fondoPension');
    this.editarContratoVO.sede = this.verifyArray(form.value.sede, 'sede');
    this.editarContratoVO.tipoContrato = this.verifyArray(form.value.tipoContrato, 'tipoContrato');
    this.editarContratoVO.estadoContrato = this.verifyArray(form.value.estadoContrato, 'estadoContrato');
    this.editarContratoVO.eps = this.verifyArray(form.value.eps, 'eps');
    this.editarContratoVO.salario = form.value.salario;
    this.editarContratoVO.tallaCamisa = form.value.tallaCamisa;
    this.editarContratoVO.tallaPantalon = form.value.tallaPantalon;
    this.editarContratoVO.tallaCalzado = form.value.tallaCalzado;
    this.editarContratoVO.doccontrato = form.value.doccontrato;

    if (editMode === false) {
      this.editarContratoVO.persona = this.hojadeVidaBusquedaVO;
      this.editarContratoVO.numeroContrato = this.form.value.numeroContrato;
      this.editarContratoVO.objetivo = this.form.value.objetivo;
      this.editarContratoVO.fechaInicio = this.form.value.fechaInicio;
      this.editarContratoVO.fechaFin = this.form.value.fechaFin;
    }

  }

  /**
   * Metodo para guardar o editar objeto contrato
   * @param url
   */
  guardar(): void {
    if (this.flat) {
      this.createObject(this.form, true);
      this.crudService.put(Constants.URL_CONTRATO_GUARDAR + '/editar/', this.editarContratoVO).then((data: any) => {

        if (data.respuesta === 'true') {
          this.toastService.showSuccess('Información', 'Actualización Exitosa');
        } else {
          this.toastService.showError('Información', data.respuesta);
        }
      });
    } else {
      this.createObject(this.form, false);

      this.crudService.create(Constants.URL_CONTRATO_GUARDAR + '/guardar/', this.editarContratoVO).then((data: any) => {

        if (JSON.parse(data).respuesta === 'true') {
          this.form.reset();
          this.formb.reset();
          this.toastService.showSuccess('Información', 'Registro Exitoso');
          setTimeout(() => {
            this.router.navigate(['contratos']);
          }, 2000);
        } else {

          this.toastService.showError('Información', JSON.parse(data).respuesta);
        }
      }, error => {

        console.log(`No se pudo guardar el contrato: ${error}`);
      });
    }
  }


  /**
   * metodo para guardar Novedad contrato
   */
  guardarNovedad(parameter): void {
    this.crudService.create(Constants.URL_CONTRATO_GUARDAR + '/guardarNovedad/', parameter).then((data: any) => {
      this.formN.reset();
    }, error => {
      console.log(`No se pudo guardar novedad: ${error}`);
    });
  }


  /**
   * cancelar
   */
  cancelar(): void {
    this.router.navigate(['contratos']);
  }


  // Getters of form
  // variables para contrato
  get cargo() { return this.form.get('cargo'); }
  get area() { return this.form.get('area'); }
  get arl() { return this.form.get('arl'); }
  get eps() { return this.form.get('eps'); }
  get fondoPension() { return this.form.get('fondoPension'); }
  get sede() { return this.form.get('sede'); }
  get doccontrato() { return this.form.get('doccontrato'); }
  get tipoContrato() { return this.form.get('tipoContrato'); }
  get estadoContrato() { return this.form.get('estadoContrato'); }
  get numeroContrato() { return this.form.get('numeroContrato'); }
  get objetivo() { return this.form.get('objetivo'); }
  get fechaInicio() { return this.form.get('fechaInicio'); }
  get fechaFin() { return this.form.get('fechaFin'); }
  get salario() { return this.form.get('salario'); }
  get hojaVida() { return this.form.get('hojaVida'); }
  get contrato() { return this.form.get('contrato'); }
  // variables busqueda hoja de vida
  get primernombre() { return this.formb.get('primernombre'); }
  get segundonombre() { return this.formb.get('segundonombre'); }
  get primerapellido() { return this.formb.get('primerapellido'); }
  get segundoapellido() { return this.formb.get('segundoapellido'); }
  get tipodocumento() { return this.formb.get('tipodocumento'); }
  get identificacion() { return this.formb.get('identificacion'); }
  get numerodocumento() { return this.formb.get('numerodocumento'); }
  get sexo() { return this.formb.get('sexo'); }
  get email() { return this.formb.get('email'); }
  get fechanacimiento() { return this.formb.get('fechanacimiento'); }
  get telefonomovil() { return this.formb.get('telefonomovil'); }
  // variables dotación
  get tallaCamisa() { return this.form.get('tallaCamisa'); }
  get tallaPantalon() { return this.form.get('tallaPantalon'); }
  get tallaCalzado() { return this.form.get('tallaCalzado'); }
  // variables de novedades
  // get id() { return this.formN.get('id'); }
  get tipoNovedad() { return this.formN.get('tipoNovedad'); }
  get codigo() { return this.formN.get('codigo'); }
  get label() { return this.formN.get('label'); }
  get descripcion() { return this.formN.get('descripcion'); }
  get contratoNovedad() { return this.formN.get('contratoNovedad'); }
}
