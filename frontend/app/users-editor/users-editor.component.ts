import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';

import { User } from '../../../models/User';

@Component({
	selector: 'app-users-editor',
	templateUrl: './users-editor.component.html',
	styleUrls: ['./users-editor.component.less']
})
export class UsersEditorComponent implements OnInit {

	rawUsers: User[] = [];
	users: User[] = [];

	constructor(private userService: UserService) { }

	ngOnInit() {
		this.userService.getAllUsers().subscribe((data) => {
			this.rawUsers = data.users;
		});
	}

}
