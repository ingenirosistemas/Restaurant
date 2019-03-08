import { Component, OnInit, ViewChild } from '@angular/core';
import { Catalogo } from '../../../models/catalogo';
import { FormGroup, FormBuilder, Validators } from '../../../../../node_modules/@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from '../../../framework/services/crud.service';
import { Constants, Utils } from '../../../framework/util/utils';
import { ToastService } from '../../../framework/services/toast.service';
import { DatePipe } from '../../../../../node_modules/@angular/common';
import { OtroSiVO } from '../../../models/OtroSI';
import { MingaService } from '../../../framework/services/minga.service';
@Component({
  selector: 'app-otrosi',
  templateUrl: './otrosi.component.html',
  styleUrls: ['./otrosi.component.css']
})
export class OtrosiComponent implements OnInit {
  // pruebass editor
  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: String = '';
  @ViewChild('myckeditor') ckeditor: any;
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
  public lisOtroSi: Catalogo[] = [];
  public listEstudios: any[] = []; // Lista de estudios de minga para tejer
  public listExperiencia: any[] = []; // Lista de experiencia de minga para tejer
  // Formularios
  public form: FormGroup;
  // variables
  public idContrato;
  public isFirstDisabled = false;
  public isDisabledConsecutive = false;
  private otroSiVo: OtroSiVO;
  constructor(
    private crudService: CrudService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public toastService: ToastService,
    private datePipe: DatePipe,
    private mingaService: MingaService
  ) { }

  ngOnInit() {
    console.log('Init contratos');
    this.loadCatalogos();
    this.buildForm();
    this.idContrato = this.route.snapshot.paramMap.get('id');
    this.buscarContratos(this.idContrato);
    this.ckeConfig = Constants.CHECK_CONFIG;
  }

  buscarHojaVida(identificacion): void {

    this.mingaService.getCurriculumXIdentificacion(identificacion)
      .subscribe((data: any) => {
        this.form.controls['primernombre'].setValue(data.curriculum.nom1);
        this.form.controls['segundonombre'].setValue(data.curriculum.nom2);
        this.form.controls['primerapellido'].setValue(data.curriculum.ape1);
        this.form.controls['segundoapellido'].setValue(data.curriculum.ape2);
        this.form.controls['tipodocumento'].setValue(data.curriculum.tip_doc);
        this.form.controls['numerodocumento'].setValue(data.curriculum.num_doc);
        this.form.controls['sexo'].setValue(data.curriculum.genero);
        this.form.controls['email'].setValue(data.curriculum.email);
        this.form.controls['fechanacimiento'].setValue(data.curriculum.fecha_nac);
        this.form.controls['telefonomovil'].setValue(data.curriculum.celular.replace(/\D+/g, ''));
        this.listEstudios = data.estudios;
        this.listExperiencia = data.experiencia;
      });

  }


  buscarContratos(idContrato): void {
    if (idContrato != null) {
      this.crudService.get(Constants.URL_BUSCAR_OTRO_SI + idContrato).then((data: any) => {
        this.settearContrato(data);
        if (data.otroSi > 0) {
          this.isDisabledConsecutive = true;
          this.disableControls(true);
          console.log('consecutivo ' + data.consecutivo);
        } else {
          this.isDisabledConsecutive = false;
          this.disableControls(false);
        }
      }, error => {
        console.log(`No se pudo obtener la informacion de novedadaes: ${error}`);
      });
    }
  }

  disablePersonalInformation(): void {
    this.form.controls['catOtroSi'].enable();
    this.form.controls['cargo'].enable();
    this.form.controls['area'].enable();
    this.form.controls['contrato'].enable();
    this.form.controls['hojaVida'].enable();
    this.form.controls['idDotacion'].enable();
    this.form.controls['salario'].enable();
  }

  disableControls(disable): void {
    if (disable) {
      this.form.disable();
    } else {
      this.form.disable();
      this.disablePersonalInformation();
    }

  }

