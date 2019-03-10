import React, { Component } from 'react';
import { Table, Input, Button, Popconfirm ,Icon,message } from 'antd';
import './Cart.css';
import Cookies from "universal-cookie";

var cookies = new Cookies();

var tempPrice = 0;

const Search = Input.Search;

function cancel(e) {
    message.error('未下单');
  }

class EditableCell extends React.Component {
    state = {
        value: this.props.value,
        editable: false,
    }

    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
    }
    check = () => {
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    }
    edit = () => {
        this.setState({ editable: true });
    }
    render() {
        const { value, editable } = this.state;
        return (
            <div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Input
                                value={value}
                                onChange={this.handleChange}
                                onPressEnter={this.check}
                            />
                            <Icon
                                type="check"
                                className="editable-cell-icon-check"
                                onClick={this.check}
                            />
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            {value || ' '}
                            <Icon
                                type="edit"
                                className="editable-cell-icon"
                                onClick={this.edit}
                            />
                        </div>
                }
            </div>
        );
    }
}

class Cart extends Component {
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
        this.fetchCart();

        this.columns = [{
            title: 'BookName',
            dataIndex: 'bookname',
            width: '17%',
            filteredValue: this.state.searchText || null,
            onFilter: (filteredValue, record) => record.name.includes(filteredValue),

            sorter: (a, b) => b.bookname.length - a.bookname.length,
        },{
            title: 'Author',
            dataIndex: 'author',
            width: '17%',
            sorter: (a, b) => b.author.length - a.author.length,
        },{
            title: 'Price(¥)',
            dataIndex: 'price',
            width: '15%',
            sorter: (a, b) => b.price - a.price,
        }, {
            title: 'number',
            dataIndex: 'number',
            width: '17%',
            sorter: (a, b) => b.number - a.number,
            render: (text, record) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(record.key, 'name')}
                />
            ),
        },{
            title: 'TotalPrice(¥)',
            dataIndex: 'totalPrice',
            width: '17%',
            sorter: (a, b) => b.totalPrice - a.totalPrice,
            render: (text, record) => {
                var thisTotalPrice = record.price*100
                thisTotalPrice *= record.number
                thisTotalPrice /= 100
                return (
                    <p>{thisTotalPrice}</p>
                )                    
            },
        },{
            title: 'Delete',
            dataIndex: 'delete',
            width: '17%',
            render: (text, record) => {
                return (
                    this.state.dataSource.length >= 1 ?
                        (
                            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
                                <a>Delete</a>
                            </Popconfirm>
                        ) : null
                );
            },
        }];
        this.cacheData = this.state.dataSource.map(item => ({ ...item }));
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            var tempTotalPrice = 0;
            var tempPrice = 0;
            for (let i in selectedRows)
            {
                tempPrice = selectedRows[i].price * 100
                tempPrice *= selectedRows[i].number
                tempTotalPrice += tempPrice
            }

            this.setState({totalPrice: (tempTotalPrice/100)});
            this.setState({bluerows: selectedRows}) 
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),
    };


    handleBalance = () => {
        let balancerows = this.state.bluerows;
        var currentTime = new Date();
        var timeStr = currentTime.toLocaleString;
        var orderItemNum = balancerows.length
        var count = 0
        for (let i in balancerows) {
            let record = balancerows[i];
            let msg = "userid=" + encodeURIComponent(cookies.get("userid")) +
                "&bookname=" + encodeURIComponent(record.bookname) +
                "&bookpath=" + encodeURIComponent(record.bookpath) +
                "&bookid=" + encodeURIComponent(record.bookid) +
                "&price=" + encodeURIComponent(record.price) +
                "&author=" + encodeURIComponent(record.author) +
                "&year=" + encodeURIComponent(record.year) +
                "&number=" + encodeURIComponent(record.number) +
                "&cacheid=" + encodeURIComponent(record.key)

            fetch("http://localhost:8080/api/orders/add", {
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
                        count += 1
                        this.setState({bluerows:[]});
                        console.log("Orderitem added:")
                        console.log(result)
                    }
                )
        }
        var currentTime = new Date();
        var timeStr = currentTime.toLocaleString();
        let msg = "time=" + encodeURIComponent(timeStr)

            var wait = setInterval(function(){
                console.log(count)
                if(count == orderItemNum){
                    fetch("http://localhost:8080/api/orders/lock", {
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
                                console.log("Order locked:")
                                console.log(result)
                                message.success('下单成功！请尽快支付订单');//尚未处理错误返回的情况
                                window.location.href = "http://localhost:3000/#/Order"
                                clearInterval(wait)
                            }
                        )
                }
            },200)

    }

    fetchCart = () => {
        let msg = "userid="+ encodeURIComponent(cookies.get("userid"));
        fetch("http://localhost:8080/api/cart/get", {
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
                    console.log("Cart fetched:")
                    for(let i in result)
                    {
                        result[i].key = result[i].cacheid;
                    }
                    console.log(result)
                    this.setState({dataSource: result})
                }
            )
    }


    onInputChange = (e) => {
        this.setState({ searchText: e.target.value });
    }

    onSearch = () => {
        const { searchText } = this.state;
        const reg = new RegExp(searchText, 'gi');
        this.setState({
            filterDropdownVisible: false,
            filtered: !!searchText,
            dataSource: this.state.dataSource
                .map((record) => {
                const match = record.bookname.match(reg);
                if (!match) {
                    return null;
                }
                return {
                    ...record,
                    bookname: (
                        <span>
              {record.bookname.split(reg).map((text, i) => (
                  i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
              ))}
            </span>
                    ),
                };
            }).filter(record => !!record),
        });
    }

    onCellChange = (key, dataIndex) => {
        return (value) => {
            const dataSource = [...this.state.dataSource];
            const target = dataSource.find(item => item.key === key);
            if (target) {
                let msg = "userid="+ encodeURIComponent(cookies.get("userid")) +
                    "&bookname="+ encodeURIComponent(target.bookname) +
                    "&bookpath="+ encodeURIComponent(target.bookpath) +
                    "&bookid="+ encodeURIComponent(target.bookid) +
                    "&price="+ encodeURIComponent(target.price) +
                    "&author="+ encodeURIComponent(target.author) +
                    "&year="+ encodeURIComponent(target.year) +
                    "&cacheid="+ encodeURIComponent(target.key) +
                    "&number="+ encodeURIComponent(value);
                fetch("http://localhost:8080/api/cart/update", {
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
                        }
                    )
                target[dataIndex] = value;
                this.setState({dataSource});
            }
        }
    }

    handleChange(value, key, column) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[column] = value;
            this.setState({ data: newData });
        }
    }

    onDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        var msg = "";
        for(let i in dataSource)
        {
            if(dataSource[i].key === key)
            {
                let record = dataSource[i];
                msg = "userid="+ encodeURIComponent(cookies.get("userid")) +
                    "&bookname="+ encodeURIComponent(record.bookname) +
                    "&bookpath="+ encodeURIComponent(record.bookpath) +
                    "&bookid="+ encodeURIComponent(record.bookid) +
                    "&price="+ encodeURIComponent(record.price) +
                    "&author="+ encodeURIComponent(record.author) +
                    "&year="+ encodeURIComponent(record.year) +
                    "&number="+ encodeURIComponent(record.number) +
                    "&cacheid="+ encodeURIComponent(record.key);
            }
        }

        fetch("http://localhost:8080/api/cart/delete", {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: msg
        })
            .then(
                (result) =>{
                    console.log(result)
                })
        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    }

    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count + 1,
            bookname: 'Blank',
            year: null,
            author: 'Blank',
            price: null,
            //address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    }

    onChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: Search.value,
        });
    }

    edit(key) {
        const newData = [...this.state.dataSource];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target.editable = true;
            this.setState({ data: newData });
        }
    }

    save(key) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            delete target.editable;
            this.setState({ data: newData });
            this.cacheData = newData.map(item => ({ ...item }));
        }
    }

    cancel(key) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
            delete target.editable;
            this.setState({ data: newData });
        }
    }


    render() {
        const { dataSource } = this.state;
        const columns = this.columns;
        return(
            <div>
                <header><Icon type="shopping-cart" className="shopping-cart" style={{ fontSize: 60 }} /></header>,
                <h1 className="Shopping-cart-title">Shopping Cart</h1>
                <Table className = "table" bordered rowSelection={this.rowSelection} dataSource={dataSource} columns={columns} onChange={this.onChange} onDelete={this.onDelete} />
                
                <p className="price">总价：{this.state.totalPrice} 元</p>

                <Popconfirm  title="确认下单?" onConfirm={this.handleBalance} onCancel={cancel} okText="Yes" cancelText="No">
                    <Button type={"primary"} className = "buy-button">下单</Button>
                </Popconfirm>
                
            </div>
        );
    }
};

export default Cart