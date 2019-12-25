import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Product } from '../models/product';
import { AuthService } from './auth.service';
import { ToastrService } from './toastr.service';
import { Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductF } from '../models/productF';
import { EventEmitter } from 'events';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const apiUrl = "http://localhost:8090/Product/";
@Injectable()
export class ProductService {
  productsObs: Observable<ProductF[]>;
  products: ProductF[];
  product: ProductF = new ProductF;
 
	// favouriteProducts
	favouriteProducts: AngularFireList<FavouriteProduct>;
	cartProducts: AngularFireList<FavouriteProduct>;

	// NavbarCounts
	navbarCartCount = 0;
	navbarFavProdCount = 0;

	constructor(
		private db: AngularFireDatabase,
		private authService: AuthService,
      private toastrService: ToastrService, private http: HttpClient 
	) {
		this.calculateLocalFavProdCounts();
      this.calculateLocalCartProdCounts();
      this.getProducts().subscribe((heros) => {
        this.products = heros;
      });
	}
  getProducts1(): Observable<ProductF[]> {
    return this.http.get<ProductF[]>(apiUrl, httpOptions).pipe(
      tap(heroes => console.log('fetched products'))
      

    );
  }

 
  getProducts(): Observable<ProductF[]> {
		////this.products = this.db.list('products');
      // return this.products;
    this.productsObs = this.getProducts1();
    this.productsObs.subscribe(heros => {
      localStorage.setItem('item_list', JSON.stringify(heros));
    });

        
      return this.productsObs;
  }
 

  createProduct1(data: ProductF): Observable<ProductF> {
    console.log("Before Creation")
    data.id = 1000;
    
    return this.http.post<ProductF>(apiUrl, data, httpOptions).pipe(
      tap(hero => {
        console.log(hero);
        let a: ProductF[];
        a = JSON.parse(localStorage.getItem('item_list')) || [];
        a.push(data);
        localStorage.setItem('item_list', JSON.stringify(a));
        this.getProducts().subscribe((heros) => {
          this.products = heros
        });
      }
      )
    );
  
   
  }
  createProduct(data: ProductF) {

     return  this.createProduct1(data);

	}
  getProduct(id: string): Observable<Product> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<Product>(url).pipe(
      tap(heros => console.log(`fetched product id=${id}`))
    );
    
  }
   
   
	updateProduct(data: ProductF) {
	//	this.products.update(data.$key, data);
	}

  deleteProduct(key: string): Observable<Product> {
      const url = `http://localhost:8090/Product/${key}`;

      return this.http.delete<Product>(url, httpOptions).pipe(
        tap(_ => {

          console.log(`deleted product id=${key}`);

          this.getProducts().subscribe((heros) => {
            this.products = heros
          });
        })
        
      );
	}

	/*
   ----------  Favourite Product Function  ----------
  */

	// Get Favourite Product based on userId
	getUsersFavouriteProduct() {
		const user = this.authService.getLoggedInUser();
		this.favouriteProducts = this.db.list('favouriteProducts', (ref) =>
			ref.orderByChild('userId').equalTo(user.$key)
		);
		return this.favouriteProducts;
	}

	// Adding New product to favourite if logged else to localStorage
	addFavouriteProduct(data: ProductF): void {
		let a: ProductF[];
		a = JSON.parse(localStorage.getItem('avf_item')) || [];
		a.push(data);
		this.toastrService.wait('Adding Product', 'Adding Product as Favourite');
		setTimeout(() => {
			localStorage.setItem('avf_item', JSON.stringify(a));
			this.calculateLocalFavProdCounts();
		}, 1500);
	}

	// Fetching unsigned users favourite proucts
	getLocalFavouriteProducts(): ProductF[] {
		const products: ProductF[] = JSON.parse(localStorage.getItem('avf_item')) || [];

		return products;
	}

	// Removing Favourite Product from Database
	removeFavourite(key: string) {
		this.favouriteProducts.remove(key);
	}

	// Removing Favourite Product from localStorage
	removeLocalFavourite(product: ProductF) {
		const products: ProductF[] = JSON.parse(localStorage.getItem('avf_item'));

		for (let i = 0; i < products.length; i++) {
			if (products[i].id === product.id) {
				products.splice(i, 1);
				break;
			}
		}
		// ReAdding the products after remove
		localStorage.setItem('avf_item', JSON.stringify(products));

		this.calculateLocalFavProdCounts();
	}

	// Returning Local Products Count
	calculateLocalFavProdCounts() {
		this.navbarFavProdCount = this.getLocalFavouriteProducts().length;
	}

	/*
   ----------  Cart Product Function  ----------
  */

	// Adding new Product to cart db if logged in else localStorage
	addToCart(data: ProductF): void {
      let a: ProductF[];
      data.quantity = 1;
		a = JSON.parse(localStorage.getItem('avct_item')) || [];

		a.push(data);
		this.toastrService.wait('Adding Product to Cart', 'Product Adding to the cart');
		setTimeout(() => {
			localStorage.setItem('avct_item', JSON.stringify(a));
			this.calculateLocalCartProdCounts();
		}, 500);
	}

	// Removing cart from local
	removeLocalCartProduct(product: Product) {
		const products: Product[] = JSON.parse(localStorage.getItem('avct_item'));

		for (let i = 0; i < products.length; i++) {
			if (products[i].productId === product.productId) {
				products.splice(i, 1);
				break;
			}
		}
		// ReAdding the products after remove
		localStorage.setItem('avct_item', JSON.stringify(products));

		this.calculateLocalCartProdCounts();
	}

	// Fetching Locat CartsProducts
	getLocalCartProducts(): ProductF[] {
		const products: ProductF[] = JSON.parse(localStorage.getItem('avct_item')) || [];

		return products;
  }
  updateQuantityOnLocalStorage(product: ProductF) {
    const products = this.getLocalCartProducts();
    for (let i = 0; i < products.length; i++) {
      if (product.id === products[i].id) {
        products[i].quantity = product.quantity;
      }
    }
    localStorage.setItem('avct_item', JSON.stringify(products));

    this.calculateLocalCartProdCounts();

  }
	// returning LocalCarts Product Count
	calculateLocalCartProdCounts() {
		this.navbarCartCount = this.getLocalCartProducts().length;
	}
}

export class FavouriteProduct {
	product: ProductF;
	productId: string;
	userId: string;
}
