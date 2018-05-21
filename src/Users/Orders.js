import React, { Component } from 'react';
import { Table, Input, Button, Popconfirm ,Icon } from 'antd';
import './Login.css';
import Cookies from "universal-cookie";
import {Link } from 'react-router-dom';

var cookies = new Cookies();

const Search = Input.Search;

const data = [{
    key: '1',
    bookname: 'Harry Potter and the Goblet of Fire',
    price: 55,
    author: 'J.K. Rowling',
    year: 2000,
    number: 2,
}, {
    key: '2',
    bookname: 'Le Petit Prince',
    price: 22.8,
    author: 'Antoine de Saint-Exupéry',
    year: 1942,
    number: 3,
}, {
    key: '3',
    bookname: 'Les Misérables',
    price: 32.5,
    author: 'Victor Hugo',
    year: 1862,
    number: 1,
}, {
    key: '4',
    bookname: 'Sophies World',
    price: 25.6,
    author: 'Jostein Gaarder',
    year: 1991,
    number: 2,
}];


const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
    }),
};

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterDropdownVisible: false,
            searchText: '',
            filtered: false,
            dataSource: [],
            count : 4,
        };
        this.fetchOrders();

        this.columns = [{
            title: 'BookName',
            dataIndex: 'bookname',
            width: '25%',
            filteredValue: this.state.searchText || null,
            onFilter: (filteredValue, record) => record.name.includes(filteredValue),

            sorter: (a, b) => b.bookname.length - a.bookname.length,
        },{
            title: 'Author',
            dataIndex: 'author',
            width: '17%',
            sorter: (a, b) => b.author.length - a.author.length,
        },{
            title: 'Year',
            dataIndex: 'year',
            width: '10%',
            sorter: (a, b) => b.year - a.year,
        },{
            title: 'Price(¥)',
            dataIndex: 'price',
            width: '15%',
            sorter: (a, b) => b.price - a.price,
        }, {
            title: 'number',
            dataIndex: 'number',
            width: '10%',
            sorter: (a, b) => b.number - a.number,
        }];
        this.cacheData = this.state.dataSource.map(item => ({ ...item }));
    }

    fetchOrders = () => {
        let msg = "userid="+ encodeURIComponent(cookies.get("userid"));
        fetch("http://localhost:8080/api/orders/get", {
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
                    console.log("Orders fetched:")
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
                <h1 className="Shopping-cart-title">History Orders</h1>
                <Table className = "table" bordered  dataSource={dataSource} columns={columns} />
                <Link to={'/User'}><Button className="BackButton">返回</Button></Link>
            </div>
        );
    }
};

export default Orders