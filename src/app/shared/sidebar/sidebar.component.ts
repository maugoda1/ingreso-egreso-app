import { AuthService } from './../../auth/auth.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { filter } from 'rxjs/operators';
import { IngresoEgresoService } from '../../ingreso-egreso/ingreso-egreso.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  usuario: string;
  subscription: Subscription = new Subscription();

  constructor( public authService: AuthService,
               private store: Store<AppState>,
               public ingresoEgresoService: IngresoEgresoService ) { }

  ngOnInit() {
    this.subscription = this.store.select('auth')
    .pipe(
      filter( auth => auth.user != null )
    )
    .subscribe( auth => {
          this.usuario = auth.user.nombre;
        });
  }

  logout() {
    this.authService.logOut();
    this.ingresoEgresoService.cancelarSubcriptions();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
