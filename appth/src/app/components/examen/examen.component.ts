import { ToastService } from './../../framework/services/toast.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../framework/util/utils';
import { CrudService } from '../../framework/services/crud.service';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.css'],
  styles: [
    `
      :host >>> .tooltip-inner {
        background-color: #b8bcef;
        color: #555;
      }
      :host >>> .tooltip.top .tooltip-arrow:before,
      :host >>> .tooltip.top .tooltip-arrow {
        border-top-color: #b8bcef;
      }
    `
  ]
})
export class ExamenComponent implements OnInit {

  lstExamen: any[];
  public rowsOnPage = 5;
  public form: FormGroup;
  loading: boolean;



  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private crudService: CrudService,
    public toastService: ToastService

  ) {
    this.lstExamen = [];
    this.loading = true;
  }

  ngOnInit() {
    this.buildForm();
    console.log(Constants.URL_BUSCAR_CONTRATO);
    this.getListaExamen();

  }

  dowload(file) {
    this.crudService.dowloadFile(file);
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      numerodocumento: ['', [Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.maxLength(11), Validators.minLength(7)]],
      nombrecompleto: ['', [Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
    });
  }
  /**
     * Metodo encargado de cargar los listados de los examenes medicos
     * @author
     */
  getListaExamen(): void {
    console.log(Constants.URL_EXAMEN_LISTA, '/' + this.form.value);
    this.crudService.post(Constants.URL_EXAMEN_LISTA, this.form.value).then((data: any) => {

      setTimeout(() => {
        this.loading = false;
        this.lstExamen = data;
      }, 200);

      console.log(data);
    }, error => {
      console.log(`No se pudo obtener la informacion de los Examenes Medicos: ${error}`);
    });
  }

  /**
   * Metodo que valida la busqueda avanzada de un examen medico
   */
  buscarExamen() {
    this.crudService.post(Constants.URL_EXAMEN_LISTA, this.form.value).then((data: any) => {
      if (data.length < 1) {
        this.toastService.showInfo('No se encontraron registros');
        this.lstExamen = [];
      } else {
        setTimeout(() => {
          this.loading = false;
          this.lstExamen = data;
        }, 3000);
      }
    });

  }
  /**
     * Metodo que redirecciona a la edicion de un examen medico
     * @author
     */
  contratoSelectOnClick(resultado, row): void {
    this.router.navigate(['/examennuevo', resultado.id]);
  }

  /**
   * Metodo para cargar el catalog de tipo examen
   * @author
   */
  nuevo(): void {
    this.router.navigate(['/examennuevo']);
  }


  // Getters of form
  get numerodocumento() { return this.form.get('numerodocumento'); }
  get nombrecompleto() { return this.form.get('nombrecompleto'); }

}


