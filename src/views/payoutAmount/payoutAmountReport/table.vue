<template>
    <div>
        <div class="income_header">
            <span class="adname">项目：</span>
            <el-select
            style="width: 8%;"
                v-model="selectForm.app_code"
                :default-first-option="true"
                class="filter-item select-item"
                filterable
                placeholder="请选择项目"
                @change="handleFilter"
            >
                <el-option label="全部" value="" />
                <el-option v-for="item in app_code_list" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <span class="adname">媒体：</span>
            <el-select
            style="width: 6%;"
                v-model="selectForm.media"
                :default-first-option="true"
                class="filter-item select-item"
                filterable
                placeholder="请选择媒体"
                @change="handleFilter"
            >
                <el-option label="全部" value="" />
                <el-option v-for="item in media_list" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <span class="adname">主账号：</span>
            <el-select
            style="width: 8%;"
                v-model="selectForm.account"
                :default-first-option="true"
                class="filter-item select-item"
                filterable
                placeholder="请选择账号"
                @change="handleFilter"
            >
                <el-option label="全部" value="" />
                <el-option v-for="item in account_list" :key="item" :label="item" :value="item" ></el-option>
            </el-select>
            <span class="adname">子账号：</span>
            <el-input
            style="width: 8%;"
                v-model="selectForm.advertiser_id"
                @change="handleFilter"
                class="filter-item select-item"
                clearable
                placeholder="请输入子账号"
            />
        </div> 
        <div>
            <el-table
            :indent="indent"
            :data="treeTableList"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
            :tree-props="{children: 'children'}">
            <el-table-column
            
            prop="date"
            label="日期"
            width="180">
            </el-table-column>
            <el-table-column
            
            prop="app_code"
            label="项目"
            width="180">
            </el-table-column>
            <el-table-column
            
            prop="media"
            label="媒体">
            </el-table-column>
            <el-table-column
            
            prop="account"
            label="主账号">
            </el-table-column>
            <el-table-column
            
            prop="advertiser_id"
            label="子账号">
            </el-table-column>
            <el-table-column
            
            prop="pay_amount"
            label="赔付金额">
            </el-table-column>
        </el-table>
        </div>
    </div>
</template>

