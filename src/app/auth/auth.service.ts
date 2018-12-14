import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { ActivarLoadingAcction, DesactivarLoadingAcction } from '../shared/ui.acctions';

import { Router } from '@angular/router';
import * as fireUser from 'firebase';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { User } from './user.model';
import { AppState } from '../app.reducer';
import { SetUserAction, UnsetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';
import { UnsetItemsAction } from '../ingreso-egreso/ingreso-egreso.actions';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription = new Subscription();
  private usuario: User;

  constructor( private afAuth: AngularFireAuth,
               private router: Router,
               private afDB: AngularFirestore,
               private store: Store<AppState> ) { }

  initAuthListener() {
    this.afAuth.authState.subscribe( (fbUser: fireUser.User) => {
      // console.log(fbUser);
      if ( fbUser ) {
        this.userSubscription = this.afDB.doc( `${ fbUser.uid }/usuario` ).valueChanges().subscribe( (usuarioObj: any) => {
                                  // console.log(usuarioObj);
                                  const newUser = new User( usuarioObj );
                                  this.usuario = newUser;
                                  this.store.dispatch( new SetUserAction( newUser ));
                                });
      } else {
        this.usuario = null;
        this.userSubscription.unsubscribe();
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {

    this.store.dispatch( new ActivarLoadingAcction() );

    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(resp => {
        // console.log(resp);
        const user: User = {
          uid: resp.user.uid,
          nombre: nombre,
          email: resp.user.email
        };

        this.afDB.doc(`${ user.uid }/usuario`)
          .set( user )
          .then(() => {
            this.router.navigate(['/']);
            this.store.dispatch( new DesactivarLoadingAcction() );
          });
      })
      .catch( error => {
        // console.error(error);
        this.store.dispatch( new DesactivarLoadingAcction() );
        Swal('Error en el Login', error.message, 'error');
      });
  }

  login(email: string, password: string) {
    this.store.dispatch( new ActivarLoadingAcction() );

    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then( resp => {
        // console.log(resp);
        this.router.navigate(['/']);
        this.store.dispatch( new DesactivarLoadingAcction() );

      })
      .catch( error => {
        // console.error(error);
        Swal('Error en el Login', error.message, 'error');
        this.store.dispatch( new DesactivarLoadingAcction() );
      });
  }

  logOut() {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();

    this.store.dispatch( new UnsetUserAction() );
    // this.store.dispatch ( new UnsetItemsAction() );
  }

  isAuth() {
    return this.afAuth.authState
      .pipe(
        map( fbUser => {
          if ( fbUser == null ) {
            this.router.navigate(['/login']);
          }
          return fbUser != null;
        })
      );
  }

  getUsuario( ) {
    return {...this.usuario};
  }

}
