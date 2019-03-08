import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../../framework/services/crud.service';
import { Constants } from '../../framework/util/utils';
import { ToastService } from '../../framework/services/toast.service';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.css']
})
export class ContratosComponent implements OnInit {

  lstContratos: any[];
  public rowsOnPage = 5;
  public form: FormGroup;

  constructor(
    private router: Router,
    private crudService: CrudService,
    public toastService: ToastService,
    private formBuilder: FormBuilder
  ) {
    this.lstContratos = [];
  }


  ngOnInit() {
    this.buildForm();
    this.getContrato();
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      numerodocumento: ['', [Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.maxLength(11), Validators.minLength(7)]],
      nombrecompleto: ['', [Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
      // idContrato: ['', [Validators.required]],
    });

  }


  /**
   * getContrato
   */
  getContrato(): void {
    console.log(Constants.URL_BUSCAR_CONTRATO, '/' + this.form.value);
    this.crudService.post(Constants.URL_BUSCAR_CONTRATO, this.form.value).then((data: any) => {
      this.lstContratos = data;
      console.log(data);
    }, error => {
      console.log(`No se pudo obtener la informacion de hojas de vida: ${error}`);
    });
  }

  /**
   * buscarContratos
   */
  buscarContratos() {
    this.crudService.post(Constants.URL_BUSCAR_CONTRATO, this.form.value).then((data: any) => {
      if (data.length < 1) {
        this.toastService.showInfo('No se encontraron registros');
        this.lstContratos = [];
      } else {
        this.lstContratos = data;
      }
    });
  }

  /**
   * contratoSelectOnClick
   * @param resultado
   * @param row
   */
  contratoSelectOnClick(resultado, row): void {
    this.router.navigate(['/contratosdatosgenerales', resultado.idContrato]);
  }

  get numerodocumento() { return this.form.get('numerodocumento'); }
  get nombrecompleto() { return this.form.get('nombrecompleto'); }
  // get idContrato() { return this.form.get('idContrato'); }


  nuevo() {
    this.router.navigate(['contratosdatosgenerales']);
  }


  /**
  * Permite  crear una nvedad al contrato
  *
  * @author Milton Sanchez
  */
  novedad(item): void {
    this.router.navigate(['novedad', item.idContrato]);

  }
  /**
   *
   * @param item permite gestionar otro si al contrato eistente
   */
  otroYes(item) {
    this.router.navigate(['otrosi', item.idContrato]);
  }

}
