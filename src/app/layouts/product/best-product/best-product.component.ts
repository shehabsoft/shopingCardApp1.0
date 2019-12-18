import { TranslateService } from 'src/app/shared/services/translate.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/product.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { ProductF } from 'src/app/shared/models/productF';

@Component({
	selector: 'app-best-product',
	templateUrl: './best-product.component.html',
	styleUrls: [ './best-product.component.scss' ]
})
export class BestProductComponent implements OnInit {
	bestProducts: ProductF[] = [];
	options: any;
	loading = false;
	constructor(
		private productService: ProductService,
		private toasterService: ToastrService,
		public translate: TranslateService
	) {}

	ngOnInit() {
		this.options = {
			dots: false,
			responsive: {
				'0': { items: 1, margin: 5 },
				'430': { items: 2, margin: 5 },
				'550': { items: 3, margin: 5 },
				'670': { items: 4, margin: 5 }
			},
			autoplay: true,
			loop: true,
			autoplayTimeout: 3000,
			lazyLoad: true
		};
		this.getAllProducts();
	}

	getAllProducts() {
		this.loading = true;
		const x = this.productService.getProducts1();
		x.subscribe(
          (product) => {
            console.log(product);
				this.loading = false;
            this.bestProducts = [];
            for (let i = 0; i < product.length; i++) {
                  const y = product[i];
					y['id'] = product[i].id;
					this.bestProducts.push(y as ProductF);
				}
				// product.forEach(element => {
				//   const y = element.payload.toJSON();
				//   y["$key"] = element.key;
				//   this.bestProducts.push(y as Product);
				// });
			},
			(error) => {
				this.toasterService.error('Error while fetching Products', error);
			}
		);
	}
}
