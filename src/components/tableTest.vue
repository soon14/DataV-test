<template>
  <div class="table-page">
   <div class="top">
     
   </div>
   <div class="bottoms" v-loading="fileLoading">
      <i-table
      :list="list"
      :total="total" 
      :otherHeight="otherHeight" 
      :options="options"
      :pagination="pagination"
      :columns="columns" 
      :operates="operates" 
      @handleSizeChange="handleSizeChange"
      @handleIndexChange="handleIndexChange" 
      @handleSelectionChange="handleSelectionChange" 
      @handleFilter="handleFilter" 
      @handelAction="handelAction">
      </i-table>
   </div>
          <el-dialog
                title="部件"
                :visible.sync="changeParts"
                width="55%"
                :close-on-click-modal="false"
                class='dialog'
                :before-close="closePartsdialog">

                    <div class="top">
                        <!-- <el-button type="primary" @click="openInsertPart"><i class="el-icon-plus"></i> 新增</el-button> -->
                        <el-upload
                            action=""
                            :before-upload="beforeUpload"
                            :limit="1"
                             style="display:inline-block"
                            :http-request="uploadFile"
                             :show-file-list="false"
                           >
                            <el-button size="small" type="primary">导入</el-button>
                        </el-upload>
                        <el-button type="primary" size="small" @click="exportPart">下载模板</el-button>
                    </div>
                    <el-table
                        :data="PartData"
                        border
                        style="width: 100%;heigth:60%">
                        <el-table-column
                        prop="partName"
                        label="部件名"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="partNum"
                        label="部件编号"
                        width="200">
                        </el-table-column>
                        <el-table-column
                        prop="partAddress"
                        label="部件地址"
                        width="200">
                        </el-table-column>
                        <el-table-column label="操作">
                        <template slot-scope='scope'>
                        </template>                            
                        </el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <div class='page_all' style="position:relative;margin-top: 30px;">
                        <el-pagination
                            @size-change="PartSizeChange"
                            @current-change="PartCurrentChange"
                            :current-page="pagePartNum"
                            :page-sizes="[10, 20, 50, 100]"
                            :page-size="pagePartSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="partTotal">
                        </el-pagination>
                    </div>
            </el-dialog>
  </div>
