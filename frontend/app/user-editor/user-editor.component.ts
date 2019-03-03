import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';

import { User } from '../../../models/User';

@Component({
	selector: 'app-user-editor',
	templateUrl: './user-editor.component.html',
	styleUrls: ['./user-editor.component.less']
})
export class UserEditorComponent implements OnInit {

	user: User = {};
	error;
	money = 0;
	role = '';
	purchases = [];

	constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['userId']) {
				this.userService.getUser(params['userId']).subscribe(
					(data) => {
						this.user = data.user;
						this.userService.getUserPurchases(this.user._id).subscribe(
							(data) => {
								this.purchases = data.purchases;
								this.error = null;
							},
							(error) => {
								this.error = error;
							}
						);
						this.error = null;
					},
					(error) => {
						this.error = error;
					}
				);
			}
		});
	}

	addMoney() {
		if(!confirm(`¿Seguro que quieres introducir ${this.money} €?`)) return;
		this.userService.addMoney(this.user._id, this.money).subscribe(
			(data) => {
				this.user = data.user;
				this.error = null;
			},
			(error) => {
				this.error = error;
			}
		)
	}

	addRole() {
		if(!confirm(`¿Seguro que quieres introducir este rol: ${this.role}?`)) return;
		this.userService.addRole(this.user._id, this.role).subscribe(
			(data) => {
				this.user = data.user;
				this.error = null;
			},
			(error) => {
				this.error = error;
			}
		)
	}

}
