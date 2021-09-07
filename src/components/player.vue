<template>
            
     
    <div class="box" ref="boxs" v-if="sicList.length">
        <el-input v-model="pageNum" placeholder="请输入内容"></el-input>
         <el-button style="height:50px" @click="next1">下一页</el-button>
       <el-button style="height:50px" @click="getSrc">获取</el-button>
       <el-button style="height:50px" @click="next">下一页</el-button>
          <video-player 
           v-for="(item, index) in sicList" :key="index"
            class="video-player-box"
            :options="item"
            :playsinline="true"
            :ref="'videoPlayer'+index"
            customEventName="customstatechangedeventname"
             @playing="onPlayerPlay($event,item)"
             @canplay="onPlayerCanplay($event,item)"
            >
          </video-player>
    </div>
</template>

 <script>
import "video.js/dist/video-js.css"
// import "videojs-flash"
import { videoPlayer } from "vue-video-player"
// import SWF_URL from 'videojs-swf/dist/video-js.swf'
import 'videojs-contrib-hls'
// import html2canvas from 'html2canvas'
export default {
    components:{
        videoPlayer
    },
    data() {
    return {
      playerOptions: {
        muted: false,
        autoplay: true,
        language: 'en',
        preload:'auto',
        sources: [
          {
            src:"http://211.140.133.46:6713/mag/hls/7480541e65174d3fa978cc38e7a99f8d/1/live.m3u8"
          }
        ],
       html5: { hls: { withCredentials: false } },
       hls:true,
      },
      pageSize:10,
      pageNum:1,
      sicList:[],
      ableList:[],
      allList:[],
    }
  },
  methods: {
    getArrDifference(arr1, arr2) {

        return arr1.concat(arr2).filter(function(v, i, arr) {
            return arr.indexOf(v) === arr.lastIndexOf(v);
        });
    },
    getSrc(){
      var disable = this.getArrDifference(this.allList,this.ableList)
      console.log(disable)
        this.$post('/api/monitor/monitor/update/move/camera',{
          errorUrl:disable
      })
    },
    next(){
      this.pageNum=this.pageNum*1+1
      console.log(this.pageNum)
      this.getData()
      this.ableList= []
    },
    next1(){
      this.pageNum=this.pageNum*1-1
      console.log(this.pageNum)
      this.getData()
      this.ableList= []
    },
    onPlayerPlay(e,src){
      // console.log(src)
    },
    onPlayerCanplay(e,src){
      this.ableList.push(src.sources[0].src)
    },
    getData(){
      this.$post('/api/monitor/monitor/move/camera/list',{
        pageSize:this.pageSize,
        pageNum:this.pageNum
      }).then( res =>{
        let list = []
        this.allList = res.data.list
        res.data.list.map( item =>{
          list.push({
              muted: false,
              autoplay: true,
              language: 'en',
              preload:'auto',
              sources: [{src:item}],
            html5: { hls: { withCredentials: false } },
            hls:true,
          })
        })
        this.sicList = list
       
        // console.log(list)
      })
    }
  },
  mounted() {
    this.getData()
  },
}
</script>


<style lang="scss">
    .box{
      height: 100%;
      width: 100%;
      position: relative;
      overflow: auto;
      display: flex;
      flex-wrap: wrap;
    }
    .video-js,.video-player-box{
        height: 200px;
        width: 200px;
    }
</style>