/**
 * Created by Bo on 4/2/2018.
 */
import React, { Component } from 'react';
import { Icon,Button,Input,Card,Col, Comment, Tooltip, List} from 'antd';
import {Link } from 'react-router-dom';
import moment from 'moment';
import './ChatRoom.css';
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

var public_socket = new SockJS('http://localhost:8080/broadcastEndpoint');
var public_stompClient = Stomp.over(public_socket);//使用stomp子协议的WebSocket客户端

class ChatRoom extends Component{
    constructor(props) {
        super(props);  
        this.state = {
          public_text: "",
          client:"",
          sk:"",
          public_msgList: data,
        }
        this.subscribePublicMsg()
    }

    onPublicInputChange= (e) =>{
      this.setState({
        public_text: e.target.value
      });
    }

    sendPublicMsg = () =>{
      document.getElementById("public_inputText").value = ""
      public_stompClient.send("/broadcast", {}, JSON.stringify({
        'name': cookies.get("username"),
        'message': this.state.public_text
       }));
    }

    addPublicMessage = (msgStr) =>{
      var dataList = this.state.public_msgList
      var msg = JSON.parse(msgStr.body)
      dataList.push({
        author: msg["name"],
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
        public_msgList: dataList
      })
    }

    subscribePublicMsg = () =>{
      var that = this
      public_stompClient.connect({}, function(frame) {//链接Web Socket的服务端。
        console.log('Stomp Connected: ' + frame);
        public_stompClient.subscribe('/topic/getResponse', (msg) =>{ //订阅/topic/getResponse 目标发送的消息。这个是在控制器的@SendTo中定义的。
          console.log("Get response")
          that.addPublicMessage(msg)
        });
      });
    }

    render(){

        return(
        <div className = "ChatRoomApp">
            <header><Icon type="message" className="ChatRoomIcon" style={{ fontSize: 60 }} /></header>,
              <h1 className="ChatRoomTitle">Public ChatRoom</h1>
              <Col span={4}  offset={2}>
                        <Link to={'/PrivateChatRoom'}><Button type="primary" className="switch_button">Switch to Private</Button></Link>
              </Col>

            <Col offset={5} span={14} >
              <Card title="Public ChatRoom" bordered={true}>
                <List
                    className="comment-list"
                    header={`${data.length} messages`}
                    itemLayout="horizontal"
                    dataSource={this.state.public_msgList}
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
                <TextArea id="public_inputText" placeholder="Enter your message" onChange = {this.onPublicInputChange} autosize={{ minRows: 4, maxRows: 8 }} />
                <div style={{height:"20px"}}/>
                <Button onClick={this.sendPublicMsg} type="primary" size="large" style={{float:"right"}}>Send</Button>
                <div style={{height:"50px"}}/>
            </Col>
            
        </div>
        );
    }
}

export default ChatRoom