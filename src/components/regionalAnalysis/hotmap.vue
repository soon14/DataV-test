<template>
    <div class="hot_wrapper">
        <div class="map">
            <div style="height:100%;width:100%;outline: none!important;" id="container" tabindex="0"> </div>
        </div>
        <el-button type="primary" @click="changeDatas" style="position: absolute;;right:0;top:0">返回</el-button>
        <el-button type="primary" @click="change" style="position: absolute;;right:0;top:50px">数据</el-button>
        <el-button type="primary" @click="hide" style="position: absolute;;right:0;top:100px">隐藏</el-button>
        <el-button type="primary" @click="show" style="position: absolute;;right:0;top:150px">显示</el-button>
    </div>
</template>


<script>
import AMap from "AMap";
export default {
    data() {
        return {
            adCode: 330800, // 衢州
            // adCode: 330600, // 绍兴
            disProvince: null, // 区域图层
            depth: 2, // 区域等级 0省级 1市级 2区县级
            colors: {}, // 区域颜色
            heatmap: null, // 热力图
            // city: '绍兴市',
            city: '衢州市',
        }   
    },
    methods: {
        change () {
            var data = []
            for( var i=0; i<500; i++ ) {
                var lng = 119.24185
                var lat = 29.260089
                var index = Math.random() * 2
                if ( index >=1.5 ) {
                    index = 1
                }else{
                    index = -1
                }
                var num = Math.random()*0.8*Math.pow(-1,index)
                var num1 = Math.random()*0.8*Math.pow(-1,index)
                var num2 = Math.random()*150*Math.pow(-1,index)
                data.push(
                    {
                        lng:lng+num1,
                        lat:lat+num,
                        count:40+num2
                    }
                )
            }
            this.heatmap.setDataSet({
                data,
                // max:100
            })
        },
      
        initMap() {// 创建地图
            var that = this
            this.map = new AMap.Map('container', {
                zoom:10,
                zooms: [10,14],
                center:[118.87207,28.943265],
                // center:[120.580444,29.859701],
                resizeEnable: true,
                showIndoorMap: false,
                mapStyle:"amap://styles/0206dfbcbabc11e4971c1a2e6bcdda2e",
                // mapStyle:"amap://styles/darkblue",
                features:['point','road','bg'],//地图要素
                viewMode:"2D",
                pitch:65,
                zoomEnable:true,
                // dragEnable: false,
            })
            AMap.plugin('AMap.Geocoder', function() {
                that.geocoder = new AMap.Geocoder({
                })
            })
            this.map.on( "hotspotclick", (data) => {
                var lnglat = [data.lnglat.lng,data.lnglat.lat]
                this.map.setCenter(lnglat)
                this.map.setStatus({
                    zoomEnable: true,
                    });
                this.map.setZoom(11)
                // this.map.setStatus({
                //     zoomEnable: false,
                //     });
                // console.log(data)
                that.geocoder.getAddress(lnglat, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        that.changeData(result.regeocode.addressComponent.district)
                    }
                })
            })
        },
        init1 (city) {
            var that =this
            if( that.polygon ) {
                that.map.remove(that.polygon)
            }
            AMap.plugin('AMap.DistrictSearch', function () {//区域遮盖

                new AMap.DistrictSearch({
                    extensions: 'all',
                    subdistrict: 0
                }).search(city, function(status, result) {// 外多边形坐标数组和内多边形坐标数组
                    var outer = [
                    new AMap.LngLat(-360, 90, true),
                    new AMap.LngLat(-360, -90, true),
                    new AMap.LngLat(360, -90, true),
                    new AMap.LngLat(360, 90, true)
                    ]
                    var holes = result.districtList[0].boundaries
                    var pathArray = [outer]
                    pathArray.push.apply(pathArray, holes)
                    that.polygon = new AMap.Polygon({
                        pathL: pathArray,
                        strokeColor: 'rgba(255,255,255,0.5)',
                        strokeWeight: 1,
                        fillColor: 'rgba( 0 , 0, 1, 1)', // 遮罩背景色
                        fillOpacity: 1
                    })
                    that.polygon.setPath(pathArray)
                    that.map.add(that.polygon)
                })
            })
        },
        initPro(code, dep) {//创建区域图层
            let that = this
            // this.disProvince && disProvince.setMap(null)
            AMap.plugin('AMap.DistrictLayer', function () {
            that.disProvince = new AMap.DistrictLayer.Province({
                    zIndex: 13,
                    adcode: [code],
                    NAME_CHN:that.city,
                    depth: dep,
                    styles: {
                    fill: function(properties) {
                        // properties为可用于做样式映射的字段，包含
                        // NAME_CHN:中文名称
                        // adcode_pro
                        // adcode_cit
                        // adcode
                        var adcode = properties.adcode
                        // console.log(properties.adcode)
                        // return that.getColorByAdcode(adcode)
                    },
                    'province-stroke': 'cornflowerblue',
                    'city-stroke': 'white', // 中国地级市边界
                    'county-stroke': 'rgba(255,255,255,0.5)' // 中国区县边界
                    }
                })
                that.disProvince.setMap(that.map)
            })
            
        },
            
        getColorByAdcode(adcode) {// 颜色辅助方法
                // console.log(adcode)
            if (!this.colors[adcode]) {
                var gb = Math.random() * 155 + 50;
                // this.colors[adcode] = "#FCF9F2"
                // this.colors[adcode] = '#F8B62D'
                this.colors[adcode] = 'rgb(' + gb + ',' + gb + ',255)'
                // console.log(this.colors[adcode])
            }
            return this.colors[adcode]
        },
            
        lockMapBounds() {// 限制地图显示范围
            var bounds = this.map.getBounds()
            this.map.setLimitBounds(bounds)
        },
        hide() {
            this.heatmap.hide()
        },
        show() {
            this.heatmap.show()
        },
        drwaHeatmap(heatmapData) {// 绘制热力图
            var that = this
            if (!this.isSupportCanvas()) {
                alert(
                '热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~'
                )
            }
            this.map.plugin(['AMap.Heatmap'], function() {
                // 初始化heatmap对象
                that.heatmap = new AMap.Heatmap(that.map, {
                    radius: 20, // 给定半径
                    opacity: [0, 1],
                    gradient:{
                        0.5: '#103479',
                        0.7: '#80C63D',
                        0.8: '#80C63D',
                        0.9: '#C95628',
                        1.0: '#C34F29'
                    },
                })
                var points =[
                    {"lng":118.991031,"lat":28.988585,"count":100},
                    {"lng":118.589275,"lat":28.925818,"count":21},
                    {"lng":118.687444,"lat":28.810742,"count":22},
                    {"lng":118.581707,"lat":28.940089,"count":33},
                    {"lng":118.510588,"lat":28.880172,"count":34},
                    {"lng":118.894816,"lat":28.91181,"count":35},
                    {"lng":118.716002,"lat":28.952917,"count":16},
                    {"lng":118.991033,"lat":28.988585,"count":10},
                    {"lng":118.589270,"lat":28.925818,"count":31},
                    {"lng":118.687436,"lat":28.810742,"count":22},
                    {"lng":118.581769,"lat":28.940089,"count":33},
                    {"lng":118.510515,"lat":28.880172,"count":44},
                    {"lng":118.894869,"lat":28.91181,"count":35},
                    {"lng":118.716055,"lat":28.952917,"count":16},
                    {"lng":118.981031,"lat":28.988585,"count":50},
                    {"lng":118.539275,"lat":28.925818,"count":41},
                    {"lng":118.667444,"lat":28.810742,"count":22},
                    {"lng":118.591707,"lat":28.940089,"count":33},
                    {"lng":118.560588,"lat":28.880172,"count":34},
                    {"lng":118.894816,"lat":28.91181,"count":35},
                    {"lng":118.736002,"lat":28.952917,"count":19},
                    {"lng":118.901033,"lat":28.988585,"count":50},
                    {"lng":118.569270,"lat":28.925818,"count":21},
                    {"lng":118.697436,"lat":28.810742,"count":22},
                    {"lng":118.561769,"lat":28.940089,"count":53},
                    {"lng":118.540515,"lat":28.880172,"count":44},
                    {"lng":118.894869,"lat":28.91181,"count":35},
                    {"lng":118.736055,"lat":28.952917,"count":16},
                ];
                that.heatmap.setDataSet({
                    data: points, 
                })
            })

        },
        isSupportCanvas() {// 判断浏览区是否支持canvas
            var elem = document.createElement('canvas')
            return !!(elem.getContext && elem.getContext('2d'))
        },
        getData() {
            this.initMap()
            this.init1(this.city)
            this.initPro(this.adCode, this.depth)
            // this.lockMapBounds()
            this.drwaHeatmap()
        },
        changeData(city,adcode) {
            this.init1(city)
            // this.initPro(this.adCode, 2)
        },
        changeDatas() {
            this.init1(this.city)
            this.map.setCenter([118.87207,28.943265])
            this.map.setZoom(10)
            this.map.setStatus({
                zoomEnable: false,
            });
        },

    },
    mounted() {
       this.getData()
    },

}
</script>

<style lang="scss">
    // .d{
    //     color: rgb(130,150,255)
    // }
    .hot_wrapper{
        height: 100%;
        width: 100%;
        // background-color: #000001
        .map{
            height: 100%;
            width: 100%;
            float: left;
        }
    }
</style>