import { Store } from '@ngrx/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { AppState } from '../app.reducer';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction, UnsetItemsAction } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  ingresoEgresoListenerSub: Subscription = new Subscription();
  ingresoEgresoItemsSub: Subscription = new Subscription();

  constructor( private afDB: AngularFirestore,
               public authService: AuthService,
               private store: Store<AppState> ) { }

  initIngresoEgresoListener() {
    const user = this.authService.getUsuario();
    // console.log(user.uid);

    this.ingresoEgresoListenerSub = this.store.select('auth')
    .pipe(
      filter( auth => auth.user != null )  // filtro para que solo pasen los que son diferentes de null
    )
    .subscribe( auth => {
        this.ingresoEgresoItems( auth.user.uid );
      });
  }

  private ingresoEgresoItems ( uid: string ) {

    this.ingresoEgresoItemsSub = this.afDB.collection(`${ uid }/ingresos-egresos/items`)
        .snapshotChanges()
        .pipe( map( docData => {
          return docData.map( doc => {
            return {
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
          });
        }) )
        .subscribe( (coleccion: any[]) => {
          // console.log(coleccion);
          this.store.dispatch( new SetItemsAction( coleccion ) );
        } );
  }

  cancelarSubcriptions() {

    this.ingresoEgresoItemsSub.unsubscribe();
    this.ingresoEgresoListenerSub.unsubscribe();
    this.store.dispatch ( new UnsetItemsAction() );

  }

  crearIngresoEgreso( ingresoEgreso: IngresoEgreso) {
    const user = this.authService.getUsuario();
    return this.afDB.doc(`${ user.uid }/ingresos-egresos`)
      .collection('items').add({...ingresoEgreso});
  }

  borrarIngresoEgreso( uid: string ) {
    const user = this.authService.getUsuario();

    return this.afDB.doc(`${ user.uid }/ingresos-egresos/items/${ uid }`).delete();
  }
}
