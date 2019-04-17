/**
 * Created by Bo on 4/2/2018.
 */
import React, { Component } from 'react';
import { Icon,Button,Input,Card,Col, Comment, Tooltip, List} from 'antd';
import {Link } from 'react-router-dom';
import moment from 'moment';
import './PrivateChatRoom.css';
import Cookies from 'universal-cookie'
import SockJS from  'sockjs-client';
import  Stomp from 'stompjs';

var cookies = new Cookies();
const Search = Input.Search;
const { TextArea } = Input;

const data = [
    {
      author: 'user2',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      content: (
        <p>Anybody there?</p>
      ),
      datetime: (
        <Tooltip title={moment().subtract(5, 'minutes').format('YYYY-MM-DD HH:mm:ss')}>
          <span>{moment().subtract(5, 'minutes').fromNow()}</span>
        </Tooltip>
      ),
    },
  ];

var private_socket = new SockJS('http://localhost:8080/chatEndpoint');
var private_stompClient = Stomp.over(private_socket);//使用stomp子协议的WebSocket客户端

class PrivateChatRoom extends Component{
    constructor(props) {
        super(props);  
        this.state = {
          private_text: "",
          client:"",
          sk:"",
          private_msgList: data
        }
        this.subscribePrivateMsg()
    }

    onPrivateInputChange= (e) =>{
      this.setState({
        private_text: e.target.value
      });
    }

    sendPrivateMsg = (username) =>{
      document.getElementById("private_inputText").value = ""
       private_stompClient.send("/chat", {}, JSON.stringify({
        'from_name': cookies.get("username"),
        'to_name': username,
        'message': this.state.private_text
       }));
    }

    addPrivateMessage = (msgStr) =>{
      var dataList = this.state.private_msgList
      var msg = JSON.parse(msgStr.body)
      dataList.push({
        author: msg["from_name"],
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        content: (
          <p>{msg["message"]}</p>
        ),
        datetime: (
          <Tooltip title={moment().subtract(10, 'minutes').format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment().subtract(10, 'minutes').fromNow()}</span>
          </Tooltip>
        ),
      },)
      this.setState({
        private_msgList: dataList
      })
    }

    subscribePrivateMsg = () =>{
        var that = this
        private_stompClient.connect({}, function(frame) {//链接Web Socket的服务端。
        console.log('Private Stomp Connected: ' + frame);
        private_stompClient.subscribe('/user/queue/notifications', (msg) =>{ //订阅/topic/getResponse 目标发送的消息。这个是在控制器的@SendTo中定义的。
          console.log("Get private response")
          that.addPrivateMessage(msg)
        });
      });
    }

    render(){

        return(
        <div className = "ChatRoomApp">
            <header><Icon type="message" className="ChatRoomIcon" style={{ fontSize: 60 }} /></header>,
              <h1 className="ChatRoomTitle">Private ChatRoom</h1>
              <Col span={4}  offset={2}>
                        <Link to={'/ChatRoom'}><Button type="primary" className="switch_button">Switch to Public</Button></Link>
              </Col>
            <Col span={14} offset={5} >
              <Card title="Private ChatRoom" bordered={true}>
                <List
                    className="comment-list"
                    header={`${data.length} messages`}
                    itemLayout="horizontal"
                    dataSource={this.state.private_msgList}
                    renderItem={item => (
                    <Comment
                        author={item.author}
                        avatar={item.avatar}
                        content={item.content}
                        datetime={item.datetime}
                    />
                    )}
                />
              </Card>
                <TextArea id="private_inputText" placeholder="Enter your message" onChange = {this.onPrivateInputChange} autosize={{ minRows: 4, maxRows: 8 }} />
                <div style={{height:"20px"}}/>
                <Search
                  width="100px"
                  placeholder="Input username"
                  enterButton="Send"
                  size="large"
                  onSearch={value => this.sendPrivateMsg(value)}
                />
                <div style={{height:"20px",margin:"right"}}/>
            </Col>

        </div>
        );
    }
}

export default PrivateChatRoom