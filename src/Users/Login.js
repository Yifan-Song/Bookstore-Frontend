/**
 * Created by Bo on 4/1/2018.
 */
import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import {Link } from 'react-router-dom';
import './Login.css'
import Cookies from 'universal-cookie'

const FormItem = Form.Item;

var cookies = new Cookies();

class NormalLoginForm extends React.Component {
    constructor(props){
        super(props);
        this.LoginSuccessHandler = props.LoginSuccessHandler;
        this.state={
            username:'',
            password:'',
            error:false,
        }
    }

    handleSubmit = (e) => {
        var msg;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                msg = "username="+ encodeURIComponent(values.userName) +
                    "&password="+encodeURIComponent(values.password)
                console.log(msg);
            }
        });

        fetch("http://localhost:8080/api/login", {
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
                    if(result.status === "ok") {
                        alert("Login successful!")
                        this.LoginSuccessHandler(result.user.userid, result.role)
                        this.setState(
                            {userid: result.user.userid,
                            role:result.role,
                            login:true,
                        })
                    }
                    else
                        alert("Login failed!")
                    console.log(result)
                })
    }

    render() {
        console.log(cookies.get('login'));
        if (cookies.get('login')){
            window.location.href = "/";
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Icon type="user" className="userIcon" style={{ fontSize: 120 }} />
                <h1 style={{textAlign:"center"}}>Login</h1>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem className={'firstLine'}>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                        )}
                    </FormItem>
                    <FormItem className={'secondLine'}>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        )}
                    </FormItem>
                    <FormItem className={'button'}>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>Remember me</Checkbox>
                        )}
                        <a className="login-form-forgot" href="">Forgot password</a>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        Or <Link to={'/Register'}><a href="">register now!</a></Link>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default NormalLoginForm