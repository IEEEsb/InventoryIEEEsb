import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from './user.service';
import { UtilsService } from './utils.service';

const config = require('../../config.json');

@Injectable({
	providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

	constructor(private userService: UserService, private utilsService: UtilsService, private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		return new Promise((resolve, reject) => {
			this.userService.getSelfUser().subscribe(
				(user) => resolve(true),
				(e) => {
					this.userService.getAuthData().subscribe((data) => {
						const query = this.utilsService.objectToQuerystring({
							callback: `${config.host}/%23/login`,
							service: data.service,
							scope: data.scope.join(','),
						})
						window.location.replace(`${data.server}/#/login${query}`);
					});
				}
			);
		});
	}
}