  settearContrato(contrato): void {
    this.buscarHojaVida(contrato.numIdentificacion);
    this.form.controls['contrato'].setValue(contrato.id);
    this.form.controls['cargo'].setValue([contrato.cargo]);
    this.form.controls['area'].setValue([contrato.area]);
    this.form.controls['arl'].setValue([contrato.arl]);
    this.form.controls['fondoPension'].setValue([contrato.fondoPension]);
    this.form.controls['sede'].setValue([contrato.sede]);
    this.form.controls['tipoContrato'].setValue([contrato.tipoContrato]);
    this.form.controls['estadoContrato'].setValue([contrato.estadoContrato]);
    this.form.controls['eps'].setValue([contrato.eps]);
    this.form.controls['tallaCamisa'].setValue(contrato.tallaCamisa);
    this.form.controls['tallaPantalon'].setValue(contrato.tallaPantalon);
    this.form.controls['tallaCalzado'].setValue(contrato.tallaCalzado);
    this.form.controls['doccontrato'].setValue(contrato.doccontrato);
    this.form.controls['hojaVida'].setValue(contrato.hojaVida);
    this.form.controls['catOtroSi'].setValue([contrato.otroSi]);
    this.form.controls['numeroContrato'].setValue(contrato.numeroContrato);
    this.form.controls['objetivo'].setValue(contrato.objetivo);
    this.form.controls['fechaInicio'].setValue(Utils.string_to_date(contrato.fechaInicio));
    this.form.controls['fechaFin'].setValue(Utils.string_to_date(contrato.fechaFin));
    this.form.controls['salario'].setValue(contrato.salario);
    this.form.controls['idDotacion'].setValue(contrato.idDotacion);
    this.form.controls['generatorCons'].setValue(contrato.consecutivo);
    this.form.controls['consecutive'].setValue(contrato.consecutivo);
  }

