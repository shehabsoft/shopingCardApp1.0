import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProductService } from 'src/app/shared/services/product.service';
import { Product } from 'src/app/shared/models/product';
import { ProductF } from 'src/app/shared/models/productF';
import { Router } from '@angular/router';

declare var $: any;
declare var require: any;
declare var toastr: any;
const shortId = require('shortid');
const moment = require('moment');

@Component({
	selector: 'app-add-product',
	templateUrl: './add-product.component.html',
	styleUrls: [ './add-product.component.scss' ]
})
export class AddProductComponent implements OnInit {
  product: ProductF = new ProductF();
  constructor(private productService: ProductService, private router: Router) {
 
  }
  data: ProductF = new Product();
  ngOnInit() {


  }

	createProduct(productForm: NgForm) {
		productForm.value['productId'] = 'PROD_' + shortId.generate();
		productForm.value['productAdded'] = moment().unix();
		productForm.value['ratings'] = Math.floor(Math.random() * 5 + 1);
      if (productForm.value['img_url'] === undefined) {
        productForm.value['img_url'] = '../../../assets/img/estakotha.png';
		}

      productForm.value['favourite'] = false;
      console.log(productForm);
      const date = productForm.value['productAdded'];
      
      this.data.name_ar = productForm.value.name_ar;
      this.data.name_en = productForm.value.name_en;
      this.data.price = productForm.value.price;
      this.data.details = productForm.value.details;
     // this.data.img_url =  productForm.value['img_url'];
      this.data.img_url = '../../../assets/img/estakotha.png';
      this.productService.createProduct1(this.data).subscribe(
        (hero) => {
          console.log(hero);
          this.product = new ProductF();
         
          $('#exampleModalLong').modal('hide');

          toastr.success('product ' + productForm.value['productName'] + 'is added successfully', 'Product Creation');
          this.router.navigate(['products/all-products']);

        }
      );

		
	}
}
