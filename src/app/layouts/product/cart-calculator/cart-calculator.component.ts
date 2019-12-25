import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Product } from '../../../shared/models/product';
import { ProductF } from 'src/app/shared/models/productF';

@Component({
	selector: 'app-cart-calculator',
	templateUrl: './cart-calculator.component.html',
	styleUrls: [ './cart-calculator.component.scss' ]
})
export class CartCalculatorComponent implements OnInit, OnChanges {
	@Input() products: ProductF[];

	totalValue = 0;
	constructor() {}

	ngOnChanges(changes: SimpleChanges) {
		const dataChanges: SimpleChange = changes.products;

		const products: ProductF[] = dataChanges.currentValue;
		this.totalValue = 0;
		products.forEach((product) => {
          this.totalValue += product.price * product.quantity;
		});
	}

	ngOnInit() {}
}
