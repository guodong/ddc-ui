import React from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';

//引入柱状图
import  'echarts/lib/chart/bar';

//引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

//引入图例组件
import 'echarts/lib/component/legend';
import {inject, observer} from "mobx-react";
import { getRepetitionRate } from './utils/utils';


class ParaRepetitionRateBar extends React.Component{
    constructor(props){
        super(props);
    }

    getCategory(obj){
        let category = [];
        for(var key in obj){
            let keyName = `第${key}段`;
            category.push(keyName);
        }
        return category;
    }


    initChart = (data) =>{
        console.log("666666666666",this.getCategory(data));
        // 指定图表的配置项和数据
        let option = {
            title: {
            },
            tooltip: {
            },
            legend: {
                data:['重复率']
            },
            xAxis: {
                name: '段落',
                // data: ["第1段","第2段","第3段","第4段","第5段","第6段"]
                data: this.getCategory(data),
            },
            yAxis: {
                name: '重复率(%)',
            },
            series: [{
                itemStyle:{
                    color:'rgb(16,142,233)'
                },
                name: '重复率',
                type: 'bar',
                // data: [5, 20, 36, 10, 10, 20],
                data: getRepetitionRate(data),
            }]
        };

        let myChart = echarts.init(document.getElementById('barChart'));
        myChart.setOption(option);
    }

    componentDidMount(){
        let result = this.props.result;
        this.initChart(result);
    }

    componentDidUpdate(){
        let result = this.props.result;
        this.initChart(result);
    }

    render(){
        return(
            <div>
                <div id="barChart" style={{width: '100%',height:'500px'}}></div>
            </div>
        )
    }
}

export default ParaRepetitionRateBar;



