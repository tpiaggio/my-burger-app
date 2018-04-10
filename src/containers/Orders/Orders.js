import React, { Component } from 'react'
import axios from '../../axios-app'
import withErrorHandler from '../../hoc/withErrorHandler'

import Order from '../../components/Order/Order'
import Spinner from '../../components/UI/Spinner/Spinner'

class Orders extends Component {
    
    state = {
        orders: [],
        loading: true,
        error: false
    }
    
    componentDidMount() {
        axios.get('/orders.json')
        .then(response => {
            const fetchedOrders = [];
            for(let key in response.data){
                fetchedOrders.push({
                    ...response.data[key],
                    id: key
                });
            }
            this.setState( { 
                orders: fetchedOrders,
                loading: false
            } );
        }).catch(error => {
            this.setState({
                error: true,
                loading: false
            });            
        });
    }
    
    render() {
        
        let orders = this.state.error ? <p>Orders can't be loaded</p> : <Spinner />;
        if(this.state.orders){
            orders = this.state.orders.map(order => {
                return <Order key={order.id}
                ingredients={order.ingredients}
                price={+order.price} />
            });
        }
        
        return (
            <div>
                { orders }
            </div>
        );
    }
};

export default withErrorHandler(Orders, axios);