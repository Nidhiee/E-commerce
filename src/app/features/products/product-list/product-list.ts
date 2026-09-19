import { Component } from '@angular/core';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [],
  template: `
    <h1>Electronics Shop</h1>

    <p>Welcome to our electronics store!</p>

    <h2>Products</h2>

    <div>
      <h3>iPhone 15</h3>
      <p>Price: ₹70,000</p>
      <button>View Product</button>
    </div>

    <div>
      <h3>Samsung Galaxy S24</h3>
      <p>Price: ₹65,000</p>
      <button>View Product</button>
    </div>
  `
})
export class ProductList {
}