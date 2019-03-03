import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
	selector: 'app-pagination',
	templateUrl: './pagination.component.html',
	styleUrls: ['./pagination.component.less']
})
export class PaginationComponent implements OnInit, OnChanges {

	@Input() items: any;
	@Input() pageSize: number = 10;
	@Input() maxPages: number = 5;
	@Output() itemsChange = new EventEmitter<any>();

	page = 1;


	get pages() {
		return Math.ceil(this.items.length / this.pageSize);
	}

	get numbers() {
		let first = Math.round(this.page - this.maxPages / 2);
		first = first < 1 ? 1 : first;
		let last = first + this.maxPages - 1;
		last = last > this.pages ? this.pages : last;
		let ans = [];
		for (let i = first; i <= last; i++) {
			ans.push(i);
		}
		return ans;
	}

	constructor() { }

	ngOnInit() {

	}

	ngOnChanges(changes: SimpleChanges) {
		if(this.page > this.pages) {
			this.page = this.pages;
		}
		if(this.page < 1) {
			this.page = 1;
		}

		this.updateItems();
	}

	updateItems() {
		this.itemsChange.emit(this.items.slice((this.page - 1) * this.pageSize, this.page * this.pageSize))
	}

	goPage(page) {
		this.page = page;
		this.updateItems();
	}

	nextPage() {
		this.page++;
		this.updateItems();
	}

	prevPage() {
		this.page--;
		this.updateItems();
	}

}
