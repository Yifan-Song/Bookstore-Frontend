import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Card, Icon, Avatar,Row,Col} from 'antd';
import {Link } from 'react-router-dom';
import { encode } from 'punycode';
import Cookies from "universal-cookie";
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/graph';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

var cookies = new Cookies();
const { Meta } = Card;
const gridStyle = {
    width: '33.3%',
    textAlign: 'center',
  };

function encoder(msg){
    var encoded = btoa(msg);
    var newEncoded = ""
    var newChar = ''
    console.log(encoded)

    //cookies.get("userid")
    for(var i = 0; i < encoded.length; i++){
        newChar = String.fromCharCode(encoded.charAt(i).charCodeAt()+2)
        newEncoded += newChar
    }
    console.log(newEncoded)
    return newEncoded
}

function decoder(msg){
    var newEncoded = ""
    var newChar = ''
    for(var i = 0; i < msg.length; i++){
        newChar = String.fromCharCode(msg.charAt(i).charCodeAt()-2)
        newEncoded += newChar
        //console.log(newChar)
    }
    console.log(atob(newEncoded))
    return atob(newEncoded)
}

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
        fetch("http://localhost:8080/api/bookimages/"+id, {
            method: 'GET',
            credentials: 'include'
        })
            .then(
                res => res.text()
            )
            .then(
                (result) => {
                    console.log("ImagePath ", result.split(':')[0])
                    var newImagePath = this.state.imagePath
                    var newImagePathItem = {}
                    newImagePathItem["id"] = id
                    newImagePathItem["path"] =  result.substring(result.split(':')[0].length + 1)
                    newImagePath.push(newImagePathItem)
                    this.setState({imagePath: newImagePath})
                }
            )
    }

    // componentDidMount() {
    //     var myChart = echarts.init(document.getElementById('Shiyou'));

    //     var layers = ["categories_layer1", "categories_layer2"]
    //     var sizes = [100,60,30]
    //     var colors = ["#CD0000", "#FF8C00", "#6C7B8B"]
    //     var data = [];
    //     var edges = [];
    //     var root_id = 0;
    //     var rawData = {"categories_layer1":[{"name": "煤层气产量","cate_id": 0,"base":"shiyoushihua"},{"name": "天然气行业","cate_id": 1,"base":"shiyoushihua"},{"name": "乙二醇进口量","cate_id": 2,"base":"shiyoushihua"},{"name": "国际油价","cate_id": 3,"base":"shiyoushihua"},{"name": "原油产量","cate_id": 4,"base":"shiyoushihua"},{"name": "天然气产量","cate_id": 5,"base":"shiyoushihua"},{"name": "原油生产业","cate_id": 6,"base":"shiyoushihua"},{"name": "行业毛利率","cate_id": 7,"base":"shiyoushihua"},{"name": "行业景气度","cate_id": 8,"base":"shiyoushihua"},{"name": "汽油进口量","cate_id": 9,"base":"shiyoushihua"},{"name": "聚乙烯进口量","cate_id": 10,"base":"shiyoushihua"},{"name": "美油产量","cate_id": 11,"base":"shiyoushihua"},{"name": "石油化工行业盈利","cate_id": 12,"base":"shiyoushihua"},{"name": "原料价格","cate_id": 13,"base":"shiyoushihua"},{"name": "天然气需求","cate_id": 14,"base":"shiyoushihua"},{"name": "LNG进口量","cate_id": 15,"base":"shiyoushihua"},{"name": "工程塑料进口依赖度","cate_id": 16,"base":"shiyoushihua"},{"name": "原油需求量","cate_id": 17,"base":"shiyoushihua"},{"name": "原油进口量","cate_id": 18,"base":"shiyoushihua"},{"name": "页岩油产量","cate_id": 19,"base":"shiyoushihua"},{"name": "美国原油产量","cate_id": 20,"base":"shiyoushihua"},{"name": "天然气价格","cate_id": 21,"base":"shiyoushihua"},{"name": "MTBE","cate_id": 22,"base":"shiyoushihua"},{"name": "PTA","cate_id": 23,"base":"shiyoushihua"},{"name": "页岩气产量","cate_id": 24,"base":"shiyoushihua"},],"categories_layer2": [{"name": "煤层气产量","cate_id": 0,"category":[24]},{"name": "美国原油日产量","cate_id": 1,"category":[19, 11, 4]},{"name": "天然气行业","cate_id": 2,"category":[3]},{"name": "国产原油产量","cate_id": 3,"category":[17]},{"name": "乙二醇进口量","cate_id": 4,"category":[10]},{"name": "国际油价","cate_id": 5,"category":[0, 9, 22, 16, 18, 12, 24, 8]},{"name": "原油产量","cate_id": 6,"category":[1, 14, 3, 9]},{"name": "石油净进口量","cate_id": 7,"category":[17]},{"name": "天然气产量","cate_id": 8,"category":[0, 14, 1, 16, 3, 4, 18, 24]},{"name": "原油生产业","cate_id": 9,"category":[3]},{"name": "行业毛利率","cate_id": 10,"category":[20, 3, 4]},{"name": "非常规气产量","cate_id": 11,"category":[14, 3]},{"name": "乙醇汽油MTBE","cate_id": 12,"category":[22]},{"name": "涤纶长丝行业库存","cate_id": 13,"category":[13, 3]},{"name": "聚酯产业和乙原料","cate_id": 14,"category":[6, 3, 14]},{"name": "原料价格","cate_id": 15,"category":[3, 21]},{"name": "天然气需求","cate_id": 16,"category":[1, 6, 3]},{"name": "LNG进口量","cate_id": 17,"category":[5]},{"name": "工程塑料进口依赖度","cate_id": 18,"category":[24, 0]},{"name": "原油需求量","cate_id": 19,"category":[4]},{"name": "原油进口量","cate_id": 20,"category":[16, 24, 0, 4]},{"name": "页岩油产量","cate_id": 21,"category":[4]},{"name": "美国原油产量","cate_id": 22,"category":[3, 22, 4]},{"name": "天然气价格","cate_id": 23,"category":[14, 1, 3, 4, 23, 5]},{"name": "MTBE","cate_id": 24,"category":[23]},{"name": "油气行业","cate_id": 25,"category":[3]},{"name": "乙烯单体进口量","cate_id": 26,"category":[10, 2]},{"name": "PTA","cate_id": 27,"category":[20, 14, 1, 3, 4, 5, 7]},{"name": "天然气进口量","cate_id": 28,"category":[5, 14, 15]},],}

    //     for(var i=0; i < rawData["categories_layer1"].length; i++){
    //         var node = rawData["categories_layer1"][i]
    //         data.push({
    //             itemStyle:{
    //                 color: colors[0],
    //             },
    //             freq: node["freq"],
    //             value: node["value"],
    //             pct_change: node["pct_change"]+"%",
    //             id: root_id,
    //             cate_id: node['cate_id'],
    //             symbolSize: sizes[0],
    //             name: node['name'],
    //             category: [],
    //             layer: 0,
    //             clicked: 0
    //         });
    //         root_id++
    //     }

    //     function hasNode(data, node){
    //         for(var i = 0; i < data.length; i++){
    //             if(data[i]["name"] == node['name']){
    //                 return i
    //             }
    //         }
    //         return -1
    //     }

    //     Array.prototype.contains = function ( needle ) {
    //         for (i in this) {
    //             if (this[i] == needle) return true;
    //         }
    //         return false;
    //     }

    //     Array.prototype.indexOf = function(val) {
    //         for (var i = 0; i < this.length; i++) {
    //             if (this[i] == val) return i;
    //         }
    //         return -1;
    //     };

    //     Array.prototype.remove = function(val) {
    //         var index = this.indexOf(val);
    //         if (index > -1) {
    //             this.splice(index, 1);
    //         }
    //     };

    //     function getNodeByID(data, id){
    //         for(var i = 0; i < data.length; i++){
    //             if(data[i].id == id){
    //                 return data[i]
    //             }
    //         }
    //         return {}
    //     }

    //     function getIndexByID(data, id){
    //         for(var i = 0; i < data.length; i++){
    //             if(data[i].id == id){
    //                 return i
    //             }
    //         }
    //         return -1
    //     }

    //     function transEdges(data, newNodes, edges){
    //         var newEdges = []
    //         for(var i = 0; i < edges.length; i++){
    //             var ori_source_index = edges[i]['source']
    //             var ori_target_index = edges[i]['target']
    //             var ori_source_node = data[ori_source_index]
    //             var ori_target_node = data[ori_target_index]
    //             if(ori_source_index >= newNodes.length || ori_target_index >= newNodes.length){
    //                 var new_source_node = {
    //                     id:-1
    //                 }
    //                 var new_target_node = {
    //                     id:-1
    //                 }
    //             }
    //             else{
    //                 var new_source_node = newNodes[ori_source_index]
    //                 var new_target_node = newNodes[ori_target_index]
    //             }
    //             console.log("DATA:",data)
    //             console.log("INDEX:",ori_source_index,ori_target_index)
    //             console.log("NEWDATA:",newNodes)
    //             console.log("NODES:",ori_source_node,new_source_node,ori_target_node,new_target_node)
    //             if(ori_source_node.id == new_source_node.id && ori_target_node.id == new_target_node.id){
    //                 newEdges.push(edges[i])
    //                 console.log("PUSH EDGE:NORMAL")
    //             }
    //             else if(ori_source_node.id == new_source_node.id && ori_target_node.id != new_target_node.id){
    //                 if(getIndexByID(newNodes, ori_target_node.id) == -1){
    //                     alert(3,ori_target_node.id)
    //                     continue
    //                 }
    //                 newEdges.push({
    //                     source: ori_source_index,
    //                     target: getIndexByID(newNodes, ori_target_node.id)
    //                 })
    //                 console.log("PUSH EDGE:"+ori_source_index+getIndexByID(newNodes, ori_target_node.id))
    //             }
    //             else if(ori_source_node.id != new_source_node.id && ori_target_node.id == new_target_node.id){
    //                 if(getIndexByID(newNodes, ori_source_node.id) == -1){
    //                     alert(4,ori_source_node.id)
    //                     continue
    //                 }
    //                 newEdges.push({
    //                     source: getIndexByID(newNodes, ori_source_node.id),
    //                     target: ori_target_index
    //                 })
    //                 console.log("PUSH EDGE:"+getIndexByID(newNodes, ori_source_node.id)+ori_target_index)
    //             }
    //             else{
    //                 if(getIndexByID(newNodes, ori_source_node.id) == -1 || getIndexByID(newNodes, ori_target_node.id) == -1){
    //                     alert(5,ori_source_node.id,ori_target_node.id)
    //                     continue
    //                 }
    //                 newEdges.push({
    //                     source: getIndexByID(newNodes, ori_source_node.id),
    //                     target: getIndexByID(newNodes, ori_target_node.id)
    //                 })
    //                 console.log("PUSH EDGE:"+getIndexByID(newNodes, ori_source_node.id)+getIndexByID(newNodes, ori_target_node.id))
    //             }

    //         }
    //         return newEdges
    //     }

    //     function clearNodes(data, layer, edges, cate_id){
    //         console.log("clearNodes in:",data,layer,edges,cate_id)
    //         var newNodes = []
    //         var nextCateList = []
    //         for(var j = 0; j < data.length; j++){
    //             if(data[j].layer == layer && data[j].category.contains(cate_id)){
    //                 nextCateList.push(data[j].id)

    //                 for(var i = 0; i < edges.length; i++){
    //                     console.log(edges[i])
    //                     var sourceIndex = getIndexByID(data, edges[i]['source'])
    //                     var targetIndex = getIndexByID(data, edges[i]['target'])
    //                     if(sourceIndex == -1 || targetIndex == -1){
    //                         continue
    //                     }
    //                     if((edges[i]['source'] == data[j].id && data[targetIndex].layer < layer) || (edges[i]['target'] == data[j].id && data[sourceIndex].layer < layer )){
    //                         console.log("push1")
    //                         newNodes.push(data[j])
    //                         nextCateList.remove(data[j].id)
    //                     }
    //                 }
    //             }
    //             else{
    //                 console.log("push2")
    //                 newNodes.push(data[j])
    //             }
    //         }
    //         console.log([newNodes, nextCateList])
    //         return [newNodes, nextCateList]
    //     }

    //     function clearEdges(data, layer, edges, id){
    //         console.log("clearEdges in:",data,layer,edges,id)
    //         var newEdges = []
    //         for(var i = 0; i < edges.length; i++){
    //             if(edges[i]['source'] != id && edges[i]['target'] != id ){
    //                 newEdges.push(edges[i])
    //             }
    //             else if(edges[i]['source'] == id){
    //                 var node = getNodeByID(data, edges[i]['target'])
    //                 if(node['layer'] < layer-1){
    //                     newEdges.push({
    //                         source: id,
    //                         target: node['id']
    //                     })
    //                 }
    //             }
    //             else{
    //                 var node = getNodeByID(data, edges[i]['source'])
    //                 if(node['layer'] < layer-1){
    //                     newEdges.push({
    //                         source: node['id'],
    //                         target: id
    //                     })
    //                 }
    //             }
    //         }
    //         console.log(newEdges)
    //         return newEdges
    //     }

    //     myChart.setOption({
    //         tooltip: {
    //             padding: 10,
    //             backgroundColor: '#222',
    //             borderColor: '#777',
    //             borderWidth: 1,
    //             formatter: function (params) {
    //                 return (params.data.freq)?
    //                     ("<div>更新频率："+params.data.freq+"</div>"+
    //                         "<div>value："+params.data.value+"</div>"+
    //                         "<div>涨跌幅："+params.data.pct_change)
    //                     :
    //                     ("<div>更新频率：无</div>"+
    //                         "<div>value：无</div>"+
    //                         "<div>涨跌幅：无")
    //             },
    //         },
    //         series: [{
    //             type: 'graph',
    //             layout: 'force',
    //             animation: true,
    //             data: data,
    //             force: {
    //                 edgeLength: 150,
    //                 repulsion: 100,
    //                 //gravity: 0.1
    //             },
    //             edges: edges,
    //             //draggable: true,
    //             //focusNodeAdjacency:true,
    //             lineStyle:{
    //                 color: 'source',
    //                 width: 2,
    //                 shadowColor: 'rgba(0, 0, 0, 0.5)',
    //                 shadowBlur: 10,
    //                 //type:'dashed',
    //                 //curveness: 0.1
    //             },
    //             itemStyle: {
    //                 normal: {
    //                     label: {
    //                         show: true,
    //                         position: 'bottom',
    //                         color: "black",
    //                         fontWeight:"bold"
    //                     },
    //                     shadowColor: 'rgba(0, 0, 0, 0.5)',
    //                     shadowBlur: 10
    //                 }
    //             },
    //         }]
    //     });

    //     myChart.on('click',function(params){
    //         console.log(params.data)
    //     })

    //     myChart.on('dblclick',function(params){
    //         if(params.data.source != null){
    //             return
    //         }
    //         var c_layer = params.data["layer"] + 1
    //         if(c_layer == layers.length){
    //             return
    //         }
    //         var layerName = layers[c_layer]
    //         var size = sizes[c_layer]
    //         var c_color = colors[c_layer]

    //         if(params.data["clicked"] == 0){
    //             data[getIndexByID(data, params.data.id)]["clicked"] = 1
    //             for(var i = 0; i < rawData[layerName].length; i++){
    //                 var node = rawData[layerName][i]
    //                 if(node['category'].contains(params.data['cate_id'])){
    //                     var ori_id = hasNode(data, node)
    //                     if(ori_id == -1){
    //                         data.push({
    //                             itemStyle:{
    //                                 color: c_color
    //                             },
    //                             freq: node["freq"],
    //                             value: node["value"],
    //                             pct_change: node["pct_change"] +"%",
    //                             id: root_id,
    //                             cate_id: node['cate_id'],
    //                             symbolSize: size,
    //                             name: node['name'],
    //                             category: node['category'],
    //                             layer: c_layer,
    //                             clicked: 0
    //                         })
    //                         if( getIndexByID(data, root_id) == -1){
    //                             alert(1,{
    //                                 source: getIndexByID(data, params.data.id),
    //                                 target: getIndexByID(data, root_id)
    //                             })
    //                         }
    //                         edges.push({
    //                             source: getIndexByID(data, params.data.id),
    //                             target: getIndexByID(data, root_id)
    //                         })
    //                         root_id++
    //                     }
    //                     else{
    //                         if( ori_id == -1){
    //                             alert(2,{
    //                                 source: getIndexByID(data, params.data.id),
    //                                 target: ori_id
    //                             })
    //                         }
    //                         edges.push({
    //                             source: getIndexByID(data, params.data.id),
    //                             target: ori_id
    //                         })
    //                     }
    //                 }
    //             }
    //         }
    //         else{
    //             console.log("DELETE_IN!!!")
    //             console.log(data)
    //             console.log(params.data.id)
    //             console.log(getIndexByID(data, params.data.id))
    //             data[getIndexByID(data, params.data.id)]["clicked"] = 0
    //             var newNodes = []
    //             var newEdges = []
    //             if(params.data["layer"] == layers.length - 1){
    //                 return
    //             }
    //             if(params.data["layer"] == layers.length - 2){
    //                 newEdges = clearEdges(data, c_layer, edges, getIndexByID(data, params.data['id']))
    //                 console.log(newEdges)
    //                 newNodes = clearNodes(data, c_layer, newEdges, data[getIndexByID(data, params.data['id'])].cate_id)[0]
    //                 console.log(newEdges)
    //             }
    //             if(params.data["layer"] == layers.length - 3){
    //                 console.log('clear1')
    //                 newEdges = clearEdges(data, c_layer, edges, getIndexByID(data, params.data['id']))
    //                 var res = clearNodes(data, c_layer, newEdges, data[getIndexByID(data, params.data['id'])].cate_id)
    //                 newNodes = res[0]
    //                 for(var i = 0;i < res[1].length;i++){
    //                     console.log('clear2')
    //                     newEdges = clearEdges(newNodes, c_layer+1, newEdges, getIndexByID(data, res[1][i]))
    //                     newNodes = clearNodes(newNodes, c_layer+1, newEdges,data[getIndexByID(data, res[1][i])].cate_id)[0]
    //                 }
    //             }
    //             newEdges = transEdges(data, newNodes, newEdges)
    //             console.log(newEdges)
    //             data = newNodes
    //             edges = newEdges
    //         }
    //         console.log(data)
    //         console.log(edges)
    //         myChart.setOption({
    //             series: [{
    //                 roam: true,
    //                 data: data,
    //                 edges: edges
    //             }]
    //         });
    //     })
    // }


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
            <div id="Guangqi" style={{ width: 1500, height: 800 }}></div>

          </body>
      </div>
    );
  }
}

export default App;
