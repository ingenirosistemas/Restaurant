
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../../framework/services/crud.service';
import { Constants } from '../../framework/util/utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../framework/services/toast.service';

declare var jsPDF: any;

@Component({
  selector: 'app-hojadevida',
  templateUrl: './hojadevida.component.html',
  styleUrls: ['./hojadevida.component.css']
})
export class HojadevidaComponent implements OnInit {


  lstHojasdevida: any[];
  public rowsOnPage = 5;
  public form: FormGroup;

  constructor(
    private router: Router,
    private crudService: CrudService,
    private formBuilder: FormBuilder,
    public toastService: ToastService
  ) {

    this.lstHojasdevida = [];

  }

  /**
   * @author Milton Sanchez
   */
  ngOnInit(): void {
    this.buildForm();
    this.getHojadeVida();

  }


  downloadPDF(): void {

    const params = { genero: 'M' };
    this.crudService.generatePdf('bf760d82-0f5e-4243-8ec1-0a21723f4383', params)
      .then((res: any) => {
        window.URL.createObjectURL(res);
      }, error => console.log(error)
      );


    /* const columns = [
       { title: 'Tipo Documento', dataKey: 'tipodocumento' },
       { title: 'Número Documento', dataKey: 'numerodocumento' },
       { title: 'Nombre Completo', dataKey: 'nombrecompleto' },
       { title: 'Profesión', dataKey: 'desprofesion' },
     ];
     const rows = [];

     this.lstHojasdevida.forEach(item => {

       rows.push({
         'tipodocumento': item.destipodocumento, 'numerodocumento': item.numerodocumento,
         'nombrecompleto': `${item.primernombre}  ${item.primerapellido}`, 'desprofesion': item.desprofesion
       });

    });

     const doc = new jsPDF('l', 'pt');
     doc.autoTable(columns, rows, {
       startY: 50,
       theme: 'grid',
     });
     doc.save('Hojasdevida.pdf');*/


  }


  /**
   * @author Milton Sanchez
   */
  edit(item): void {
    this.router.navigate(['hojadevidaedicion', item.id]);

  }

  /**
   * @author Milton Sanchez
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      numerodocumento: ['', [Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.maxLength(11), Validators.minLength(7)]],
      nombrecompleto: ['', [Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
    });

  }



  /**
   * Metodo para cargar el listado de hojas de vida
   * @author Milton Sanchez
   */
  getHojadeVida(): void {
    this.crudService.post(Constants.URL_HOJADEVIDA_LISTA, this.form.value).then((data: any) => {
      this.lstHojasdevida = data;
      console.log(this.lstHojasdevida);
    }, error => {
      console.log(`No se pudo obtener la informacion de hojas de vida: ${error}`);
    });

  }


  /**
   * @author Milton Sanchez
   */
  nuevo() {
    this.router.navigate(['hojadevidaedicion']);
  }


  /**
   * @author Milton Sanchez
   */
  buscarHojadeVida() {
    this.crudService.post(Constants.URL_HOJADEVIDA_LISTA, this.form.value).then((data: any) => {

      if (data.length < 1) {

        this.toastService.showInfo('No se encontraron registros');

        this.lstHojasdevida = [];

      } else {

        this.lstHojasdevida = data;

      }
    });
  }


  get numerodocumento() { return this.form.get('numerodocumento'); }
  get nombrecompleto() { return this.form.get('nombrecompleto'); }

}
