import { Component, OnInit } from '@angular/core';
import { Product } from '../../../shared/models/product';
import { ProductService } from '../../../shared/services/product.service';
import { ProductF } from 'src/app/shared/models/productF';
@Component({
	selector: 'app-cart-products',
	templateUrl: './cart-products.component.html',
	styleUrls: [ './cart-products.component.scss' ]
})
export class CartProductsComponent implements OnInit {
	cartProducts: ProductF[];
	showDataNotFound = true;

	// Not Found Message
	messageTitle = 'No Products Found in Cart';
	messageDescription = 'Please, Add Products to Cart';

	constructor(private productService: ProductService) {}

	ngOnInit() {
		this.getCartProduct();
	}

	removeCartProduct(product: Product) {
		this.productService.removeLocalCartProduct(product);

		// Recalling
		this.getCartProduct();
	}

	getCartProduct() {
		this.cartProducts = this.productService.getLocalCartProducts();
	}
}
