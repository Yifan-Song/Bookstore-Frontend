/**
 * Created by Bo on 4/2/2018.
 */
import React, { Component } from 'react';
import { Icon,Card, Button} from 'antd';
import {Link } from 'react-router-dom';
import './User.css';
import Cookies from 'universal-cookie'

var cookies = new Cookies();
class User extends Component {
    constructor(props) {
        super(props);
        this.fetchUser();
        this.state = {
            username: "",
            gender: '',
            phone: 0,
            email: "",
            address: "",
            role: ""
        }
    }
    fetchUser = () => {
        let msg = "userid="+ encodeURIComponent(cookies.get("userid"));
        fetch("http://localhost:8080/api/users/get", {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: msg
        })
            .then(
                res => res.json()
            )
            .then(
                (result) => {
                    console.log("User fetched:")
                    console.log(result)
                    this.setState(result)
                }
            )
    }

    render(){

        return(
            <div>
                <Icon type="user" className="icon" style={{ fontSize: 120 }} />
                <Card style={{ width: 300 }} className = "information">
                    <p>UserName:  {this.state.username} </p>
                    <p>Gender: {this.state.gender}</p>
                    <p>PhoneNumber: {this.state.phone}</p>
                    <p>Address: {this.state.address}</p>
                    <p>Email: {this.state.email}</p>
                    <p>Role: {this.state.role}</p>
                </Card>
                <Link to={'/Orders'}><Button className="OrderButton">History Orders</Button></Link>
            </div>
        );
    }
}

export default User