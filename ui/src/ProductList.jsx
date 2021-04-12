import React from 'react';

import ProductTable from './ProductTable.jsx';
import ProductAdd from './ProductAdd.jsx';
import graphQLFetch from './graphQLFetch.js';

export default class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.createProduct = this.createProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
      productList {
        id category name price image
      }
    }`;

    const result = await graphQLFetch(query);
    this.setState({ products: result.productList });
  }

  async createProduct(newProduct) {
    const query = `mutation productAdd($newProduct: ProductInputs!) {
      productAdd(product: $newProduct) {
        id
      }
    }`;

    const response = await graphQLFetch(query, { newProduct });
    if (response) {
      this.loadData();
    }
  }

  async deleteProduct(index) {
    const query = `mutation productDelete($id: Int!) {
      productDelete(id: $id)
    }`;
    const { products } = this.state;
    const { id } = products[index];
    const data = await graphQLFetch(query, { id });
    console.log(data); // eslint-disable-line no-console
    if (data && data.productDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.products];
        newList.splice(index, 1);
        return { products: newList };
      });
    } else {
      this.loadData();
    }
  }

  render() {
    const { products } = this.state;
    return (
      <div>
        <h1>My Company Inventory</h1>
        <h2>Showing all available products</h2>
        <hr />
        <ProductTable
          products={products}
          deleteProduct={this.deleteProduct}
        />
        <h2>Add a new product to inventory</h2>
        <hr />
        <ProductAdd createProduct={this.createProduct} />
      </div>
    );
  }
}
