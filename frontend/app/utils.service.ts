import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { LoadingService } from './loading.service';

@Injectable({
	providedIn: 'root'
})
export class UtilsService {

	redirectParams: any;
	private paramsSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	constructor(private route: ActivatedRoute, private loadingService: LoadingService) {
		route.queryParams.subscribe(params => {
			if (Object.keys(params).length > 0) this.setParams(params);
		});
	}

	objectToQuerystring (params) {
		return '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
	}

	setRedirect(on, callback) {
		if(this.redirectParams) return;
		this.redirectParams = { on, callback };
	}

	getRedirect() {
		return this.redirectParams;
	}

	redirect(on, params) {
		if (this.redirectParams && this.redirectParams.on === on) {
			window.location.replace(`${this.redirectParams.callback}${this.objectToQuerystring(params)}`);
		}
	}

	setParams(params) {
		this.paramsSubject.next(params);
	}

	getParams() {
		return this.paramsSubject.asObservable();
	}

	filter(options) {
		const search = options.search.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();

		let items = [];
		for(let item of options.items) {
			for(let key of options.keys){
				if(Array.isArray(item[key])){
					let result = false;
					for(let word of item[key]) {
						if (word.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(search) > -1) {
							items.push(item);
							result = true;
							break;
						}
					}
					if(result) break;
					continue;
				}

				if (item[key].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(search) > -1) {
					items.push(item);
					break;
				}
			}
		}
		return items;
	}

	handleError(error: HttpErrorResponse) {

		this.loadingService.unsetLoading();
		let errorText;
		if (error.error instanceof ProgressEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.message);
			errorText = 'Error en la red';
		} else {
			console.error(`Backend returned code ${error.status}, body was: `, error.error);

			switch (error.error.code) {
				case 'duplicate_key':
				errorText = `Parámetro ${error.error.key} duplicado`;
				break;

				case 'invalid_parameters':
				errorText = `Parámetro ${error.error.violations[0].context.label} inválido`;
				break;

				default:
				errorText = error.error.message;
				break;
			}
		}
		// return an observable with a user-facing error message
		return throwError(errorText);
	}
}
