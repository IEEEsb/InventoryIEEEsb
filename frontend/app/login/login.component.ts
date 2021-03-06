import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UtilsService } from '../utils.service';
import { UserService } from '../user.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

	error: String;

	constructor(private utilsService: UtilsService, private userService: UserService, private router: Router) { }

	ngOnInit() {
		this.utilsService.getParams().subscribe((params) => {
			if(!params) return;

			if(params.token) {
				this.userService.login(params.token).subscribe(
					(user) => {
						console.log(params)
						this.router.navigate([params.callback ? params.callback : '/']);
						this.utilsService.setParams(null);
					},
					(error) => {
						this.router.navigate(['/']);
						alert(error);
					}
				);
			}
		});
	}

}
