import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Card, Icon, Avatar } from 'antd';
import {Link } from 'react-router-dom';
const { Meta } = Card;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imagePath: ["C:/Users/Bo/Desktop/大二下专业课/web开发/BookStoreV2/src/BookImage/1.jpg", "C:/Users/Bo/Desktop/大二下专业课/web开发/BookStoreV2/src/BookImage/1.jpg", "C:/Users/Bo/Desktop/大二下专业课/web开发/BookStoreV2/src/BookImage/1.jpg"]
        };
        this.fetchBookImage(1);
        this.fetchBookImage(2);
        this.fetchBookImage(3);
    }

    fetchBookImage = (id) => {
        fetch("http://localhost:8080/api/bookimages/bookid/"+id, {
            method: 'GET',
            credentials: 'include'
        })
            .then(
                res => res.text()
            )
            .then(
                (result) => {
                    console.log("bookImage fetched:")
                    console.log(result)
                    const newImagePath = this.state.imagePath
                    newImagePath[id-1] = result
                    this.setState({imagePath: newImagePath})
                }
            )
    }
  render() {
    return (
      <div className="App">
          <div><header className="App-header">
              <h1 className = "title">A BookStore | 一家书店</h1>
              <h3 className = "subtitle"> 一家小众，安静，展示未知之美的线上书店</h3>
              <h1 className="App-title">一家书店</h1>
              <img src={logo} className="App-logo" alt="logo" />
          </header></div>
          <div style={{ background: '#ECECEC', padding: '30px', height:'530px' }}>
              <Card
                  style={{ width: 300 }}
                  cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                  actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                  className = "card"
              >
                  <Meta
                      title="每日书签："
                      description='"我喜爱一切不彻底的事物。琥珀里的时间,微暗的火,一生都在半途而废,一生都怀抱热望。"——张定浩'
                  />
              </Card>
              <h1 className="recommend">今日推荐书目</h1>
              <Link to={'/Book'}><img src={this.state.imagePath[0]} className="book1"/></Link>
              <img src={this.state.imagePath[1]} className="book2"/>
              <img src={this.state.imagePath[2]} className="book3"/>
          </div>
      </div>
    );
  }
}

export default App;
