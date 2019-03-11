import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from './user.service';
import { UtilsService } from 'angular-ieeesb-lib';

const config = require('../../config.json');

@Injectable({
	providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

	constructor(private userService: UserService, private utilsService: UtilsService, private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		console.log(state)
		return new Promise((resolve, reject) => {
			this.userService.getSelfUser().subscribe(
				(user) => resolve(true),
				(e) => {
					this.userService.getAuthData().subscribe((data) => {
						const subQuery = this.utilsService.objectToQuerystring({
							callback: state.url
						})
						const query = this.utilsService.objectToQuerystring({
							callback: `${config.host}/#/login${subQuery}`,
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
