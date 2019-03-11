import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';
import { PaypalService } from '../paypal.service';

import { User } from '../../../models/User';
import { Transaction } from '../../../models/Transaction';

const config = require('../../../config.json');

declare var paypal: any;

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit, AfterViewInit {

	user: User = {};
	purchases: Transaction[] = [];
	error;
	money = 0;

	constructor(private userService: UserService, private route: ActivatedRoute, private paypalService: PaypalService) { }

	ngOnInit() {
		this.userService.getLoggedUser().subscribe((user) => {
			this.user = user;
		});

		this.userService.getSelfPurchases().subscribe((purchases) => {
			this.purchases = purchases;
		});
	}

	ngAfterViewInit() {
		this.paypalButton();
	}

	get fee() {
		return Math.round(((this.money * config.paypal.fee.rate + config.paypal.fee.fix) / (1 - config.paypal.fee.rate)) * 100.0) / 100.0
	}

	paypalButton(){
		paypal.Button.render({

			// Set your environment

			env: 'production', // sandbox | production

			// Specify the style of the button

			style: {
				label: 'checkout', // checkout || credit
				size:  'medium',    // tiny | small | medium
				shape: 'rect',     // pill | rect
				color: 'blue'      // gold | blue | silver
			},
			// Wait for the PayPal button to be clicked

			payment: async () => {

				// Make a call to the merchant server to set up the payment
				try {
					const response = await this.paypalService.createPayment(this.money).toPromise();
					return response.id;
				} catch(e) {

				}
			},

			// Wait for the payment to be authorized by the customer

			onAuthorize: async (data, actions) => {

				// Make a call to the merchant server to execute the payment
				try {
					const user = await this.paypalService.executePayment(data.paymentID, data.payerID).toPromise();
					this.user = user;
				} catch(e) {

				}
			}

		}, '.paypal-button');
	}

	cancel(purchaseId) {
		this.userService.cancelSelfPurchase(purchaseId).subscribe(
			() => {},
			(error) => {
				this.error = error;
			}
		);
	}
}
