import { ToastService } from './../../framework/services/toast.service';
import { CrudService } from './../../framework/services/crud.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../../framework/util/utils';
import { Catalogo } from '../../models/catalogo';

@Component({
  selector: 'app-llegadatarde',
  templateUrl: './llegadatarde.component.html',
  styleUrls: ['./llegadatarde.component.css']
})
export class LlegadatardeComponent implements OnInit {

  lstLlegadastarde: any[];
  public rowsOnPage = 5;
  public form: FormGroup;


  // catalogos para busqueda avanzada
  public TipoTardanza: Catalogo[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private crudService: CrudService,
    public toastService: ToastService
  ) {
    this.lstLlegadastarde = [];
  }

  ngOnInit() {
    this.buildForm();
    console.log(Constants.URL_BUSCAR_CONTRATO);
    this.getListaLlegadasTarde();
    this.loadCatalogos();
  }

  limpiar(): void {
    if (this.form.touched) {
      this.form.reset();
      this.getListaLlegadasTarde();
    }

  }
  buildForm(): void {
    this.form = this.formBuilder.group({
      numerodocumento: ['', [Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.maxLength(11), Validators.minLength(7)]],
      nombrecompleto: ['', [Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
      tipotardanza: [],
    });

  }

  /**
   *  Metodo para cargar el listado de llegdas tarde
   * @author LAngie
   */

  getListaLlegadasTarde(): void {
    this.crudService.post(Constants.URL_LLEGADATARDE_LISTA, this.form.value).then((data: any) => {
      this.lstLlegadastarde = data;
      console.log(data);
    }, error => {
      console.log(`No se pudo obtener la informacion de hojas de vida: ${error}`);
    });
  }
  /**
   * buscarllegadas tarde
   */
  buscarLLegadas() {
    this.crudService.post(Constants.URL_LLEGADATARDE_LISTA, this.form.value).then((data: any) => {
      if (data.length < 1) {
        this.toastService.showInfo('No se encontraron registros');
        this.lstLlegadastarde = [];
      } else {
        this.lstLlegadastarde = data;
      }
    });
  }

  loadCatalogos(): void {
    this.getTipoTardanza();
  }
  /**
* @author Angie Lopez
* Metodo coneccion con tipo de incapacidad
*/
  getTipoTardanza(): void {
    this.crudService.get(Constants.URL_CATALOGO + '/TipoTardanza').then((data: any) => {
      this.TipoTardanza = data;
      console.log(`data TipoTardanza: ${data[0].descripcion}`);
    }, error => {
      console.log(`No se pudo obtener la informacion de TipoIncapacidad: ${error}`);
    });
  }



  /**
   * contratoSelectOnClick
   * @param resultado
   * @param row
   */
  llegadaTardeSelectOnClick(resultado, row): void {
    this.router.navigate(['/llegadatardeedicion', resultado.id]);
  }

  get numerodocumento() { return this.form.get('numerodocumento'); }
  get nombrecompleto() { return this.form.get('nombrecompleto'); }
  get tipotardanza() { return this.form.get('tipotardanza'); }

  /**
   *  Metodo para agregar una nueva llegada tarde
   * @author LAngie
   */
  nuevo() {
    this.router.navigate(['llegadatardeedicion']);
  }

}



