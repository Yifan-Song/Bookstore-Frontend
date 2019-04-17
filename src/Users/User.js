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
        this.searchBlog()
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

    addFriend = () =>{
        fetch("http://localhost:8080/api/neoTest", {
            method: 'Get',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
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

    addBlog = () =>{
        fetch("http://127.0.0.1:9200/blog/userBlog/", {
            method: 'Post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
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

    searchBlog = () =>{
        fetch("http://127.0.0.1:9200/test/_search?", {
            method: 'Post',
            mode: "cors",    
            credentials: 'omit',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({query : {match : { bookname: "小" }}})
        })
            .then(
                res => res.json()
            )
            .then(
                (result) => {
                    console.log("Blog fetched:")
                    console.log(result)
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
                    <Col span={4}  offset={7}>
                        <Link to={'/HistoryOrders'}><Button type="primary" className="orderButton">History Orders</Button></Link>
                    </Col>
                    <Col span={4}>
                        <Link to={'/HistoryOrders'}><Button type="primary" className="favoriteButton">Favorite</Button></Link> 
                    </Col>
                    <Col span={4}>
                        <Button type="primary" className="favoriteButton" onClick={this.addFriend}>Add Friend</Button>
                    </Col>
                </Row>
                <br/>
            </div>
        );
    }
}

export default User