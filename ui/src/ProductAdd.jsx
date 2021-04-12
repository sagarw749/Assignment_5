import React from 'react';

export default class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    const price = form.price.value.replace('$', '');
    const product = {
      name: form.productName.value,
      price: price > 0 ? price : 0,
      category: form.category.value,
      image: form.imageURL.value,
    };
    console.log(product); // eslint-disable-line no-console
    const { createProduct } = this.props;
    createProduct(product);
    form.productName.value = '';
    form.price.value = '$';
    form.category.selectedIndex = 0;
    form.imageURL.value = '';
  }

  render() {
    return (
      <div>
        <form className="flex-container" name="productAdd" onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="category">
              Category
              <br />
              <select id="category" name="category">
                <option value="Shirts">Shirts</option>
                <option value="Jeans">Jeans</option>
                <option value="Jackets">Jackets</option>
                <option value="Sweaters">Sweaters</option>
                <option value="Accessories">Accessories</option>
              </select>
            </label>
          </div>
          <div>
            <label htmlFor="price">
              Price Per Unit
              <br />
              <input type="text" id="price" name="price" defaultValue="$" />
            </label>
          </div>
          <div>
            <label htmlFor="productName">
              Product Name
              <br />
              <input type="text" id="productName" name="productName" />
            </label>
          </div>
          <div>
            <label htmlFor="imageURL">
              Image URL
              <br />
              <input type="text" id="imageURL" name="imageURL" placeholder="URL" />
            </label>
          </div>
          <div>
            <button type="submit">Add Product</button>
          </div>
        </form>
      </div>
    );
  }
}
