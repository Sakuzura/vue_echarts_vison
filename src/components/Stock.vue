<template>
  <div class="com-container">
      <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    data(){
        return{
            chartInstance:null,
            allData:null, //从服务器中获取的所有数据
            currentIndex:0, //当前显示的页数
            timerId:null //定时器的标识
        }
    },
    created(){
        //在组件创建完成之后，进行回调函数的注册
        this.$socket.registerCallBack('stockData',this.getData)
    },
    mounted(){
        this.initChart()
        this.$socket.send({
            action:'getData',
            socketType:'stockData',
            chartName:'stock',
            value:''
        })
        window.addEventListener('resize',this.screenAdapter)
        this.screenAdapter()
    },
    destroyed(){
        window.removeEventListener('resize',this.screenAdapter)
        clearInterval(this.timerId)
        //在组件销毁的时候，进行回调函数的取消
        this.$socket.unRegisterCallBack('stockData')
    },
    methods:{
        initChart(){
            this.chartInstance = this.$echarts.init(this.$refs.stock_ref,this.theme)
            const initOption = {
                title:{
                    text:'• Inventory and Sales Analysis',
                    left:20,
                    top:20
                }
            }
            this.chartInstance.setOption(initOption)
            this.chartInstance.on('mouseover',()=>{
                clearInterval(this.timerId)
            })
            this.chartInstance.on('mouseout',()=>{
                this.startInterval()
            })
        },
        //ret 就是服务端发送给客户端的图表数据
        getData(ret){
            //await this.$http.get()
            //对allData进行赋值
            // const {data:ret} = await this.$http.get('stock')
            this.allData = ret
            // console.log(this.ret)
            this.updateChart()
            this.startInterval()
        },
        updateChart(){
            const centerArr = [
                ['18%','40%'],
                ['50%','40%'],
                ['82%','40%'],
                ['34%','75%'],
                ['66%','75%']
            ]
            const colorArr = [
                ['#4FF778','#0BA82C'],
                ['#E5DD45','#E8B11C'],
                ['#E8821C','#E55445'],
                ['#5052EE','#AB6EE5'],
                ['#23E5E5','#2E72BF'],
            ]
            //处理数据
            const start = this.currentIndex * 5
            const end = (this.currentIndex + 1) * 5 
            const showData = this.allData.slice(start,end)
            const seriesArr = showData.map((item,index)=>{
                return {
                    type:'pie',
                    center:centerArr[index],
                    hoverAnimation:false, //关闭鼠标移入饼图时的动画效果
                    labelLine:{
                        show:false
                    },
                    label:{
                        position:'center',
                        color:colorArr[index][0]
                    },
                    data:[
                        {
                            name:item.name + '\n\n' + item.sales,
                            value:item.sales,
                            itemStyle:{
                                color:new this.$echarts.graphic.LinearGradient(0,1,0,0,[
                                    {
                                        offset:0,
                                        color:colorArr[index][0]
                                    },
                                    {
                                        offset:1,
                                        color:colorArr[index][1]
                                    }
                                ])
                            }
                        },
                        {
                            value:item.stock,
                            itemStyle:{
                                color:'grey'
                            }
                        }
                    ]
                }
            })
            const dataOption = {
                series:seriesArr
            }
            this.chartInstance.setOption(dataOption)
        },
        screenAdapter(){
            const titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6
            const innerRadius = titleFontSize * 2.8
            const outterRadius = innerRadius * 1.125
            const adapterOption = {
                title:{
                    textStyle:{
                        fontSize:titleFontSize
                    }
                },
                series:[
                    {
                        type:'pie',
                        radius:[outterRadius,innerRadius],
                        label:{
                            fontSize:titleFontSize / 2
                        }
                    },
                    {
                        type:'pie',
                        radius:[outterRadius,innerRadius],
                        label:{
                            fontSize:titleFontSize / 2
                        }
                    },
                    {
                        type:'pie',
                        radius:[outterRadius,innerRadius],
                        label:{
                            fontSize:titleFontSize / 2
                        }
                    },
                    {
                        type:'pie',
                        radius:[outterRadius,innerRadius],
                        label:{
                            fontSize:titleFontSize / 2
                        }
                    },
                    {
                        type:'pie',
                        radius:[outterRadius,innerRadius],
                        label:{
                            fontSize:titleFontSize / 2
                        }
                    }
                ]
            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        },
        startInterval(){
            if(this.timerId){
                clearInterval(this.timerId)
            }
            this.timerId = setInterval(()=>{
                this.currentIndex++
                if(this.currentIndex > 1){
                    this.currentIndex = 0
                }
                this.updateChart() //在更改完currentIndex之后，需要更新页面
            },5000)
        }
    },
    computed:{
        ...mapState(['theme'])
    },
    watch:{
        theme(){
            console.log('theme changed')
            this.chartInstance.dispose()//销毁当前图表
            this.initChart()//重新以最新的主题名称初始化图表对象
            this.screenAdapter() //完成屏幕的适配
            this.updateChart() //更新图表的展示
        }
    }
}
</script>

<style lang="less" scoped>

</style>