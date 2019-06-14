import { Privilege } from './privilege.model';
import { PosSetting } from './pos-setting.model';
import { Branch } from './branch.model';
import { Retailer } from './retailer.model';
import { User } from './user.model';

export class Session {
    BearerToken: string;

    // DisplayName: string;

    // ResponseStatus: any;

    // SessionId: string;

    UserId: string;

    User: User;

    // UserName: string;

    Retailer: Retailer;

    CurrentBranchId: Number;

    CurrentBranch: Branch;

    Branches: Array<Branch>;

    Setting: PosSetting;

    Privileges: Privilege;

    // IsExpireTime: boolean;

    IsTrackToLogRocket: boolean;
}
