import { Component, OnInit } from '@angular/core';

const config = require('../../../config.json');

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {

	menuItems = {
		left: [
			{
				text: 'Inventario',
				type: 'router', // router, link or callback
				link: '/admin/inventory',
				roles: [config.adminRole],
			},
			{
				text: 'Compras',
				type: 'router', // router, link or callback
				link: '/admin/purchase',
				roles: [config.adminRole],
			},
			{
				text: 'Usuarios',
				type: 'router', // router, link or callback
				link: '/admin/users',
				roles: [config.adminRole],
			}
		],
		right: []
	};

	constructor() { }

	ngOnInit() {
	}

}
