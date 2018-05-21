/**
 * Created by Bo on 4/2/2018.
 */
import React, { Component } from 'react';
import { Card,Button } from 'antd';
import './Book.css';

const tabListNoTitle = [{
    key: 'book',
    tab: '书籍简介',
}, {
    key: 'author',
    tab: '作者简介',
}, {
    key: 'catalogue',
    tab: '目录',
}];

const contentListNoTitle = {
    book: <p>《碎琉璃》回忆20世纪上半叶山东故乡的人与事，娓娓叙说故乡的亲人、师友以及少年经历，自传色彩浓郁。
        这部散文集虽是断断续续、长短不一的故事，其实这些故事是可以串联在一起的，串连成一篇可歌可泣的长文。这本描述战乱时期的作品，隐隐诉说着战火下人们的悲哀。</p>,
    author: <p>王鼎钧，山东省兰陵人，1925年出生于一个传统的耕读之家；1949年到台湾，服务于（台湾）中国广播公司。还曾担任过多家报社副刊主编；1979年应聘至美国的大学任教，之后定居纽约至今。王鼎钧的创作生涯长达半个多世纪，著作近四十种。从六十年代早期的作品到1975年《开放的人生》，再到八十年代初期《作文七巧》，其“人生四书”、“作文四书”等作品在台湾销行极广，至今不衰。自七十年代末期起，王鼎钧开始了《碎琉璃》等独树一帜的文学创作；1988年《左心房漩涡》出版之后，更被誉为“当之无愧的散文大师”。从1992年至2009年，王鼎钧历时十七年陆续发表“回忆录四部曲”。这四卷书融人生经历、审美观照与深刻哲思于一体，显示一代中国人的因果纠结、生死流转。</p>,
    catalogue : <p>当时，我是这样想的——代序（王鼎钧）
        九歌版原序（蔡文甫）
        楔子：所谓我
        瞳孔里的古城
        迷眼流金
        一方阳光
        那些雀鸟
        红头绳儿
        失楼台
        看兵
        青纱帐
        敌人的朋友
        天才新闻
        带走盈耳的耳语
        哭屋
        拾字
        神仆
        在离愁之前
        新版《碎琉璃》后记</p>,
};

class Book extends Component{
    state = {
        imagePath : "",
        key: 'tab1',
        noTitleKey: 'book',
    }
    handleAddToCart = () =>{
        alert("功能尚未实现！")
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
                    this.setState({imagePath: result})
                }
            )
    }
    onTabChange = (key, type) => {
        console.log(key, type);
        this.setState({ [type]: key });
    }
    render(){
        this.fetchBookImage(1);
        return(
        <div style={{ background: '#ECECEC', padding: '30px',height:'1200px'  }}>
            <h1 className="bookTitle">碎琉璃</h1>
            <img src={this.state.imagePath} className="book"/>
            <Card style={{ width: 300 }} className = "card1">
                <p>作者:  王鼎钧 </p>
                <p>出版社: 生活·读书·新知三联书店</p>
                <p>出版年: 2013-6</p>
                <p>页数: 271</p>
                <p>定价: 27.00</p>
                <p>装帧: 平装</p>
                <p>丛书: 王鼎钧作品系列</p>
                <p>ISBN: 9787108042866</p>
            </Card>
            <Button onClick={this.handleAddToCart} className="addToCartButton">添加到购物车</Button>
            <Card className="card2"
                style={{ width: '90%' }}
                tabList={tabListNoTitle}
                activeTabKey={this.state.noTitleKey}
                onTabChange={(key) => { this.onTabChange(key, 'noTitleKey'); }}
            >
                {contentListNoTitle[this.state.noTitleKey]}
            </Card>
            <Card title="书评" style={{ width: '90%' }} className = "card3">
                <p>而今，在那里，我生命中出现过的风景人物，几乎都不存在了，我参与过的事，也几乎无人记省，然而阳光大地，万古千秋，琉璃未碎。</p>
                <p>小小一本却极有分量，几次读得喉头一紧。王鼎钧的文字并不见什么华美词藻，但又充沛着对文字的经营。虽说大背景是抗战，而真正打动人的是生活，是情。</p>
                <p>鼎公的自传体散文集，只有经历过的人才能真正体味吧。</p>
                <p>印象深刻的是书中的一位校长和一位先生，真真当得起为人师表几个字。 都说鼎公的散文好，我觉得他的小说读来更胜散文。</p>
                <p>题材有些类似于从文自传。但文字风格相差的多些。王有台湾文学的细腻华美。沈则沉着冷峻了些。</p>
            </Card>
        </div>
        );
    }
}

export default Book