<script>
import { getPayoutAmountList } from "@/api/payoutAmount";
    export default {
        data(){
            return {
                treeTableList:[],
                tableData:[],
                app_code_list:[],
                media_list:[],
                pay_amount_list:[],
                account_list:[],
                advertiser_id_list:[],
                date:{
                    date:"",
                    pay_amount:''
                },
                indent:0,
                app_code:[],
                media:[],
                account:[],
                advertiser_id:[],
                selectForm:{
                    app_code:'',
                    media:'',
                    advertiser_id:'',
                    account:'',
                    startDay:'2024-04-09',
                    endDay:'2024-04-09'
                }
            }
        },
        mounted() {
                this.getCurrentDate()
                getPayoutAmountList().then(data=>{
                    if(data.error_code===0&&data.data.map(item=>item.pay_amount!='0.0000')){
                        this.app_code_list = this.uniqueArr(data.data.map(item=>item.app_code))
                        this.media_list = this.uniqueArr(data.data.map(item=>item.media))
                        this.account_list = this.uniqueArr(data.data.map(item=>item.account))
                        this.advertiser_id_list = this.uniqueArr(data.data.map(item=>item.advertiser_id))
                        // console.log('tt',this.app_code_list);
                        // console.log('tt',this.media_list);
                        // console.log('tt',this.account_list);
                        // console.log('tt',this.advertiser_id_list);
                    }else{
                        this.$message.error('获取失败')
                    }
                })
                .catch((error)=>{
                    console.log(error);
                })
            this.getPayoutAmountList()
        },
        methods: {
            getCurrentDate(){
                const now = new Date()
                let year = now.getFullYear();
                let month = now.getMonth() + 1;
                if(month<10){
                    month = `0${month}`
                }
                let day = now.getDate();
                if(day<10){
                    day = `0${day}`
                }
                const currentDate = `${year}-${month}-${day}`
                this.selectForm.startDay = currentDate
                this.selectForm.endDay = currentDate
                // console.log(this.currentDate);
            },
            // 唯一id
            uuid() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            },
            // 数组去重
            uniqueArr(arr){
                const uniqueArr = arr.filter((item, index) => arr.indexOf(item) === index);
                return uniqueArr
            },
            
            // 对象数组去重
            // uniqueObjArr(arr,uniId){
            //     const res = new Map();
            //     return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
            // },
            // 将一个对象数组里以某个属性相同做判断拆成多个新数组
            categoryArr(arr,props){
                const type = props
               const newArr = arr.reduce((acc,item)=>{
                    let key = item[props]
                    if(!acc.has(key)){
                        acc.set(key,[])
                    }
                    acc.get(key).push(item)
                    return acc;
                },new Map)

                const temp = Array.from(newArr,([key,value])=>({key,value})).map(item=>{
                    const amount = item.value.reduce((res,cur)=>{
                        return (res*1+cur.pay_amount*1).toFixed(2)
                    },0)
                    return {
                        [props]:item.key,
                        pay_amount:amount,
                        id:this.uuid()
                    }
                })
                // console.log(temp.sort((a,b)=>a.pay_amount-b.pay_amount),'final');
                return temp.sort((a,b)=>b.pay_amount-a.pay_amount)
            },
            // 获取同一天对应的项目
            getApp_code(){

                const sum = this.tableData
                this.app_code = this.categoryArr(sum,'app_code')
                // console.log(this.app_code,'inde');
            },
            // 获取一个项目对应的媒体
            getMedia(app_code){
                let pay_amount = this.tableData.filter(item=>item.app_code==app_code)
                // console.log(pay_amount,'temp');

                this.media = this.categoryArr(pay_amount,'media')
                // console.log(this.media,'media');
            },
            // 获取一个媒体对应的主账号
            getAccount(app_code,media){
                let pay_amount = this.tableData.filter(item=>item.app_code==app_code&&item.media==media)
               this.account = this.categoryArr(pay_amount,'account')
            },
            // 获取一个主账号对应的子账号
            getAccount_id(account){
                let pay_amount = this.tableData.filter(item=>item.account==account)
                this.advertiser_id = this.categoryArr(pay_amount,'advertiser_id')
            },
            // 获取初始列表数据
            getPayoutAmountList(){
                getPayoutAmountList(this.selectForm).then(data=>{
                    if(data.error_code===0&&data.data.map(item=>item.pay_amount!='0.0000')){
                        this.tableData = data.data.filter(item=>item.pay_amount!='0.0000')
                        if(this.tableData.length>0){
                            this.date.date = data.data.map(item=>item.day)[0]
                            let pay_amount = this.tableData.filter(item=>item.day==this.date.date)||''
                            let sum = pay_amount.reduce((prev,item)=>(prev*1+item.pay_amount*1).toFixed(2),0)
                            // console.log(pay_amount);
                            // console.log(sum);
                            this.date.pay_amount = sum
                        this.getTreeTableList()
                        }else {
                            this.treeTableList = []
                            this.$message({
                                message:'没有赔付',
                                type:'success'
                            })
                        }
                       
                    }else{
                        this.$message.error('获取失败')
                    }
                })
                .catch((error)=>{
                    console.log(error);
                })
            },
            handleFilter(){
                this.getPayoutAmountList()
            },
            getTreeTableList(){
                this.tableData = this.tableData.filter(item=>item.pay_amount!='0.0000')
                this.getApp_code()
                // console.log(this.app_code,'app_code');
                    this.app_code.forEach((app_code)=>{
                        this.getMedia(app_code.app_code)
                        // console.log(this.media);
                        this.media.forEach((media)=>{
                            this.getAccount(app_code.app_code,media.media)
                            this.account.forEach((account)=>{
                                this.getAccount_id(account.account)
                                // console.log(this.advertiser_id,111);
                                account.children = this.advertiser_id
                            })
                            media.children = this.account
                        })
                        app_code.children = this.media
                    })
                    const object = {
                        date:this.date.date,
                        id:1,
                        pay_amount:this.date.pay_amount,
                        children:this.app_code
                    } 

                    this.treeTableList = [object]
               console.log(this.treeTableList,'treeTableList');
            }
        },
    }
</script>

<style lang="scss" scoped>
.el-dialog {
  width: 550px;
}
.income_div {
  padding: 10px 20px 20px 20px;
}
.income_header {
  margin-bottom: 20px;
}
.incometable {
  border: none;
  border-left: 1px solid #ebeef5;
  margin-top: 20px;
}
.incometable::before {
  height: 0px;
}
.incometable .el-table__header {
  border-top: 1px solid #ebeef5;
}
.incometable .el-table__body-wrapper {
  max-height: 600px;
  overflow-y: auto;
}
.income_div .el-dialog__header {
  border-bottom: 1px solid #ebeef5;
}
.income_select {
  width: 200px;
  margin-left: 10px;
}
.adname {
  font-size: 14px;
  margin-left: 10px;
}
.select-item {
  width: 150px;
  margin: 10px 20px 0px 0px;
}
</style>
import { filter } from 'vue/types/umd';
import { filter } from 'vue/types/umd';
import { uniq } from 'shelljs';

