import React from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';

//引入柱状图
import  'echarts/lib/chart/bar';

//引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/scatter';

//引入图例组件
import 'echarts/lib/component/legend';
import { getRepetitionRate } from './utils/utils';

class RepetitionArticleBar extends React.Component{
    constructor(props){
        super(props);
    }

    // getRepetitionRate(obj){
    //     let repetitionRate = [];
    //     for (var  key in obj){
    //         let rate = obj[key];
    //         let fixRate = Number(rate * 100).toFixed(2);
    //         repetitionRate.push(fixRate);
    //     }
    //     return repetitionRate;
    // }

    getData(result){
        let arr = [];
        result.sort((value1,value2) =>{ return value2 -value1;});
        for (let i = 0; i < result.length;){
            var count = 0;
            for(let j = i; j < result.length; j++){
                if(result[i] === result[j]){
                    count++;
                }
            }
            let data = [result[i],count,`${result[i]}%`];
            arr.push(data);
            i += count;
        }
        return arr;
    }

    initChart = (result) =>{
        // 指定图表的配置项和数据
        let arr = getRepetitionRate(result);
        let data = this.getData(arr);
        let option = {
            xAxis: {
                name: '百分比（%）'
            },
            yAxis: {
                name: '段落数（个）'
            },
            series: [{
                symbolSize: 20,
                itemStyle:{
                    color: 'rgb(16,142,233)',
                },
                // data: [
                //     [40.0, 2, '40%'],
                //     [2.0, 1,'2%'],
                //     [13.0, 1, '13%'],
                //     [9.0, 1,'9%'],
                //     [11.0, 1,'11%'],
                //     [14.0, 2,'14%'],
                //     [30.0, 2,'30%'],
                //     [20.0, 1, '20%'],
                //     [42.0, 1, '42%'],
                //     [10.0, 3, '10%'],
                //     [5.0, 2, '5%']
                // ],
                data: data,
                type: 'scatter',
                label:{
                    emphasis:{
                        show: true,
                        formatter: function(param){
                            return `查重率为${param.data[2]}的段落数：${param.data[1]}个`;
                        },
                        position: 'top'
                    }
                }
            }]
        };


        let myChart = echarts.init(document.getElementById('repetitionArticleBarChart'));
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
                <div id="repetitionArticleBarChart" style={{width: '100%',height:'500px'}}></div>
            </div>
        )
    }
}

export default RepetitionArticleBar;


