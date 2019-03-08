import { Constants } from './../../framework/util/utils';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CrudService } from '../../framework/services/crud.service';
import { Persona } from '../../models/persona';


@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  // Listas
  public datosPersona: any[];

  // Form
  form: FormGroup;
  persona: Persona;

  public rowsOnPage = 5;

  // Requerido para select
  select = {
    items: [
      { value: 1, label: 'Primero' },
      { value: 2, label: 'Segundo' },
    ],
  };

  constructor(private formBuilder: FormBuilder,
    private crudService: CrudService
  ) { }

  ngOnInit(): void {
    this.getPersonas();
    this.buildForm();
  }


  getPersonas() {
    this.crudService.get(Constants.URL_DEMO).then((data: any) => {
      this.datosPersona = data;
    });
  }

  /**
   * Asigna condiciones de validación
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
      lastname: ['', [Validators.required, Validators.pattern(Constants.CAMPO_ALFANUMERICO)]],
      combo: ['', [Validators.required]],
      fecha: [''],
    });
  }


  obtenerFecha(event) {
    console.log(event);
  }

  save() {
    this.persona = new Persona();
    this.persona.nombres = this.form.value.firstname;
    this.persona.apellidos = this.form.value.lastname;
    this.crudService.post(Constants.URL_DEMO_GUARDAR, this.persona).then();
    this.form.reset();
  }

  // Getters
  get firstname() { return this.form.get('firstname'); }
  get lastname() { return this.form.get('lastname'); }
  get combo() { return this.form.get('combo'); }
  get fecha() { return this.form.get('fecha'); }





}
