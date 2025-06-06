<template>
    <div class="eldialog">
        <el-dialog :visible.sync="visible" title="新增">
            <el-form ref="form" :rules="rules" :model="importForm">
                <el-form-item :label-width="formLabelWidth" label="项目:" prop="proj_id">
                     <el-select filterable placeholder="请选择" v-model="importForm.proj_id">
                        <el-option
                            v-for="item in projectsList"
                            :key="item.id"
                            :label="item.app_name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="媒体:" prop="media_id">
                     <el-select filterable placeholder="请选择" v-model="importForm.media_id">
                        <el-option
                            v-for="item in mediaList"
                            :key="item.id"
                            :label="item.name_cn"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="btnloading" @click="addclick(importForm)">保存</el-button>
            </div>
        </el-dialog>
        
    </div>
</template>


<script>
export default {
    props: {
        dialogFormVisible: {
            type: Boolean,
            default: false
        },
        projectsList: {
            type:Array,
            default: () => []
        },
        mediaList: {
            type:Array,
            default: () => []
        },
        btnloading:{
            type: Boolean,
            default: false
        }
    },
    computed:{
        visible:{
            get() {
                return this.dialogFormVisible
            },
            set(val){
                this.$emit('updateImportvisible',val)
            } 
        }
    },
    watch: {
        dialogFormVisible(newValue,oldValue){
            if(this.$refs.form){
                this.$refs.form.resetFields()
            }
        }
    },
    data () {
       return {
           formLabelWidth: '200px',
            importForm:{
                proj_id : '',
                media_id: ''
            },
            rules: {
            media_id: [
                { required: true, message: '请选择媒体', trigger: 'change' },
                ],
            proj_id: [
                { required: true, message: '请选择项目', trigger: 'change' }
                ]
            },
       }
    },
    methods: {
        addclick(val) {
             this.$refs.form.validate((valid) => {
                 if(valid) {
                     const formData = {
                        proj_id:this.importForm.proj_id, 
                        media_id:this.importForm.media_id
                     }
                    this.$emit('addOffline', formData)
                 }
             })
        }
    }
}
</script>


<style scoped>
   .eldialog{
        width: 100%;
        align-items: center;
        background: #fff;
        padding: 10px;
    } 
</style>