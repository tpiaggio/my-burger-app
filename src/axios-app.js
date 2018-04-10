import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://reactburgerbuilderapp.firebaseio.com/'
});

export default instance;