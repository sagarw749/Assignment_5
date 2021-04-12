/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import { Link } from 'react-router-dom';

import NumInput from './NumInput.jsx';
import TextInput from './TextInput.jsx';
import graphQLFetch from './graphQLFetch.js';

export default class ProductEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      product: {},
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
      product: { ...prevState.product, [name]: value },
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { product } = this.state;
    console.log(product); // eslint-disable-line no-console
    const query = `mutation productUpdate(
      $id: Int!
      $changes: ProductUpdateInputs!
    ) {
      productUpdate(
        id: $id
        changes: $changes
      ) {
        id category name price image
      }
    }`;
    const { id, created, ...changes } = product;
    const data = await graphQLFetch(query, { changes, id });
    if (data) {
      this.setState({ product: data.productUpdate });
      alert('Updated product successfully'); // eslint-disable-line no-alert
    }
  }

  async loadData() {
    const query = `query product($id: Int!) {
      product(id: $id) {
        id category name price image
      }
    }`;

    const { match: { params: { id } } } = this.props;
    const data = await graphQLFetch(query, { id });
    this.setState({ product: data ? data.product : {} });
  }

  render() {
    const { product: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Product with ID ${propsId} not found.`}</h3>;
      }
      return null;
    }

    const { product: { category, name } } = this.state;
    const { product: { price, image } } = this.state;

    return (
      <div>
        <h2>
          {`Editing product: ${id}`}
          {' | '}
          <Link to={`/edit/${id - 1}`}>Prev</Link>
          {' | '}
          <Link to={`/edit/${id + 1}`}>Next</Link>
          {' | '}
          <Link to="/products">Home</Link>
        </h2>
        <form className="flex-container" name="productEdit" onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="category">
              Category
              <br />
              <select id="category" name="category" value={category} onChange={this.onChange}>
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
              <NumInput
                id="price"
                name="price"
                value={price}
                onChange={this.onChange}
                key={id}
              />
            </label>
          </div>
          <div>
            <label htmlFor="name">
              Product Name
              <br />
              <TextInput
                id="name"
                name="name"
                value={name}
                onChange={this.onChange}
                key={id}
              />
            </label>
          </div>
          <div>
            <label htmlFor="image">
              Image URL
              <br />
              <TextInput
                id="image"
                name="image"
                value={image}
                onChange={this.onChange}
                key={id}
              />
            </label>
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}
