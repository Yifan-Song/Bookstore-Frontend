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
import HistoryOrders from './Users/HistoryOrders'
import Order from './Orders/Order'
import ChatRoom from './ChatRoom/ChatRoom'
import PrivateChatRoom from './ChatRoom/PrivateChatRoom'
import registerServiceWorker from './Users/registerServiceWorker';
import RegistrationForm from './Users/register'
import { Form } from 'antd';
import { Route, Switch, HashRouter} from 'react-router-dom';
import Head from './HomePage/HeadBar';
import Cookies from 'universal-cookie'


const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
const WrappedRegistrationForm = Form.create()(RegistrationForm);
var cookies = new Cookies();

class Store extends React.Component {
    constructor(props) {
        super(props)
        if (cookies.get('JSESSIONID') === 'null') {
            cookies.remove("login")
            cookies.remove("userid")
            cookies.remove("role")
        }

        this.state = {
            login: cookies.get('login'),
            role: cookies.get('role'),
            userid: cookies.get('userid'),
        }
    }

    LoginSuccessHandler = (userid, username, role) => {
        cookies.set("login",true,{path : '/'});
        cookies.set("role",role,{path : '/'});
        cookies.set("userid",userid,{path : '/'});
        cookies.set("username",username,{path : '/'});
        window.location.href = "http://localhost:3000"
        this.setState({
            username: username,
            userid: userid,
            role:role,
            login:true,
        })
    }

    handleLogout = () => {
        fetch("http://localhost:8080/api/logout",{
            method: 'get',
            credentials: 'include'
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        login: 'null',
                        userid: 'null',
                        role: 'null'
                    });
                    cookies.remove("JSESSIONID")
                    cookies.remove("login")
                    cookies.remove("userid")
                    cookies.remove("role")
                    window.location.href = "/";
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    render(){
        let login = this.state.login;
        let role = this.state.role;
        let userid = this.state.userid;
        return(
            <div>
                <Head login={login} role={role} username={userid} handleLogout = {this.handleLogout}/>
                <Switch>
                    <Route exact path='/' component={App} />
                    <Route path='/Admin' component={Table} />
                    <Route path="/Login" render={ (props) => <WrappedNormalLoginForm LoginSuccessHandler={this.LoginSuccessHandler} {...props}/> }/>
                    <Route path='/Register' component={WrappedRegistrationForm} />
                    <Route path='/Cart' component={Cart} />
                    <Route path='/BookList' component={BookList} />
                    <Route path='/Book' component={Book} />
                    <Route path='/User' component={User} />
                    <Route path='/HistoryOrders' component={HistoryOrders} />
                    <Route path='/Order' component={Order} />
                    <Route path='/ChatRoom' component={ChatRoom} />
                    <Route path='/PrivateChatRoom' component={PrivateChatRoom} />
                </Switch>
            </div>
        )
    }
}

export default Store