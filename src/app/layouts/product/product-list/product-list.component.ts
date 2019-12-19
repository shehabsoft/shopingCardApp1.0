import { Component, OnInit } from '@angular/core';
import { Product } from '../../../shared/models/product';
import { AuthService } from '../../../shared/services/auth.service';
import { ProductService } from '../../../shared/services/product.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { ProductF } from 'src/app/shared/models/productF';
declare var toastr: any;
@Component({
	selector: 'app-product-list',
	templateUrl: './product-list.component.html',
	styleUrls: ['./product-list.component.scss']
})

export class ProductListComponent implements OnInit{
	productList: ProductF[];
	loading = false;
	brands = ['All', 'SUEZS', 'CANAL', 'ASSIUT', 'Nokia', 'Motorolla'];
  
	selectedBrand: 'All';

	page = 1;
	constructor(
		public authService: AuthService,
		private productService: ProductService,
		private toastrService: ToastrService
	) { }

	ngOnInit() {
		this.getAllProducts();
  }

	getAllProducts() {
		// this.spinnerService.show();
		this.loading = true;
		const x = this.productService.getProducts();
		x.subscribe(
			(product) => {
				this.loading = false;
				// this.spinnerService.hide();
				this.productList = [];
              product.forEach((element) => {
                console.log(element);
                
                this.productList.push(element);
              
              });
              
			},
			(err) => {
				this.toastrService.error('Error while fetching Products', err);
			}
		);
	}

	removeProduct(key: string) {
      this.productService.deleteProduct(key).subscribe(
        (hero) => {
          console.log(hero);
          toastr.success('product  is Deleted successfully', 'Product Deletion');
          this.getAllProducts();
        }
      );
	}

	addFavourite(product: ProductF) {
		this.productService.addFavouriteProduct(product);
	}

	addToCart(product: ProductF) {
		this.productService.addToCart(product);
	}
}
