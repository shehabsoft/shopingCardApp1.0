import { Component, OnInit } from '@angular/core';
import { Product } from '../../../shared/models/product';
import { ProductService } from '../../../shared/services/product.service';
import { ProductF } from 'src/app/shared/models/productF';
@Component({
	selector: 'app-favourite-products',
	templateUrl: './favourite-products.component.html',
	styleUrls: [ './favourite-products.component.scss' ]
})
export class FavouriteProductsComponent implements OnInit {
	favoruiteProducts: ProductF[];
	showDataNotFound = true;

	// Not Found Message
	messageTitle = 'No Favourite Products Found';
	messageDescription = 'Please, choose your favourite products';

	constructor(private productService: ProductService) {}

	ngOnInit() {
		this.getFavouriteProduct();
	}
	removeFavourite(product: ProductF) {
		this.productService.removeLocalFavourite(product);

		this.getFavouriteProduct();
	}

	getFavouriteProduct() {
		this.favoruiteProducts = this.productService.getLocalFavouriteProducts();
	}
}