  loadCatalogos(): void {
    this.getCargoCatalogo('/Cargo');
    this.getAreaCatalogo('/Area');
    this.getArlCatalogo('/Arl');
    this.getFondoPensionCatalogo('/FondoPension');
    this.getSedeCatalogo('/Sede');
    this.getTipoContratoCatalogo('/TipoContrato');
    this.getEstadoContratoCatalogo('/Estadocontrato');
    this.getEstadoEpsCatalogo('/Eps');
    this.getEstadoCatOtroSiCatalogo('/Catotrosi');

  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      primernombre: [''],
      segundonombre: [''],
      primerapellido: [''],
      segundoapellido: [''],
      tipodocumento: [''],
      numerodocumento: [''],
      identificacion: ['', [Validators.pattern(Constants.CAMPO_SALARIO)]],
      hojaVida: [''],
      numeroContrato: ['', [Validators.pattern(Constants.ESPECIAL)]],
      cargo: ['', [Validators.required]],
      area: ['', [Validators.required]],
      arl: [''],
      eps: [''],
      fondoPension: [''],
      sede: [''],
      tipoContrato: [''],
      estadoContrato: [''],
      objetivo: ['', [Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
      fechaInicio: [''],
      fechaFin: [''],
      salario: ['', [Validators.required, Validators.pattern(Constants.CAMPO_SALARIO)]],
      tallaCamisa: ['', [Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
      tallaPantalon: ['', [Validators.pattern(Constants.CAMPO_TALLAC)]],
      tallaCalzado: ['', [Validators.pattern(Constants.CAMPO_TALLAC)]],
      contrato: [''],
      doccontrato: [''],
      catOtroSi: ['', [Validators.required]],
      idDotacion: [''],
      generatorCons: [''],
      consecutive: [''],
      sexo: [''],
      email: [''],
      fechanacimiento: [''],
      telefonomovil: ['']
    });
  }
  /**
   * getTipoNovedadCatalogo
   * @param entidad
   */
  getEstadoCatOtroSiCatalogo(entidad): void {
    this.crudService.get(Constants.URL_CATALOGO + entidad).then((data: any) => {
      this.lisOtroSi = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de tipo Otrosi: ${error}`);
    });
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
 * cancelar
 */
  cancelar(): void {
    this.router.navigate(['contratos']);
  }
  verifyArray(objetc, nomVar): number {
    if (objetc instanceof Array) {
      return this.form.get(nomVar).value[0];
    }
    return objetc;
  }
  /**
 * metodo para inhabilitar seccion de dotación
 * @param event
 */
  onBlur(event: any) { // without type info
    console.log('Prueba onKey ' + event.target.value);
    if (event.target.value >= 1562484) {
      this.isFirstDisabled = true;
    } else {
      this.isFirstDisabled = false;
    }
  }

  onChange($event: any): void {
    console.log('onChange');
  }

  crearObjetoEditar(): void {
    this.otroSiVo = new OtroSiVO();
    this.otroSiVo.id = this.form.value.contrato;
    this.otroSiVo.hojaVida = this.form.value.hojaVida;
    this.otroSiVo.numeroContrato = this.form.value.numeroContrato;
    this.otroSiVo.cargo = this.verifyArray(this.form.value.cargo, 'cargo');
    this.otroSiVo.area = this.verifyArray(this.form.value.area, 'area');
    this.otroSiVo.salario = this.form.value.salario;
    this.otroSiVo.tallaCamisa = this.form.value.tallaCamisa;
    this.otroSiVo.tallaPantalon = this.form.value.tallaPantalon;
    this.otroSiVo.tallaCalzado = this.form.value.tallaCalzado;
    this.otroSiVo.doccontrato = this.form.value.doccontrato;
    this.otroSiVo.catOtroSi = this.verifyArray(this.form.value.catOtroSi, 'catOtroSi');
    this.otroSiVo.idDotacion = this.form.value.idDotacion;
    this.otroSiVo.generatorCons = this.form.value.generatorCons;
  }

  /**
   * Metodo para guardar o editar objeto contrato
   * @param url
   */
  guardar(): void {
    this.form.controls['generatorCons'].enable();
    this.crearObjetoEditar();
    this.crudService.create(Constants.URL_CONTRATO_GUARDAR + '/guardarOtroSi/', this.otroSiVo).then((data: any) => {
      console.log(data);
      this.form.reset();
      this.toastService.showSuccess('Información', 'Registro Exitoso');
      setTimeout(() => {
        this.router.navigate(['contratos']);
      }, 1000);

    }, error => {
      console.log(`No se pudo guardar la hoja de vida: ${error}`);
    });
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
  get primernombre() { return this.form.get('primernombre'); }
  get segundonombre() { return this.form.get('segundonombre'); }
  get primerapellido() { return this.form.get('primerapellido'); }
  get segundoapellido() { return this.form.get('segundoapellido'); }
  get tipodocumento() { return this.form.get('tipodocumento'); }
  get identificacion() { return this.form.get('identificacion'); }
  get numerodocumento() { return this.form.get('numerodocumento'); }
  get tallaCamisa() { return this.form.get('tallaCamisa'); }
  get tallaPantalon() { return this.form.get('tallaPantalon'); }
  get tallaCalzado() { return this.form.get('tallaCalzado'); }
  get catOtroSi() { return this.form.get('catOtroSi'); }
  get gethojaVida() { return this.form.get('hojaVida'); }
  get idDotacion() { return this.form.get('idDotacion'); }
  get generatorCons() { return this.form.get('generatorCons'); }
  get consecutive() { return this.form.get('consecutive'); }
  get sexo() { return this.form.get('sexo'); }
  get email() { return this.form.get('email'); }
  get fechanacimiento() { return this.form.get('fechanacimiento'); }
  get telefonomovil() { return this.form.get('telefonomovil'); }

}

