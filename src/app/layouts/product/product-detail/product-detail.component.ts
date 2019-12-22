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
          console.log("get produt Details with ID " + id);
			this.getProductDetail(id);
		});
	}

	getProductDetail(id: string) {
		// this.spinnerService.show();
      this.productService.getProduct(id).subscribe(hero => {
        console.log(hero);
        this.product = hero;

        console.log("Product Details " + this.product.name_en);
      });
		 
	}

	addToCart(product: ProductF) {
		this.productService.addToCart(product);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}
}
