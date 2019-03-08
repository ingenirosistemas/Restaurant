import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../../framework/services/crud.service';
import { Constants } from '../../framework/util/utils';
import { ToastService } from '../../framework/services/toast.service';

@Component({
  selector: 'app-dinamizadoragestacion',
  templateUrl: './dinamizadoragestacion.component.html',
  styleUrls: ['./dinamizadoragestacion.component.css']
})
export class DinamizadoragestacionComponent implements OnInit {

  lstEmbarazoActual: any[];
  public rowsOnPage = 5;
  public form: FormGroup;


  constructor(
    private router: Router,
    private crudService: CrudService,
    private formBuilder: FormBuilder,
    public toastService: ToastService
  ) {
    this.lstEmbarazoActual = [];
  }

  ngOnInit() {
    this.buildForm();
    console.log(Constants.URL_BUSCAR_CONTRATO);
    this.getListaEmbarazoActual();
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
   * Metodo para cargar el listado de embarazo actual
   * @author LAngie
   */

  getListaEmbarazoActual(): void {
    this.crudService.post(Constants.URL_DINAMIZADORAGESTACION_LISTA, this.form.value).then((data: any) => {
      this.lstEmbarazoActual = data;
      console.log(data);
    }, error => {
      console.log(`No se pudo obtener la informacion de hojas de vida: ${error}`);
    });
  }
  /**
   * buscarDinamizadora
   */
  buscardinamizadoras() {
    this.crudService.post(Constants.URL_DINAMIZADORAGESTACION_LISTA, this.form.value).then((data: any) => {
      if (data.length < 1) {
        this.toastService.showInfo('No se encontraron registros');
        this.lstEmbarazoActual = [];
      } else {
        this.lstEmbarazoActual = data;
      }
    });
  }
  /**
   * contratoSelectOnClick
   * @param resultado
   * @param row
   */
  dinamizadoraSelectOnClick(resultado, row): void {
    this.router.navigate(['/dinamizadoragestacionedicion', resultado.id]);
  }

  get numerodocumento() { return this.form.get('numerodocumento'); }
  get nombrecompleto() { return this.form.get('nombrecompleto'); }
  get idContrato() { return this.form.get('idContrato'); }


  /**
 * @author LAngie
 */
  nuevo() {
    this.router.navigate(['dinamizadoragestacionedicion']);
  }

  /**
  * Permite  crear una novedad a la gestante
  *
  * @author Angie L
  */
  novedad(item): void {
    this.router.navigate(['novedades', item.id]);

  }

}













