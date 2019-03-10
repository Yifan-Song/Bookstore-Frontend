/**
 * Created by Bo on 4/2/2018.
 */
import React, { Component } from 'react';
import { Table, Input, Button, Popconfirm ,Icon, message } from 'antd';
import './BookList.css';
import Cookies from 'universal-cookie'
import {Link } from 'react-router-dom';

var cookies = new Cookies();

const Search = Input.Search;

const EditableCell = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
            : value
        }
    </div>
);

class BookList extends Component {
    constructor(props) {
        super(props);
        this.fetchAllBooks();
        this.state = {
            filterDropdownVisible: false,
            searchText: '',
            filtered: false,
            dataSource: [],
            count : 6
        };

        this.columns = [{
            title: 'BookName',
            dataIndex: 'bookname',
            width: '10%',
            filteredValue: this.state.searchText || null,
            onFilter: (filteredValue, record) => record.name.includes(filteredValue),
            sorter: (a, b) => b.bookname.length - a.bookname.length,
            render: (text, record) => this.renderColumns(text, record, 'bookname'),
        },{
            title: 'Author',
            dataIndex: 'author',
            width: '10%',
            sorter: (a, b) => b.author.length - a.author.length,
            render: (text, record) => this.renderColumns(text, record, 'author'),
        },{
            title: 'Year',
            dataIndex: 'year',
            width: '10%',
            sorter: (a, b) => b.year - a.year,
            render: (text, record) => this.renderColumns(text, record, 'year'),
        },{
            title: 'Price(¥)',
            dataIndex: 'price',
            width: '10%',
            sorter: (a, b) => b.price - a.price,
            render: (text, record) => this.renderColumns(text, record, 'price'),
        }, {
            title: 'Sales',
            dataIndex: 'salesVolume',
            width: '10%',
            sorter: (a, b) => b.salesVolume - a.salesVolume,
            render: (text, record) => this.renderColumns(text, record, 'salesVolume'),
        }, {
            title: 'Stock',
            dataIndex: 'stock',
            width: '10%',
            sorter: (a, b) => b.stock - a.stock,
            render: (text, record) => this.renderColumns(text, record, 'stock'),
        }, {
            title: '详情',
            dataIndex: 'edit',
            width: '15%',
            render: (text, record) => {
                const { editable } = record;
                return (
                    <Link to={{
                        pathname : '/Book' ,
                        state : {
                            id: record.bookid,
                        }
                    }}>
                    查看书籍详情
                    </Link>
                );
            },
        },{
            title: '购买',
            dataIndex: 'delete',
            width: '15%',
            render: (text, record) => {
                return (
                    this.state.dataSource.length >= 1 ?
                        (
                            <Popconfirm title="确定将本书添加到购物车?" onConfirm={() => this.addToCart(record)}>
                                <a>添加到购物车</a>
                            </Popconfirm>
                        ) : null
                );
            },
        }];
        this.cacheData = this.state.dataSource.map(item => ({ ...item }));
    }

    addToCart = (record) =>{
        let msg = "userid="+ encodeURIComponent(cookies.get("userid")) +
            "&bookname="+ encodeURIComponent(record.bookname) +
            "&bookpath="+ encodeURIComponent(record.bookpath) +
            "&bookid="+ encodeURIComponent(record.bookid) +
            "&price="+ encodeURIComponent(record.price) +
            "&author="+ encodeURIComponent(record.author) +
            "&year="+ encodeURIComponent(record.year) +
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

    fetchAllBooks = () => {
        fetch("http://localhost:8080/api/books", {
            method: 'GET',
            credentials: 'include'
        })
            .then(
                res => res.json()
            )
            .then(
                (result) => {
                    console.log("books fetched:")
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
            dataSource: this.state.dataSource.map((record) => {
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

    renderColumns(text, record, column) {
        return (
            <EditableCell
                editable={record.editable}
                value={text}
                onChange={value => this.handleChange(value, record.key, column)}
            />
        );
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
        const columns = this.columns;
        return(
            <div className="BookListApp">
                <header><Icon type="book" className="bookIcon" style={{ fontSize: 60 }} /></header>,
                <h1 className="BookTable-title">BookList</h1>
                <Input
                    className= "search-input"
                    ref={ele => this.searchInput = ele}
                    placeholder="Search name"
                    value={this.state.searchText}
                    onChange={this.onInputChange}
                    onPressEnter={this.onSearch}
                    />
                    <Button className = "search-button" type="primary" onClick={this.onSearch}>Search</Button>
                <br></br><br></br>
                <Table className = "table" bordered dataSource={this.state.dataSource} columns={columns} onChange={this.onChange} onDelete={this.onDelete} />
            </div>
        );
    }
};

export default BookList