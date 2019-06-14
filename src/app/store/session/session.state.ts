import { Session } from '@core/models';

export interface SessionState {

    isAuthenticated: boolean;

    error?: string[];

    loaded: boolean;

    loading: boolean;

    logout: boolean;

    logouted: boolean;

    session?: Session;

    showCaptcha?: boolean;

    realTimeToken: string;
}
