/**
 * Created by Bo on 4/2/2018.
 */
import React, { Component } from 'react';
import { Card,Button,Popconfirm,message } from 'antd';
import './Book.css';
import Cookies from 'universal-cookie'

var cookies = new Cookies();

const tabListNoTitle = [{
    key: 'book',
    tab: '书籍简介',
}, {
    key: 'author',
    tab: '作者简介',
}];

class Book extends Component{
    constructor(props) {
        super(props);
        if(props.location.state === undefined){
            bookid = 1
        }
        else{
            var bookid = props.location.state["id"]
        }
        this.state = {
            id : bookid,
            imagePath : "",
            key: 'tab1',
            noTitleKey: 'book',
            author: "",
            authorAbstract: "",
            bookname: "",
            bookAbstract: "",
            isbn: "",
            press: "",
            price: "",
            year: 0,
            sales: 0,
            stock: 0
        }
        this.fetchBookById(bookid)
    }

    addToCart = () =>{
        let msg = "userid="+ encodeURIComponent(cookies.get("userid")) +
            "&bookname="+ encodeURIComponent(this.state.bookname) +
            "&bookpath="+ encodeURIComponent(this.state.imagePath) +
            "&bookid="+ encodeURIComponent(this.state.id) +
            "&price="+ encodeURIComponent(this.state.price) +
            "&author="+ encodeURIComponent(this.state.author) +
            "&year="+ encodeURIComponent(this.state.year) +
            "&number="+ encodeURIComponent("1");
        fetch("http://localhost:8080/api/cart/add", {
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
                    console.log("Cartitem added:")
                    console.log(result)
                    message.success('添加购物车成功！');
                }
            )
    }

    fetchBookById  = (id) => {
        fetch("http://localhost:8080/api/bookid/"+id, {
            method: 'GET',
            credentials: 'include'
        })
            .then(
                (result) => {
                    var that = this
                    console.log("book fetched:")
                    result.json().then(function(data){
                        console.log(data[0])
                        that.setState({
                            imagePath: data[0]["bookpath"],
                            author: data[0]["author"],
                            authorAbstract: data[0]["authorAbstract"],
                            bookname: data[0]["bookname"],
                            bookAbstract: data[0]["bookAbstract"],
                            isbn: data[0]["isbn"],
                            press: data[0]["press"],
                            price: data[0]["price"],
                            year: data[0]["year"],
                            sales: data[0]["salesVolume"],
                            stock: data[0]["stock"]
                        })
                    })
                }
            )
    }

    onTabChange = (key, type) => {
        console.log(key, type);
        this.setState({ [type]: key });
    }

    handleAddToCart = () =>{
        render: (text, record) => {
            return (
                <Popconfirm title="确定将本书添加到购物车?" onConfirm={() => this.addToCart()}>
                    <a>添加到购物车</a>
                </Popconfirm>
            );
        }
    }

    render(){

        var contentListNoTitle = {
            book: <p>{this.state.bookAbstract}</p>,
            author: <p>{this.state.authorAbstract}</p>,
        };
        return(
        <div style={{ background: '#ECECEC', padding: '30px',height:'100%'  }}>

            <Card title={this.state.bookname} bordered={false} className = "card1">
                <img src={this.state.imagePath} className="bookImage"/>
                <Button type="primary" onClick={this.addToCart} className="addToCartButton">添加到购物车</Button>
                <Button type="primary" onClick={this.handleAddToCart} className="addToFavoriteButton">添加到收藏夹</Button>
                
                <Card bordered={false} style={{ width: 300 }} className = "card1-1">
                    <p>书籍信息: </p>
                    <p>作者: {this.state.author}</p>
                    <p>出版社: {this.state.press}</p>
                    <p>出版年: {this.state.year}</p>
                    <p>定价: {this.state.price}</p>
                    <p>销量: {this.state.sales}</p>
                    <p>库存: {this.state.stock}</p>
                    <p>ISBN: {this.state.isbn}</p>
                </Card>
            </Card>

            <Card className="card2"
                tabList={tabListNoTitle}
                activeTabKey={this.state.noTitleKey}
                onTabChange={(key) => { this.onTabChange(key, 'noTitleKey'); }}
            >
                {contentListNoTitle[this.state.noTitleKey]}
            </Card>
        </div>
        );
    }
}

export default Book