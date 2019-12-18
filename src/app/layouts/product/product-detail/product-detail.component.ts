import { Product } from '../../../shared/models/product';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { ProductF } from 'src/app/shared/models/productF';
@Component({
	selector: 'app-product-detail',
	templateUrl: './product-detail.component.html',
	styleUrls: [ './product-detail.component.scss' ]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
	private sub: any;
	product: ProductF;

	constructor(
		private route: ActivatedRoute,
		private productService: ProductService,
		private toastrService: ToastrService
	) {
		this.product = new ProductF();
	}

	ngOnInit() {
		this.sub = this.route.params.subscribe((params) => {
			const id = params['id']; // (+) converts string 'id' to a number
			this.getProductDetail(id);
		});
	}

	getProductDetail(id: string) {
		// this.spinnerService.show();
      this.product = this.productService.getProductById(id);
		 
	}

	addToCart(product: ProductF) {
		this.productService.addToCart(product);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}
}
