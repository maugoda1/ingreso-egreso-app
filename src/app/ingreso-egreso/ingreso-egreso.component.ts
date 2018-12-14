import { Subscription } from 'rxjs';
import { AppState } from './../app.reducer';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import Swal from 'sweetalert2';
import { ActivarLoadingAcction, DesactivarLoadingAcction } from '../shared/ui.acctions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styleUrls: ['./ingreso-egreso.component.css']
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  forma: FormGroup;
  tipo = 'ingreso';

  loadingSub: Subscription = new Subscription();
  cargando: boolean;

  constructor(public ingresoEgresoService: IngresoEgresoService,
              private store: Store<AppState> ) { }

  ngOnInit() {
    this.loadingSub = this.store.select('ui')
      .subscribe( ui => {
        this.cargando = ui.isLoading;
      });
    this.forma = new FormGroup({
      'descripcion': new FormControl('', Validators.required),
      'monto': new FormControl(0, Validators.min(0))
    });
  }

  ngOnDestroy() {
    this.loadingSub.unsubscribe();
  }

  crearIngresoEgreso() {
    // console.log(this.forma.value);
    // console.log(this.tipo);
    this.store.dispatch( new ActivarLoadingAcction() );
    const ingresoEgreso = new IngresoEgreso( { ...this.forma.value, tipo: this.tipo });
    // console.log(ingresoEgreso);
    this.ingresoEgresoService.crearIngresoEgreso( ingresoEgreso )
      .then( () => {
        this.store.dispatch( new DesactivarLoadingAcction() );
        Swal('Creado', ingresoEgreso.descripcion, 'success');
        this.forma.reset({
          monto: 0
        });
      }).catch( err => {
        console.log(err);
        this.store.dispatch( new DesactivarLoadingAcction() );
      });
  }
}
