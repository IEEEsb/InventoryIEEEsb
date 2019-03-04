import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, delay, catchError } from 'rxjs/operators';

import { LoadingService } from 'angular-ieeesb-lib';
import { UtilsService } from 'angular-ieeesb-lib';

import { User } from '../../models/User';
import { Transaction } from '../../models/Transaction';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
	private selfPurchasesSubject: BehaviorSubject<Transaction[]> = new BehaviorSubject<Transaction[]>([]);

	constructor(private http: HttpClient, private loadingService: LoadingService, private utilsService: UtilsService) {
	}

	getAuthData() {
		this.loadingService.setLoading();
		return this.http.get<any>('api/auth')
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	getLoggedUser() {
		this.getSelfUser().subscribe();
		return this.userSubject.asObservable();
	}

	getSelfUser() {
		this.loadingService.setLoading();
		return this.http.get<any>('api/user/self/')
		.pipe(
			tap((data) => {
				this.userSubject.next(data.user);
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	getUser(userId) {
		this.loadingService.setLoading();
		return this.http.get<any>(`api/user/${userId}`)
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	getAllUsers() {
		this.loadingService.setLoading();
		return this.http.get<any>('api/user/all/')
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	login(token) {
		this.loadingService.setLoading();
		return this.http.post<any>('api/user/login/', { token })
		.pipe(
			tap((data) => {
				this.userSubject.next(data.user);
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	logout() {
		this.loadingService.setLoading();
		return this.http.post<any>('api/user/logout/', {})
		.pipe(
			tap((data) => {
				this.userSubject.next(null);
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	addRole(userId, role) {
		this.loadingService.setLoading();
		return this.http.post<any>(`api/user/${userId}/addRole`, { role })
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	addMoney(userId, money) {
		this.loadingService.setLoading();
		return this.http.post<any>(`api/user/${userId}/addMoney`, { money })
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	getSelfPurchases() {
		this.getAllSelfPurchases().subscribe();
		return this.selfPurchasesSubject.asObservable();
	}

	getAllSelfPurchases() {
		this.loadingService.setLoading();
		return this.http.get<any>(`api/user/self/purchase/all`)
		.pipe(
			tap((data) => {
				this.selfPurchasesSubject.next(data.purchases);
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	getUserPurchases(userId) {
		this.loadingService.setLoading();
		return this.http.get<any>(`api/user/${userId}/purchase/all`)
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	cancelSelfPurchase(purchaseId) {
		this.loadingService.setLoading();
		return this.http.post(`api/user/self/purchase/${purchaseId}/cancel`, {})
		.pipe(
			tap((data) => {
				this.getSelfUser().subscribe();
				this.getAllSelfPurchases().subscribe();
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}
}
