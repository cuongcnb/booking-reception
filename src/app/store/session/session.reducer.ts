import { ActionReducer, Action } from '@ngrx/store';
import { SessionState } from './session.state';
import { sessionActionTypes } from './session.actions';
import { Session, Auth } from '@core/models';

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

// The Sesion Reducer function
export function sessionReducer(state: SessionState = initialState, action): SessionState {
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
                    BearerToken: (action.payload.authMeta as Auth).BearerToken,
                    CurrentBranchId: (action.payload.authMeta as Auth).BranchId,
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
