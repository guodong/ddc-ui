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

class RepetitionArticleBar extends React.Component{
    constructor(props){
        super(props);
    }

    initChart = () =>{
        // 指定图表的配置项和数据
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
                data: [
                    [40.0, 2, '40%'],
                    [2.0, 1,'2%'],
                    [13.0, 1, '13%'],
                    [9.0, 1,'9%'],
                    [11.0, 1,'11%'],
                    [14.0, 2,'14%'],
                    [30.0, 2,'30%'],
                    [20.0, 1, '20%'],
                    [42.0, 1, '42%'],
                    [10.0, 3, '10%'],
                    [5.0, 2, '5%']
                ],
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
        this.initChart();
    }

    componentDidUpdate(){
        this.initChart();
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


