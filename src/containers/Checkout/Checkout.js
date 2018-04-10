import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import ContactData from './ContactData/ContactData'
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'

class Checkout extends Component {
    
    state = {
        ingredients: {},
        price: 0
    }
    
    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        const ingredients = {};
        for(let param of query){
            ingredients[param[0]] = +param[1];
        }
        this.setState({ingredients: ingredients});
    }
    
    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }
    
    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }
    
    render() {
        
        return (
            <div>
                <CheckoutSummary ingredients={this.state.ingredients}
                onCheckoutCancelled={this.checkoutCancelledHandler}
                onCheckoutContinued={this.checkoutContinuedHandler}
                />
                <Route path={this.props.match.path + '/contact-data'} 
                render={(props) => ( <ContactData ingredients={this.state.ingredients}
                price={this.state.price} {...props} />)}/>
            </div>
        );
    }
};

export default Checkout;