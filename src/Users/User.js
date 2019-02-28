/**
 * Created by Bo on 4/2/2018.
 */
import React, { Component } from 'react';
import { Icon,Card, Button,Row, Col} from 'antd';
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
                <Row>
                    <Col span={2}  offset={11}>
                        <Icon type="user" className="icon" style={{ fontSize: 150 }} />
                    </Col>
                </Row>
                <Row>
                    <Card style={{ width: 500 }} className = "informationCard">
                        <p>UserName:  {this.state.username} </p>
                        <p>Gender: {this.state.gender}</p>
                        <p>PhoneNumber: {this.state.phone}</p>
                        <p>Address: {this.state.address}</p>
                        <p>Email: {this.state.email}</p>
                        <p>Role: {this.state.role}</p>
                    </Card>
                </Row>
                <Row>
                    <Col span={4}  offset={8}>
                        <Link to={'/Orders'}><Button type="primary" className="orderButton">History Orders</Button></Link>
                    </Col>
                    <Col span={4} offset={2}>
                        <Link to={'/Orders'}><Button type="primary" className="favoriteButton">Favorite</Button></Link> 
                    </Col>
                </Row>
                <br/>
            </div>
        );
    }
}

export default User