import React, { Component } from 'react'

import axios from '../../axios-app'
import withErrorHandler from '../../hoc/withErrorHandler'

import Aux from '../../hoc/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import Spinner from '../../components/UI/Spinner/Spinner'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {
    
    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    }
    
    componentDidMount() {
        axios.get('/ingredients.json')
        .then(response => {
            this.setState( { 
                ingredients: response.data, 
                purchaseable: Object.keys(response.data).length>0 
            } );
        }).catch(error => {
            this.setState({error: true});            
        });
    }
    
    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
            }).reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({purchaseable: sum > 0 });
    }
    
    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCounted = oldCount + 1;
        const updatedIngredientes = {
            ...this.state.ingredients
        };
        updatedIngredientes[type] = updatedCounted;
        
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredientes });
        this.updatePurchaseState(updatedIngredientes);
    }
    
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount > 0){
            const updatedCounted = oldCount - 1;
            const updatedIngredientes = {
                ...this.state.ingredients
            };
            updatedIngredientes[type] = updatedCounted;
            
            const priceReduction = INGREDIENT_PRICES[type];
            const oldPrice = this.state.totalPrice;
            const newPrice = oldPrice - priceReduction;
            
            this.setState({ totalPrice: newPrice, ingredients: updatedIngredientes });
            this.updatePurchaseState(updatedIngredientes);
        }
    }
    
    purchaseHandler = () => {
        this.setState({purchasing: true});
    }
    
    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }
    
    purchaseContinueHandler = () => {
        const queryParams = [];
        for(let i in this.state.ingredients){
        const param = encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]);
            queryParams.push(param);
        }
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }
    
    render () {
        const disabledInfo = {...this.state.ingredients};
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;
        if(this.state.ingredients) {
            burger = (
              <Aux>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls disabled={disabledInfo}
                purchaseable={this.state.purchaseable}
                price={this.state.totalPrice}
                ingredientAdded={this.addIngredientHandler}
                ingredientRemoved={this.removeIngredientHandler}
                ordered={this.purchaseHandler} />
              </Aux>
            );
            orderSummary = <OrderSummary 
                        ingredients={this.state.ingredients}
                        price={this.state.totalPrice}
                        purchaseCancelled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaseContinueHandler}
                        />;
            if(this.state.loading){
                orderSummary = <Spinner />
            }
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
};

export default withErrorHandler(BurgerBuilder, axios);