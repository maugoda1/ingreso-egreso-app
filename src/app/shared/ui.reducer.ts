
import * as fromUI from './ui.acctions';

export interface State {
    isLoading: boolean;
}

const initState: State = {
    isLoading: false
};

export function uiReducer( state = initState, acction: fromUI.acciones): State {
    switch (acction.type) {
        case fromUI.ACTIVAR_LOADING:
            return {
                isLoading: true
            };
        case fromUI.DESACTIVAR_LOADING:
            return {
                isLoading: false
            };
        default:
            break;
    }
}

