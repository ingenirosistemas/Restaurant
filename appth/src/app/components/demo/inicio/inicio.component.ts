import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from '../../../framework/services/crud.service';
import { Constants } from '../../../framework/util/utils';
import { GrupoGeneroService } from '../../../framework/services/grupogenero.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, AfterViewInit {

  public barChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true
  };
  public barChartLabels: string[] = ['Sistemas', 'Auditoria', 'Financiera', 'Talento Humano', 'At Comunero'];
  public barChartType: string;
  public barChartLegend: boolean;

  public barChartData: any[] = [
    { data: [200, 48, 40, 19, 300], label: 'Areas' }
  ];

  public lineChartColors: Array<any> = [
    {
      backgroundColor: ['#ffa1b5', '#86c7f3', '#ffe199', '#e8c3b9', '#c45850']
      // backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850']
    }
  ];

  // Doughnut
  public doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: number[] = [350, 450, 100];
  public doughnutChartType: string;

  // Doughnut
  public doughnutChartLabels_: string[];
  public doughnutChartData_: number[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private crudService: CrudService,
    private grupoGeneroService: GrupoGeneroService
  ) {

    this.barChartType = 'bar';
    this.barChartLegend = true;

    this.doughnutChartType = 'doughnut';

    this.doughnutChartLabels_ = [];
    this.doughnutChartData_ = []; // Necesario para inicializar la grafica

    this.grupoGeneroService.getGruposGenero().subscribe(data => {

      this.doughnutChartData_ = []; // Se limpia el valor por defecto
      for (let i = 0; i < data.length; i++) {
        this.doughnutChartLabels_[i] = data[i].genero;
        this.doughnutChartData_.push(data[i].total);
      }

    }, (err) => {
      // Manejo del error
    });

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }


  getGrupoGenero(): void {
    this.crudService.get(Constants.URL_GRUPO_GENERO).then((data: any) => {
      console.log('Promesa' + data);
    }, (err) => {
      console.log('ERROR en getGrupoGenero', JSON.stringify(err));
    });

  }



  // events
  public chartClicked(e: any): void {
    console.log(e);
    this.demo();
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public randomize(): void {
    // Only Change 3 values
    const data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56];
    const clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
  }

  demo() {
    this.router.navigate(['demo']);
  }

}
