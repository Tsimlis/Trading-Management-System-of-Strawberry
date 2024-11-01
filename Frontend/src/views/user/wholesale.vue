<template>
    <Layout>
        
        <div class="form-group">
            <!-- <Search :types="search_type" @onSearch="onSearch($event)" /> -->

            <div class="card mb-3 "  v-for="item in show" :key="item.w_id">
                <div class="row align-items-center">
                    <div class="col-sm-4">
                        <img v-show="item.w_image != ''" :src="`/api/uploads/${item.w_image}` || '/img/store.png'" :alt="item.w_id" class="img-flie" >
                        <img v-show="item.w_image == ''" :src="'/img/store.png'" :alt="item.w_id" class="img-flie" >
                    </div>
                    <div class="col-sm-8">
                        <div class="card-body">
                            <button class="float-right pointer" @click="onChat(item)"><i class="fa fa-comments text-success"></i></button>
                            <div>ชื่อร้าน  : {{item.w_sale_name}}</div>
                            <div>วันที่ลงสินค้า : {{item.w_created}}</div>
                            <div>ราคา XXL: {{item.w_price_xxl}} | XL: {{item.w_price_xl}} | ...</div>
                            <div class="btn-submit">
                                <button @click="onDialog(item)" class="btn btn-info" >
                                    <i class="fa fa-cart-plus"></i> สั่งสตรอว์เบอร์รี
                                </button>
                                <button @click="onDetailDialog(item)" class="btn btn-secondary">
                                    <i class="fa fa-info"></i> รายละเอียด
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
              

        <Pagination :data="whole" :page="page" @onPage="onPage($event)" />
        <Chat :message="chatItem" @onClose="chatItem = null" />
        <WholeDialog :store="wholeItem" @onClose="wholeItem = null" />
        <WholeDetailDialog :store="wholeDetailItem" @onClose="wholeDetailItem = null" @onDialog="wholeItem = $event" />
    </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import { mapState } from "vuex"
import axios from "axios"
import Pagination from "@/components/Pagination";
import WholeDialog from './wholeDialog.vue'
import WholeDetailDialog from './wholeDetailDialog.vue'
import Chat from "./customerChat.vue"

export default {
    components:{
        Layout,
        Search,
        Pagination,
        WholeDialog,
        WholeDetailDialog,
        Chat
    },
    data(){
        return {
            form: {
                status: ''
            },
            page: 0,
            search_type: [
                // {name: "ชื่อหัวข้อ", value: "n_name"},
                // {name: "ราคา", value: "n_price"},
                // {name: "รายละเอียด", value: "n_detail"}
            ],
            search: "",
            wholeItem: null,
            wholeDetailItem: null,
            chatItem: null,
            whole: {},
            show: {}
        }
    },
    watch: {
        whole(value){
            this.$set(this.whole, 'limit', 5);  // จำนวนที่แสดงใน 1 หน้า
            this.$set(this.whole, 'rows', value.length);
            this.page = 1 //เมื่อข้อมุูลเข้าให้เป็นหน้าที่ 1
        },
        //  การแบ่งหน้า
        page(num){
            const end = num * this.whole.limit
            const start = end - this.whole.limit
            this.show = this.whole.slice(start, end)
        },    
    },
    mounted() {
        // ดึงข้อมูลราคาขายส่ง
        axios.get(`/api/customer/priceStore`).then(res => this.whole = res.data ).catch(error => this.alertify.error(error.response.data.message));   
    },
    methods: {
        onPage(page){
            this.page = page;
        },
        onSearch(word){
            this.search = word;
        },
        onDialog(item){  //เมื่อทำการจอง จะแสดงข้อมูลหน้า Dialog
            this.wholeItem = item
        },
        onDetailDialog(item){
            this.wholeDetailItem = item
        },
        onDelete(item){
            this.alertify.confirm('คุณต้องการลบใช่หรือไม่', () => {
                console.log('delete user retail')
            // axios.delete(`/api/booking/manage/${item.bk_id}`).then().catch(err => this.alertify.error(err.response.data.message))
            })
        },
        onChat(item){
            this.chatItem = item
        }
    }
}
</script>


<style  scoped>
/* .form-group{
    float: left;
    width: inherit;
} */
.btn-menu {
  color: #ffffff;
  background-color: #ced4da;
  margin-right: 7px;
  min-width: 130px;
}
.btn.router-link-active {
  background-color: #17a2b8;
}
.img-flie{
    max-width: 75%;
    /* width: 500px; */
    /* max-height: 150px; */
}
.card{
    color: #525862;
    border-right: solid 5px #17a2b8;
    max-width: 100%;
    min-width: 500px;
}
.card-body{
    margin-left: 5px;
}
.btn-submit .btn{
    margin-right: 10px;
    margin-top: 10px;
    width: 150px;
}


@media (max-width: 575.98px) { 
  .btn-submit .btn {
        width: 100%;
    }
    .btn-menu {
        width: 100%;
        margin-bottom: 10px;
    }

}
</style>