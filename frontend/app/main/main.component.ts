import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { UtilsService } from '../utils.service';

const config = require('../../../config.json');

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {

	menuItems = {left: [], right: []};

	user;

	constructor(private userService: UserService, private utilsService: UtilsService, private router: Router) {
	}

	ngOnInit() {
		this.userService.getLoggedUser().subscribe((user) => {
			this.user = user;
			this.menuItems = {
				left: [
					{
						text: 'Comprar',
						type: 'router',
						link: '/inventory',
						roles: [],
					}
				],
				right: [
					{
						text: 'Login',
						type: 'callback', // router, link or callback
						callback: this.login.bind(this),
					},
					{
						text: `Saldo: ${this.user ? this.user.money : 0.0} €`,
						type: 'text',
						roles: [],
					},
					{
						text: 'Perfil',
						type: 'router',
						link: '/profile',
						roles: [],
					},
					{
						text: 'Administrar',
						type: 'router',
						link: '/admin/inventory',
						roles: [config.adminRole],
					},
					{
						text: 'Logout',
						type: 'callback',
						callback: this.logout.bind(this),
						roles: [],
					}
				]
			}
		});
	}



	login() {
		this.userService.getAuthData().subscribe((data) => {
			const query = this.utilsService.objectToQuerystring({
				callback: `${config.host}/%23/login`,
				service: data.service,
				scope: data.scope.join(','),
			})
			window.location.replace(`${data.server}/#/login${query}`);
		});
	}

	logout() {
		this.userService.logout().subscribe(() => {
			this.router.navigate(['/']);
		});
	}
}
