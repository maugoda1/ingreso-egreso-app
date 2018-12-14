import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  usuario: string;
  subscription: Subscription = new Subscription();

  constructor( private store: Store<AppState> ) { }

  ngOnInit() {
    this.subscription = this.store.select('auth')
        .pipe(
          filter( auth => auth.user != null )
        )
        .subscribe( auth => {
          this.usuario = auth.user.nombre;
        });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
