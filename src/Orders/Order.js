import React, { Component } from 'react';
import { Table, Input, Button, Popconfirm ,Icon,message } from 'antd';
import './Order.css';
import Cookies from "universal-cookie";

var cookies = new Cookies();

var tempPrice = 0;

const Search = Input.Search;

function cancel(e) {
    message.error('未下单');
}

function encoder(msg){
    var encoded = btoa(msg);
    var newEncoded = ""
    var newChar = ''

    for(var i = 0; i < encoded.length; i++){

        newChar = String.fromCharCode(parseInt(encoded.charAt(i).charCodeAt())+parseInt(cookies.get("userid")))
        newEncoded += newChar


    }
    return newEncoded
}

function decoder(msg){
    var newEncoded = ""
    var newChar = ''
    for(var i = 0; i < msg.length; i++){
        newChar = String.fromCharCode(msg.charAt(i).charCodeAt()-cookies.get("userid"))
        newEncoded += newChar
    }
    var decoded = atob(newEncoded)
    return decoded
}

class Order extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filterDropdownVisible: false,
            searchText: '',
            filtered: false,
            dataSource: [],
            count : 4,
            totalPrice : 0,
            bluerows : []
        };
        this.fetchOrder();

        this.columns = [
        {
            title: 'BookName',
            dataIndex: 'bookname',
            width: '20%',
            filteredValue: this.state.searchText || null,
            onFilter: (filteredValue, record) => record.name.includes(filteredValue),
            sorter: (a, b) => b.bookname.length - a.bookname.length,
        },{
            title: 'Author',
            dataIndex: 'author',
            width: '20%',
            sorter: (a, b) => b.author.length - a.author.length,
        },{
            title: 'Price(¥)',
            dataIndex: 'price',
            width: '20%',
            sorter: (a, b) => b.price - a.price,
        }, {
            title: 'number',
            dataIndex: 'number',
            width: '20%',
            sorter: (a, b) => b.number - a.number,
        },{
            title: '价格',
            dataIndex: 'totalPrice',
            width: '20%',
            render: (text, record) => {
                var thisTotalPrice = record.price*100
                thisTotalPrice *= record.number
                thisTotalPrice /= 100
                return (
                    <p>{thisTotalPrice}</p>
                )                    
            },
        }];
        this.cacheData = this.state.dataSource.map(item => ({ ...item }));
    }

    handlePay = () => {
        var currentTime = new Date();
        var timeStr = currentTime.toLocaleString();
        console.log(this.state.totalPrice)
        console.log(encoder(this.state.totalPrice))
        let msg = "price="+ encodeURIComponent(encoder(this.state.totalPrice)) + "&time=" + encodeURIComponent(timeStr)
        console.log("msg:"+msg)
        fetch("http://localhost:8080/api/orders/pay", {
            method: 'Post',
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
                    this.setState({bluerows:[]});
                    console.log("Order Paid:")
                    console.log(result)
                    message.success('支付成功！');
                    window.location.href = "http://localhost:3000"
                }
            )

    }

    fetchOrder = () => {
        var price = 0
        fetch("http://localhost:8080/api/orders/get", {
            method: 'GET',
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
                    console.log("Order fetched:")
                    console.log(result)
                    this.setState({dataSource: result})
                    for(var i in result){
                        var book = result[i]
                        var tempPrice = book["price"] * 100
                        price += (tempPrice*book["number"])/100
                    }
                    this.setState({totalPrice: price})
                }
            )
    }

    render() {
        const { dataSource } = this.state;
        const columns = this.columns;
        return(
            <div>
                <header><Icon type="shopping-cart" className="shopping-cart" style={{ fontSize: 60 }} /></header>,
                <h1 className="Shopping-cart-title">Pay order</h1>
                <Table className = "table" bordered  dataSource={dataSource} columns={columns}/>
                
                <p className="price">总价：{this.state.totalPrice} 元</p>

                <Popconfirm  title="确认付款?" onConfirm={this.handlePay} onCancel={cancel} okText="Yes" cancelText="No">
                    <Button type={"primary"} className = "buy-button">付款</Button>
                </Popconfirm>
                
            </div>
        );
    }
};

export default Order