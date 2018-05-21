import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './HomePage/App';
import Table from './Admin/Table.js'
import NormalLoginForm from'./Users/Login'
import Cart from './Cart/Cart'
import BookList from './BookList/BookList'
import Book from './Books/Book'
import User from './Users/User'
import Store from './Store.js'
import registerServiceWorker from './Users/registerServiceWorker';
import { Route, Switch, HashRouter} from 'react-router-dom';


ReactDOM.render(
    (
        <HashRouter>
            <Store />
        </HashRouter>
    ),
    document.getElementById("root")
);

registerServiceWorker();