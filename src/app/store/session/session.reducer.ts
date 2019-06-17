import { ActionReducer, Action, createReducer, on } from '@ngrx/store';
import { SessionState } from './session.state';
import { SessionActionsUnion, doLoginAction, loginSuccessAction, loginFailedAction, logoutAction, logoutSuccessedAction, getSessionInfoAction, setSessionAction, setShowCaptchaAction } from './session.actions';
import { Session, Auth } from '@core/models';
import { AppStates } from '@store/reducers';

// Initial SessionState
const initialState: SessionState = {
    isAuthenticated: false,
    loaded: false,
    loading: false,
    logout: false,
    logouted: true,
    showCaptcha: false,
    realTimeToken: ''
};

export const reducer = createReducer(
    initialState,
    on(doLoginAction, state => ({
        ...state,
        error: undefined,
        loading: true
    })),

    on(loginSuccessAction, (state, payload) => {
        return {
            ...state,
            showCaptcha: false,
            session: {
                BearerToken: (payload.authMeta as Auth).BearerToken,
                CurrentBranchId: (payload.authMeta as Auth).BranchId,
            } as Session
        }
    }),

    on(loginFailedAction, (state, payload) => {
        return {
            ...state,
            isAuthenticated: false,
            error: payload.error,
            loading: false
        }
    }),

    on(logoutAction, (state) => {
        return {
            ...state,
            logout: true
        }
    }),

    on(logoutSuccessedAction, (state) => {
        return {
            ...state,
            isAuthenticated: false,
            session: null,
            logout: false,
            logouted: true
        }
    }),

    on(getSessionInfoAction, (state) => {
        return {
            ...state,
            isAuthenticated: true,
            loaded: false,
            loading: false,
            error: undefined,
            session: <Session>{
                BearerToken: state.session.BearerToken,
                // CurrentBranchId: (action.payload.sessionInfo as RetailerCurrentResp).CurrentBranch ? (action.payload.sessionInfo as RetailerCurrentResp).CurrentBranch : state.session.CurrentBranchId,
                // UserId: (action.payload.sessionInfo as RetailerCurrentResp).CurrentUser.Id.toString(),
                // User: (action.payload.sessionInfo as RetailerCurrentResp).CurrentUser,
                // Setting: (action.payload.sessionInfo as RetailerCurrentResp).Setting,
                // Retailer: (action.payload.sessionInfo as RetailerCurrentResp).Retailer,
                // CurrentBranch: (action.payload.sessionInfo as RetailerCurrentResp).CurrentBranch,
                // Branches: (action.payload.sessionInfo as RetailerCurrentResp).Branches,
                // Privileges: (action.payload.sessionInfo as RetailerCurrentResp).Privileges,
                // HasKvPrinterSession: (action.payload.sessionInfo as RetailerCurrentResp).HasKvPrinterSession,
                // IsTrackToLogRocket: (action.payload.sessionInfo as RetailerCurrentResp).IsTrackToLogRocket
            }
        }
    }),

    on(setSessionAction, (state, payload) => {
        return {
            ...state,
            isAuthenticated: true,
            loaded: false,
            loadding: false,
            error: undefined,
            session: <Session>{
                ...payload.session,
                CurrentBranchId: payload.session.CurrentBranch ? payload.session.CurrentBranch.Id : payload.session.CurrentBranchId
            }
        }
    }),

    on(setShowCaptchaAction, (state, payload) => {
        return {
            ...state,
            showCaptcha: payload.show
        }
    })
);

export function sessionReducer(state: SessionState | undefined, action: Action) {
    return reducer(state, action);
  }

// The Sesion Reducer function
/* export function sessionReducer(state: SessionState = initialState, action: SessionActionsUnion): SessionState {
    switch (action.type) {
        case sessionActionTypes.DO_LOGIN:
            return Object.assign({}, state, {
                error: undefined,
                loading: true
            });
        case sessionActionTypes.LOGIN_SUCCESSED:
            return Object.assign({}, state, {
                showCaptcha: false,
                session: {
                    BearerToken: (action.authMeta as Auth).BearerToken,
                    CurrentBranchId: (action.authMeta as Auth).BranchId,
                }
            });
        case sessionActionTypes.LOGIN_FAILED:
            return Object.assign({}, state, {
                isAuthenticated: false,
                error: action.payload,
                loading: false
            });
        case sessionActionTypes.GET_SESSION_INFO:
            return Object.assign({}, state, {
                isAuthenticated: true,
                loaded: false,
                loading: false,
                error: undefined,
                session: <Session> {
                    BearerToken: state.session.BearerToken,
                    // CurrentBranchId: (action.payload.sessionInfo as RetailerCurrentResp).CurrentBranch ? (action.payload.sessionInfo as RetailerCurrentResp).CurrentBranch : state.session.CurrentBranchId,
                    // UserId: (action.payload.sessionInfo as RetailerCurrentResp).CurrentUser.Id.toString(),
                    // User: (action.payload.sessionInfo as RetailerCurrentResp).CurrentUser,
                    // Setting: (action.payload.sessionInfo as RetailerCurrentResp).Setting,
                    // Retailer: (action.payload.sessionInfo as RetailerCurrentResp).Retailer,
                    // CurrentBranch: (action.payload.sessionInfo as RetailerCurrentResp).CurrentBranch,
                    // Branches: (action.payload.sessionInfo as RetailerCurrentResp).Branches,
                    // Privileges: (action.payload.sessionInfo as RetailerCurrentResp).Privileges,
                    // HasKvPrinterSession: (action.payload.sessionInfo as RetailerCurrentResp).HasKvPrinterSession,
                    // IsTrackToLogRocket: (action.payload.sessionInfo as RetailerCurrentResp).IsTrackToLogRocket
                }
            });
        case sessionActionTypes.SET_SESSION:
            return Object.assign({}, state, {
                isAuthenticated: true,
                loaded: false,
                loadding: false,
                error: undefined,
                session: <Session> {
                    ...action.payload,
                    CurrentBranchId: action.payload.CurrentBranch ? action.payload.CurrentBranch.Id : action.payload.CurrentBranchId
                }
            });
        case sessionActionTypes.LOGOUT:
            return Object.assign({}, {
                ...state,
                logout: true
            });
        case sessionActionTypes.LOGOUT_SUCCESSED: {
            return Object.assign({}, {
                ...state,
                isAuthenticated: false,
                session: null,
                logout: false,
                logouted: true
            });
        }
        case sessionActionTypes.SET_SHOW_CAPTCHA:
            return {
                ...state,
                showCaptcha: action.payload as boolean
            }
        case sessionActionTypes.SET_REAL_TIME_TOKEN:
            return {
                ...state,
                realTimeToken: action.payload as string
            }
        default:
            return state;
    }
}
 */
