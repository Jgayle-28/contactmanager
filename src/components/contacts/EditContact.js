import React, { Component } from 'react';
import { Consumer } from '../../context';
import TextInputGroup from '../layout/TextInputGroup';
// import uuid from 'uuid';
import axios from 'axios';

class EditContact extends Component {
  state = {
    name: '',
    email: '',
    phone: '',
    errors: {}
  };

  // Fetching Data from API
  async componentDidMount() {
    const { id } = this.props.match.params;
    const res = await axios.get(
      `https://jsonplaceholder.typicode.com/users/${id}`
    );

    const contact = res.data;
    this.setState({
      name: contact.name,
      email: contact.email,
      phone: contact.phone
    });
  }

  // Changes the input state on change
  onInputChange = e => this.setState({ [e.target.name]: e.target.value });

  // Form submit handler
  onFormSubmit = async (dispatch, e) => {
    e.preventDefault();

    // Deconstructing/pulling out the information from the form inputs
    const { name, email, phone } = this.state;

    // Form Validation

    // NAME
    if (name === '') {
      this.setState({ errors: { name: 'Name is required' } });
      return;
    }
    // EMAIL
    if (email === '') {
      this.setState({ errors: { email: 'Email is required' } });
      return;
    }
    // PHONE
    if (phone === '') {
      this.setState({ errors: { phone: 'Phone is required' } });
      return;
    }

    // PUT REQUEST TO API
    const updContact = {
      name,
      email,
      phone
    };
    const { id } = this.props.match.params;

    const res = await axios.put(
      `https://jsonplaceholder.typicode.com/users/${id}`,
      updContact
    );

    dispatch({ type: 'UPDATE_CONTACT', payload: res.data });
    // After a new contact is created we send it to context.js with the type of ADD_CONTACT which triggers the add contact state in context.js and adds it to the contact list
    // dispatch({ type: 'ADD_CONTACT', payload: newContact });

    // Clears the form by setting the state of the inputs to nothing ''
    this.setState({
      name: '',
      email: '',
      phone: '',
      errors: {}
    });

    // Redirects to home page after adding new contact
    this.props.history.push('/');
  };

  render() {
    const { name, email, phone, errors } = this.state;

    return (
      <Consumer>
        {value => {
          const { dispatch } = value;
          return (
            <div className="card mb-3">
              <div className="card-header">Edit Contact</div>
              <div className="card-body">
                <form onSubmit={this.onFormSubmit.bind(this, dispatch)}>
                  {/* Name */}
                  <TextInputGroup
                    label="Name"
                    name="name"
                    placeholder="Enter Name.."
                    value={name}
                    onChange={this.onInputChange}
                    error={errors.name}
                  />
                  {/* Email */}
                  <TextInputGroup
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter Email.."
                    value={email}
                    onChange={this.onInputChange}
                    error={errors.email}
                  />
                  {/* Phone */}
                  <TextInputGroup
                    label="Phone"
                    name="phone"
                    placeholder="Enter Phone.."
                    value={phone}
                    onChange={this.onInputChange}
                    error={errors.phone}
                  />
                  <input
                    type="submit"
                    value="Update Contact"
                    className="btn btn-light btn-block"
                  />
                </form>
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}

export default EditContact;