</template>
<script>
  import iTable from './common/tables'
  import pagination from './common/Pagination'
  export default {
    components: {
      expandDom: {
        props: {
          column: {
           required: true
          },
          row: {
            required: true
          }
        },
        render (h) {
          return h('div', {}, ([this.column.render(this.row, this.column)]))
        }
     },
     iTable,pagination
   },
    data () {
      return {
        total: 0,
        list: [
           
        ],
        fileLoading:false,
        changeParts:false,
        deviceInfo:'',
        pagePartNum:1,//部件页码
        pagePartSize:10,//部件页数量
        partTotal:0,//部件总数
        PartData:[],//部件表格
        otherHeight: 208,
        columns: [
          {
            prop: 'typeCode',
            label: '类型标志',
            align: 'center',
            width: 160,
            select:true,
            value:"",

          },
          {
            prop: 'guid',
            label: '设备编号',
            align: 'center',
            width: 140,
            select:true,
            value:"",
            method:(data) =>{
              this.handelAction(data)
            },

          },
          {
            prop: 'sysType',
            label: '系统类型',
            align: 'center',
             width: 120,
            // formatter: (row, column, cellValue) => {
            //   return `<span style="white-space: nowrap;color: dodgerblue;">${row.title}</span>`
            // }
          },
          {
            prop: 'sysAddress',
            label: '系统地址',
            align: 'center',
            width: 120,
            // render: (h, params) => {
            //   return h('el-tag', {
            //     props: {type: params.row.state === 0 ? 'success' : params.row.state === 1 ? 'info' : 'danger'} // 组件的props
            //   }, params.row.state === 0 ? '上架' : params.row.state === 1 ? '下架' : '审核中')
            // }
          },
          {
            prop: 'compType',
            label: ' 部件类型',
            align: 'center',
            width: 100
          },
          {
            prop: 'compAddress',
            label: '部件地址',
            align: 'center',
            width: 120
          },
          {
            prop: 'compStatus',
            label: '部件状态',
            align: 'center',
            width: 100
          },
          {
            prop: 'compDesc',
            label: '部件描述',
            align: 'center',
            width: 120,
          },
          {
            prop: 'localDateTime',
            label: '状态发送时间',
            align: 'center',
            width: 160,
          },
          {
            prop: 'opeInfo',
            label: '操作信息',
            align: 'center',
          },
          {
            prop: 'operNum',
            label: '操作人编号',
            align: 'center',
          },
          {
            prop: 'deviceStatus',
            label: '类型标志',
            align: 'center',
          },
          {
            prop: 'modelType',
            label: '模拟量类型',
            align: 'center',
            width: 130,
          },
          {
            prop: 'modelValue',
            label: '模拟量值',
            align: 'center',
          },
          {
            prop: 'captureCardOrderNum',
            label: '采集卡口',
            align: 'center',
          },
        ], // 需要展示的列
        operates: {
          width: 220,
          fixed: 'right',
          list: [
            {
              label: '查岗',
              type: 'primary',
              show: true,
              plain: true,
              disabled: false,
              method: (index, row) => {
                this.handleEdit(index, row)
              }
            },
            {
              label: '校时',
              type: 'primary',
              show: true,
              plain: true,
              disabled: false,
              method: (index, row) => {
                this.handleDel(index, row)
              }
            },
            {
              label: '部件',
              type: 'primary',
              show: true,
              plain: true,
              disabled: false,
              method: (index, row) => {
                this.deviceInfo = row
                this.changeParts = true
                this.partList()
              }
            },
          ],
        }, // 操作按钮组
        pagination: {
          pageIndex: 1,
          pageSize: 10
        }, // 分页参数
        options: {
          stripe: true, // 是否为斑马纹 table
          loading: false, // 是否添加表格loading加载动画
          highlightCurrentRow: true, // 是否支持当前行高亮显示
          mutiSelect: true // 是否支持列表项选中功能
        } // table 的参数
      }
    },
    
    mounted () {
       sessionStorage.setItem('Authorization',1)
       this.getData()
       this.loop()
    },
    destroyed() {
      clearInterval(this.timer)
    },
    methods: {
      PartCurrentChange(page){ //页数改变
            this.pagePartNum = page;
            this.partList();
        },
      PartSizeChange(pageSize){//条数改变
            this.pagePartSize = pageSize;
            this.partList();
        },
      closePartsdialog(){
        this.changeParts = false
      },
      beforeUpload (file) { // 上传文件之前的钩子
            if(file.type === 'application/vnd.ms-excel'){
                return true;
            }else{
                this.$alert('添加文件类型不对，请重新选择excel格式', '提示', {
                    confirmButtonText: 'OK'
                });
                return false;
            }
        },
        exportPart(){//导出模板
            window.location.href='https://oss-kaleidoscope.oss-cn-hangzhou.aliyuncs.com/duty/1587457164952-%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E9%83%A8%E4%BB%B6.xls';
        },
        uploadFile(file){//上传excel
            var _this=this;
            var formdata = new FormData();
            formdata.append('file',file.file);
            formdata.append('deviceId',this.deviceInfo.deviceId);
            this.axios({
                url   :'/api/monitor/check/part.excel',
                method: 'post',
                dataType:'json',
                data:formdata
            }).then(res=>{
                if(res.data.code==0){
                    _this.$alert('上传成功', '提示', {
                            confirmButtonText: 'OK',
                            callback:()=>{
                                _this.normal=[];
                            }
                        });
                    _this.partList()
                }
            })
        },
          partList(){//部件列表
            var _this=this;
            this.axios({
                url   :'/api/monitor/check/part.list',
                method: 'post',
                dataType:'json',
                data:{
                    deviceId:this.deviceInfo.deviceId,
                    pageNum:this.pagePartNum,
                    pageSize:this.pagePartSize
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.PartData=res.data.list;
                    _this.partTotal=res.data.total
                    _this.changeParts=true;
                }
            })
        },
      loop(){
         this.timer = setInterval( ()=>{
            this.getData()
          },5000)
      },
      getData(){
         this.axios({
                url: '/api/monitor/dr/transmission/data/list',
                method: 'post',
                data:{
                    pageSize:this.pagination.pageSize,
                    pageNum:this.pagination.pageIndex,
                }
          }).then( res => { 
              this.total = res.data.total
              this.list = res.data.list
              this.list.map( item =>{
                item.localDateTime = item.localDateTime && this.$moment(item.localDateTime).format("YYYY-MM-DD HH:mm:ss");
              })
          })
      },
      // 切换每页显示的数量
      handleSizeChange (pagination) {
        this.pagination = pagination
        this.getData()
      },
      // 切换页码
      handleIndexChange (pagination) {
        this.pagination = pagination
        this.getData()
      },
      // 选中行
      handleSelectionChange (val) {
        console.log('val:', val)
      },
      // 编辑
      handleEdit (index, row) {
         this.axios({
                url: '/api/monitor/check/_user/lookup',
                method: 'post',
                data:{
                    deviceId:row.id,
                    type:4,
                    delayTime:1,
                    deviceCode:row.guid
                }
            }).then( res => { 
               this.$alert(res.data.msg)
            })
      },
      handleDel (index, row) {
          this.$post('/api/monitor/check/syncUserTime',{
              guid:row.guid,
              localDateTime: new Date()
          }).then( res => { 
                this.$alert(res.msg)
            })
      },
      handleFilter () {

      },
      handelAction(data) {
        console.log(data)
      }
    }
  }
</script>


<style lang="scss">
    .table-page{
        height: 100%;
        width: 100%;
        overflow: hidden;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        .bottoms{
          flex: 1;
        }
    }
</style>