import { Action } from '@ngrx/store';


export const ACTIVAR_LOADING = '[UI Loading] Cargando...';
export const DESACTIVAR_LOADING = '[UI Loading] Fin de carga...';


export class ActivarLoadingAcction implements Action {
    readonly type = ACTIVAR_LOADING;
}

export class DesactivarLoadingAcction implements Action {
    readonly type = DESACTIVAR_LOADING;
}

export type acciones = ActivarLoadingAcction | DesactivarLoadingAcction;
