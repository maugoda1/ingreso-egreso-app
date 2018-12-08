import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  cargando: boolean;
  subcription: Subscription;

  constructor( public authService: AuthService,
               private store: Store<AppState>  ) { }

  ngOnInit() {
    this.store.select('ui')
      .subscribe( ui => {
          this.cargando = ui.isLoading;
      });
  }

  ngOnDestroy() {
    this.subcription.unsubscribe();
  }

  onSubmit( data: any ) {
    console.log(data);
    this.authService.crearUsuario(data.nombre, data.email, data.password);
  }

}
