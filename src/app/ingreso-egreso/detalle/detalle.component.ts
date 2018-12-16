import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
// import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../ingreso-egreso.service';

import * as fromIngEgr from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit, OnDestroy {

  items: IngresoEgreso[];
  subscrition: Subscription = new Subscription();

  constructor( private store: Store<fromIngEgr.AppState>,
               public ingresoEgresoService: IngresoEgresoService  ) { }

  ngOnInit() {
    this.subscrition = this.store.select('ingresoEgreso')
      .subscribe( ingresoEgreso => {
        this.items = ingresoEgreso.items;
      });
  }

  ngOnDestroy() {
    this.subscrition.unsubscribe();
  }

  borrarItem( item: IngresoEgreso ) {
    this.ingresoEgresoService.borrarIngresoEgreso( item.uid )
      .then( () => {
        Swal('Item Eliminado', item.descripcion, 'success');
      });
  }

}
