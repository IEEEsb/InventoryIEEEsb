import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { UtilsService } from 'angular-ieeesb-lib';

const config = require('../../../config.json');

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {

	menuItems = {
		logo: {
			type: 'link',
			link: 'https://ieeesb.es',
		},
		left: [],
		right: []
	};

	user;
	activeLink = '';

	constructor(private userService: UserService, private utilsService: UtilsService, private location: Location, private router: Router) {
		this.router.events.subscribe((val) => {
			this.activeLink = this.location.path() === '' ? '/' : this.location.path();
		});
	}

	ngOnInit() {
		this.userService.getLoggedUser().subscribe((user) => {
			this.user = user;
			this.menuItems = {
				logo: {
					type: 'link',
					link: 'https://ieeesb.es',
				},
				left: [
					{
						text: 'Comprar',
						type: 'router',
						link: '/buy',
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
