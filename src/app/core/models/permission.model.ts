/**
 * Defines User Permission
 * @author Vijayan PP <vijayan.pp@pitsolutions.com>
 */
import { Observable } from 'rxjs/Observable';
export class UserToken { }

export class Permission {
    canActivate(user: UserToken): boolean {
        return true;
    }
    canDeactivate(user: UserToken): boolean {
        return true;
    }
}

export class CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
