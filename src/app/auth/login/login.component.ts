import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from './../auth.service';
import { AppState } from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  cargando: boolean;
  subcription: Subscription = new Subscription();

  constructor( public authService: AuthService,
               private store: Store<AppState> ) { }

  ngOnInit() {
    this.subcription = this.store.select('ui')
                        .subscribe( ui => {
                            this.cargando = ui.isLoading;
                        });
  }

  ngOnDestroy() {
    this.subcription.unsubscribe();
  }

  onSubmit( data ) {
    this.authService.login( data.email, data.password );
  }

}
