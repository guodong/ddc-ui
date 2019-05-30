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

class ParaRepetitionRateBar extends React.Component{
    constructor(props){
        super(props);
    }

    initChart = () =>{
        // let option = {
        //     title: {
        //         text : '段落重复率',
        //     },
        //     tooltip: {},
        //     legend:{
        //         data:['段落']
        //     },
        //     xAxis: {
        //         data: []
        //     },
        //     yAxis: {},
        //     series:[{
        //         name: '段落',
        //         type: 'bar',
        //         data: []
        //     }]
        // };
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
                data: ["第1段","第2段","第3段","第4段","第5段","第6段"]
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
                data: [5, 20, 36, 10, 10, 20],
            }]
        };

        let myChart = echarts.init(document.getElementById('barChart'));
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
                <div id="barChart" style={{width: '100%',height:'500px'}}></div>
            </div>
        )
    }
}

export default ParaRepetitionRateBar;


