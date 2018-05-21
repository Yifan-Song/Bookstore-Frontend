import React, { Component } from 'react';
import { Table, Input, Button, Popconfirm ,Icon } from 'antd';
import './Table.css';

const Search = Input.Search;

const EditableCell = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
            : value
        }
    </div>
);

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
    }),
};

class BookTable extends Component {
    constructor(props) {
        super(props);
        this.fetchAllBooks();
        this.state = {
            filterDropdownVisible: false,
            searchText: '',
            filtered: false,
            dataSource: [],
            count : 6,
            tempkey : 0
        };

        this.columns = [{
            title: 'BookName',
            dataIndex: 'bookname',
            width: '20%',

            filteredValue: this.state.searchText || null,
            onFilter: (filteredValue, record) => record.name.includes(filteredValue),

            sorter: (a, b) => b.bookname.length - a.bookname.length,
            render: (text, record) => this.renderColumns(text, record, 'bookname'),
        },{
            title: 'Author',
            dataIndex: 'author',
            width: '20%',
            sorter: (a, b) => b.author.length - a.author.length,
            render: (text, record) => this.renderColumns(text, record, 'author'),
        },{
            title: 'Year',
            dataIndex: 'year',
            width: '15%',
            sorter: (a, b) => b.year - a.year,
            render: (text, record) => this.renderColumns(text, record, 'year'),
        },{
            title: 'Price(¥)',
            dataIndex: 'price',
            width: '15%',
            sorter: (a, b) => b.price - a.price,
            render: (text, record) => this.renderColumns(text, record, 'price'),
        },
            {
            title: 'Edit',
            dataIndex: 'edit',
            width: '15%',
            render: (text, record) => {
                const { editable } = record;
                return (
                    <div className="editable-row-operations">
                        {
                            editable ?
                                <span>
                  <a onClick={() => this.save(record.key)}>Save </a>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
                                : <a onClick={() => this.edit(record.key)}>Edit</a>
                        }
                    </div>
                );
            },
        },{
            title: 'Delete',
            dataIndex: 'delete',
            width: '15%',
            render: (text, record) => {
                return (
                    this.state.dataSource.length > 1 ?
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
                    console.log(result)
                    for(let i in result)
                    {
                        result[i].key = result[i].bookid;
                    }
                    console.log("books fetched:")
                    console.log(result)
                    this.setState({dataSource: result})
                }
            )
    }

    addBook = () => {
        const {  dataSource } = this.state;
        const book = {
            bookname: "Blank",
            year: 0,
            author: "Blank",
            price: 0,
        };

        let msg = "bookname="+ encodeURIComponent(book.bookname) +
            "&author="+encodeURIComponent(book.author) +
            "&price="+encodeURIComponent(book.price) +
            "&year="+encodeURIComponent(book.year)

        console.log(msg);

        fetch("http://localhost:8080/api/books/save", {
            method: 'post',
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
                (result) =>{
                    this.setState({tempkey: result.bookid})
                    console.log(result)
                })
        book.key = this.state.tempkey;
        this.setState({
            dataSource: [...dataSource, book],
        });
    }


    onDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        var msg = "";
        for(let i in dataSource)
        {
            if(dataSource[i].key === key)
            {
                msg = "bookname="+ encodeURIComponent(dataSource[i].bookname) +
                    "&author="+encodeURIComponent(dataSource[i].author) +
                    "&price="+encodeURIComponent(dataSource[i].price) +
                    "&year="+encodeURIComponent(dataSource[i].year) +
                    "&bookid="+encodeURIComponent(dataSource[i].key) +
                    "&bookpath="+encodeURIComponent(dataSource[i].bookpath)
            }
        }
        fetch("http://localhost:8080/api/books/delete", {
            method: 'post',
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

    exportJson = () =>{
        const blob  = new Blob([JSON.stringify(this.state.data)] ,{type:"application/json"})
        const link = document.createElement("a" )
        link.href = URL.createObjectURL(blob)
        link.download ="bookdata.json"
        link.click()
        URL.revokeObjectURL( link.href)
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

        let msg = "bookname="+ encodeURIComponent(target.bookname) +
            "&author="+encodeURIComponent(target.author) +
            "&price="+encodeURIComponent(target.price)+
            "&year="+encodeURIComponent(target.year)+
            "&bookid="+encodeURIComponent(target.key)

        console.log(msg);

        fetch("http://localhost:8080/api/books/save", {
            method: 'post',
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
                <header><Icon type="setting" className="settingIcon" style={{ fontSize: 60 }} /></header>,
                <h1 className="BookTable-title">Management</h1>
                <Input
                        className= "search-input"
                        ref={ele => this.searchInput = ele}
                        placeholder="Search name"
                        value={this.state.searchText}
                        onChange={this.onInputChange}
                        onPressEnter={this.onSearch}
                    />
                    <Button className = "search-button" type="primary" onClick={this.onSearch}>Search</Button>
                <Button className = "add-btn" type="primary" onClick={ this.addBook }>Add a new book</Button>
                <Table className = "table" bordered rowSelection={rowSelection} dataSource={dataSource} columns={columns} onChange={this.onChange} onDelete={this.onDelete} />
                <Button className = "export-btn1" onClick={ this.exportJson() }>Export Json</Button>
                <Button className = "export-btn2" onClick={ this.exportJson() }>Export Csv</Button>
            </div>
    );
    }
};
export default BookTable