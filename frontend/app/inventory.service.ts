import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { LoadingService } from 'angular-ieeesb-lib';
import { UserService } from './user.service';
import { UtilsService } from 'angular-ieeesb-lib';

import { Item } from '../../models/Item';
import { Purchase } from '../../models/Purchase';

const config = require('../../config.json');

@Injectable({
	providedIn: 'root'
})
export class InventoryService {

	private consumableItemsSubject: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
	private purchasesSubject: BehaviorSubject<Purchase[]> = new BehaviorSubject<Purchase[]>([]);

	constructor(private http: HttpClient, private loadingService: LoadingService, private userService: UserService, private utilsService: UtilsService) {
	}

	getConsumableItems() {
		this.getAllConsumableItems().subscribe();
		return this.consumableItemsSubject.asObservable();
	}

	getAllConsumableItems() {
		this.loadingService.setLoading();
		return this.http.get<any>('api/inventory/item/all/consumable')
		.pipe(
			tap((data) => {
				this.consumableItemsSubject.next(data.items);
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	getTags() {
		this.loadingService.setLoading();
		return this.http.get<any>(`api/inventory/item/tags`)
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	getItem(itemId) {
		this.loadingService.setLoading();
		return this.http.get<any>(`api/inventory/item/${itemId}`)
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	getItemByCode(code) {
		this.loadingService.setLoading();
		return this.http.get<any>(`api/inventory/item/code/${code}`)
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	addItem(item) {
		this.loadingService.setLoading();
		return this.http.post<any>('api/inventory/item', item)
		.pipe(
			tap((data) => {
				this.getAllConsumableItems().subscribe();
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	updateItem(itemId, item) {
		this.loadingService.setLoading();
		return this.http.patch<any>(`api/inventory/item/${itemId}`, item)
		.pipe(
			tap((data) => {
				this.getAllConsumableItems().subscribe();
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	removeItem(itemId) {
		this.loadingService.setLoading();
		return this.http.delete(`api/inventory/item/${itemId}`)
		.pipe(
			tap((data) => {
				this.getAllConsumableItems().subscribe();
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	buyItem(itemId, quantity) {
		this.loadingService.setLoading();
		return this.http.post<any>(`api/inventory/item/${itemId}/buy`, { quantity })
		.pipe(
			tap((data) => {
				this.getAllConsumableItems().subscribe();
				this.userService.getSelfUser().subscribe();
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	getPurchases() {
		this.getAllPurchases().subscribe();
		return this.purchasesSubject.asObservable();
	}

	getAllPurchases() {
		this.loadingService.setLoading();
		return this.http.get<any>(`api/inventory/purchase/all`)
		.pipe(
			tap((data) => {
				this.purchasesSubject.next(data.purchases);
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	getPurchase(purchaseId) {
		this.loadingService.setLoading();
		return this.http.get<any>(`api/inventory/purchase/${purchaseId}`)
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	startPurchase(purchase) {
		this.loadingService.setLoading();
		return this.http.post<any>(`api/inventory/purchase`, purchase)
		.pipe(
			tap((data) => {
				this.getAllPurchases().subscribe();
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	updatePurchase(purchaseId, purchase) {
		this.loadingService.setLoading();
		return this.http.patch<any>(`api/inventory/purchase/${purchaseId}`, purchase)
		.pipe(
			tap((data) => {
				this.getAllPurchases().subscribe();
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	endPurchase(purchaseId) {
		this.loadingService.setLoading();
		return this.http.post<any>(`api/inventory/purchase/${purchaseId}/end`, {})
		.pipe(
			tap((data) => {
				this.getAllPurchases().subscribe();
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	removePurchase(purchaseId) {
		this.loadingService.setLoading();
		return this.http.delete<any>(`api/inventory/purchase/${purchaseId}`, {})
		.pipe(
			tap((data) => {
				this.getAllPurchases().subscribe();
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	addPurchaseItem(purchaseId, itemId, item) {
		console.log(purchaseId, itemId, item)
		this.loadingService.setLoading();
		return this.http.post<any>(`api/inventory/purchase/${purchaseId}/item/${itemId}`, item)
		.pipe(
			tap((data) => {
				this.getAllPurchases().subscribe();
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	updatePurchaseItem(purchaseId, itemId, item) {
		this.loadingService.setLoading();
		return this.http.patch<any>(`api/inventory/purchase/${purchaseId}/item/${itemId}`, item)
		.pipe(
			tap((data) => {
				this.getAllPurchases().subscribe();
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}
}
