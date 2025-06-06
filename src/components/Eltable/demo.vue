<template>
  <tables :dataSource="dataSource" :columns="columns"></tables>
</template>
<script>
import tables from '@/components/Eltable/index'
export default {
  data () {
    return {
      dataSource: [{
        'createTime': 123,
        'times': 123,
        'username': 'qweq',
        'deptName': 'adad',
        'status': 1
      }, {
        'createTime': 123,
        'times': 123,
        'username': 'qweq',
        'deptName': 'adad',
        'status': 1
      }, {
        'createTime': 123,
        'times': 123,
        'username': 'qweq',
        'deptName': 'adad',
        'status': 1
      }],
      columns: [{
        hasSort: false, // <Boolean> 是否排序
        prop: 'createTime', // <String>  对应属性名
        label: '日期', // <String>   表头标签
        align: 'center', // 表头内容是否居中
        width: 200 // 列宽
      }, {
        hasSort: false,
        prop: 'times',
        label: '时间',
        align: 'center'
      }, {
        hasSort: true,
        prop: 'username',
        label: '名字',
        align: 'center'
      }, {
        hasSort: true,
        prop: 'deptName',
        label: '部门名称',
        align: 'center'
      }, {
        hasSort: true,
        prop: 'status',
        label: '状态',
        align: 'center'
      },
      {
        hasSort: true,
        prop: 'aaa',
        label: '模板',
        align: 'center',
        render: (h, params) => {
          return (<el-switch value={Boolean(params.row.status)} active-color="#13ce66" onChange={() => this.changeSwitch(params)} inactive-color="#ff4949"></el-switch>)
        }
      },
      {
        hasSort: true,
        prop: 'operate',
        label: '操作',
        align: 'center',
        render: (h, params) => {
          // const switchComp = h('el-switch', {
          //   props: {
          //     activeColor: '#13ce66',
          //     inactiveColor: '#ff4949',
          //     value: Boolean(params.row.status)
          //   },
          //   on: {
          //     change: () => {
          //       this.changeSwitch(params)
          //     }
          //   }
          // })
          // const deleteButton = h('el-button', {
          //   props: {
          //     type: 'primary'
          //   },
          //   on: {
          //     click: () => {
          //       this.delete(params)
          //     }
          //   }
          // }, '删除')
          // const editButton = h('el-button', {
          //   props: {
          //     type: 'primary'
          //   },
          //   on: {
          //     click: () => {
          //       this.delete(params)
          //     }
          //   }
          // }, '编辑')
          // return h('div',[switchComp,deleteButton,editButton])
          return (<el-button type= 'primary' size="mini" onClick={() => this.delete(params)}>取 消</el-button>)
        }
      }

      ]
    }
  },
  components: {
    tables // 注册table组件
  },
  watch: {
    //
  },
  mounted () {
    //
  },
  methods: {
    //
    delete (params) {
      console.log(params)
    },
    changeSwitch (params) {
      this.dataSource[params.index].status = params.row.status === 0 ? 1 : 0
    }
  }
}
</script>
<style lang="less">
//
</style>
