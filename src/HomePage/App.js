import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Card, Icon, Avatar,Row,Col} from 'antd';
import {Link } from 'react-router-dom';
const { Meta } = Card;
const gridStyle = {
    width: '33.3%',
    textAlign: 'center',
  };
  
class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title : "A BookStore | 一家书店",
            subtitle: "一家小众，安静，展示未知之美的线上书店",
            apptitle : "一家书店",
            pagetitle : "今日推荐书目",
            bookmarktitle: "每日书签：",
            bookmarkcontent: '"我喜爱一切不彻底的事物。琥珀里的时间,微暗的火,一生都在半途而废,一生都怀抱热望。"——张定浩',   
            imagePath: [],
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
                    console.log(result)
                    var newImagePath = this.state.imagePath
                    var newImagePathItem = {}
                    newImagePathItem["id"] = id
                    newImagePathItem["path"] = result
                    newImagePath.push(newImagePathItem)
                    this.setState({imagePath: newImagePath})
                }
            )
    }

  render() {
    return (
      <div className="App">

            <header className="App-header">
              <h1 className = "title">{this.state.title}</h1>
              <h3 className = "subtitle">{this.state.subtitle}</h3>
              <h1 className="App-title">{this.state.apptitle}</h1>
            </header>

          <body className="App-body">
            <Row>
                <Col span={6}>
                    <Card
                        style={{ width: 300 }}
                        cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                        actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                        className = "card"
                    >
                        <Meta
                            title={this.state.bookmarktitle}
                            description={this.state.bookmarkcontent}
                        />
                    </Card>
                </Col>

                <Col span={18}>
                    <Card className = "recommendCard" title={<div style={{fontSize:"30px", fontFamily: "KaiTi", opacity:2}}>推荐书籍</div>} >
                        {
                            this.state.imagePath.map((item)=>{
                                return <Card.Grid headStyle = {{fontSize : "100px"}} style={gridStyle}>
                                <Link to={{
                                            pathname : '/Book' ,
                                            state : {
                                                id: item['id'],
                                            }
                                        }}>
                                        <img src={item["path"]} className="book"/>
                                    </Link>
                                </Card.Grid> 
                            })
                        }
                    </Card>
                </Col>
            </Row>
          </body>
      </div>
    );
  }
}

export default App;
