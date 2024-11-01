<template>
    <Layout>
        <Search :types="search_type" @onSearch="onSearch($event)" />
        <div class="form-group">
            <router-link class="btn btn-menu" :to="{ name: 'farmer-present'}">เสนอขาย</router-link>
            <router-link class="btn btn-menu" :to="{ name:'farmer-store' }">ร้านรับซื้อ</router-link>
        </div>


        <div class="form-group">
            <div class="card mb-3" v-for="item in show" :key="item.b_id" >
                <div class="row align-items-center">
                    <div class="col-sm-4">
                        <img v-show="item.b_image != null" :src="`/api/uploads/${item.b_image}`" :alt="item.b_name" class="img-booking" >
                        <img v-show="item.b_image == null" :src="'/img/buy.png'" :alt="item.b_name" class="img-booking" >
                    </div>
                    <div class="col-sm-8">
                        <div class="card-body">
                            <button class="float-right pointer" @click="onChat(item)"><i class="fa fa-comments text-success"></i></button>
                            <div>ชื่อร้าน  : {{item.b_name}}</div>
                            <div>วันที่ลงราคา : {{item.b_updated | formatDate}}</div>
                            <div>ราคารับซื้อ XXL : {{item.b_price_xxl}}, XL : {{item.b_price_xl}},... </div>
                            <div>* {{item.b_detail}}</div>
                            <div class="text-success" v-if="match.f_buying_id == item.b_user_id && match.f_order == 'pending' " >สถานะ : รออนุมัติ</div>
                            <div class="row btn-booking" v-show="(match.f_buying_id != item.b_user_id && match.f_order != 'pending') 
                                                            || match.f_order == 'pending' ||  match.f_order == 'not'" >
                                <!-- <button @click="onDelete(item)" class="btn btn-success" v-if="match.f_buying_id == item.b_user_id && match.f_order == 'pending'">
                                    <i class="fa fa-comments"></i> แจ้งขายแล้ว
                                </button> -->

                                <button @click="onDialog(item)" class="btn btn-warning" >
                                        <!-- :disabled="match.f_buying_id != item.b_user_id && match.f_order == 'pending' " >   -->
                                        <!--  เมื่อเสนอขายแล้วจะไม่สามารถทำรายการร้านอื่นได้ นำตัวที่บันทึกล่าสุดมาจับคู่ไม่ตรงให้ปิด  -->
                                    <i class="fa fa-money"></i> เสนอขายผลผลิต
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

        <Pagination :data="buyStore" :page="page" @onPage="onPage($event)" />
        <Message :message="chatItem" @onClose="chatItem = null" />
        <StoreDialog :store="storeItem" @onClose="storeItem = null" />
        <StoreDetailDialog :store="storeDetailItem" @onClose="storeDetailItem = null" @onDialog="storeItem = $event" />
    </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import { mapState } from "vuex"
import axios from 'axios'
import Pagination from "@/components/Pagination";
import StoreDialog from './storeDialog.vue'
import StoreDetailDialog from './storeDetailDialog.vue'
import Message from "./farmerChat.vue"

export default {
    components:{
        Layout,
        Search,
        Pagination,
        StoreDialog,
        StoreDetailDialog,
        Message
    },
    data(){
        return {
            form: {
                status: ""
            },
            show: {},
            page: 0,
            search_type: [
                {name: "ชื่อร้าน", value: "n_name"},
                {name: "ราคา", value: "n_price"},
                {name: "รายละเอียด", value: "n_detail"}
            ],
            search: "",
            storeItem: null,
            storeDetailItem: null,
            chatItem: null,
            buyStore: {},
            match: {}
        }
    },
    computed: {
        ...mapState({ userId: state => state.user, send: state => state.send })
    },
    watch: {
        buyStore(value){
            Object.assign(this.buyStore, {limit: 5,rows: value.length})
            this.page = 1 //เมื่อข้อมุูลเข้าให้เป็นหน้าที่ 1
        },
        //  การแบ่งหน้า
        page(num){
            const end = num * this.buyStore.limit
            const start = end - this.buyStore.limit
            this.show = this.buyStore.slice(start, end)
        },
        // chatItem(u){
        //     console.log(u)
        // } 
    },
    mounted() {
        // แสดงข้อมูลราคาของร้านรับซื้อ
        axios.get(`/api/farmer`).then(res => {
            this.buyStore = res.data
            }).catch(error => this.alertify.error(error.response.data.message))
        
        //ดึงข้อมูลเมื่อทำรายการเสนอขายแล้ว 1 รายการ backend จะตั้งเวลาแสดงค้าง 3 ชั่วโมง หรือเวลาทดสอบ
        axios.get(`/api/farmer/${this.userId.u_id}`).then(res => {
            this.match = res.data
        }).catch(err => this.alertify.error(err.response.data.message))
    },
    methods: {
        onPage(page){
            this.page = page;
        },
        // onSearch(word){
        //     this.search = word;
        //     // this.$store.dispatch("set_news", { page: 1, ...this.search });
        // },
        onDialog(item){
            if(this.match.f_buying_id == item.b_user_id && this.match.f_order == 'pending' ) {
                this.alertify.warning('กำลังดำเนินการ');
                window.location.reload()
                return false
            }
            this.storeItem = item
        },
        onDetailDialog(item){
            this.storeDetailItem = item
        },
        onDelete(item){
            this.alertify.confirm('คุณต้องการลบใช่หรือไม่', () => {
            // axios.delete(`/api/booking/manage/${item.bk_id}`).then(response => {
            // this.$store.dispatch('set_booking_manage');
            }).catch(err => this.alertify.error(err.response.data.message))
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
.btn.router-link-exact-active {
  background-color: #17a2b8;
}
.img-booking{
    max-width: 75%;
    /* width: 500px; */
    /* max-height: 150px; */
}
.card{
    color: #525862;
    border-right: solid 5px #17a2b8;
    /* max-width: 100%; */
}
.card-body{
    margin-left: 5px;
}
.btn-booking .btn{
    margin-right: 10px;
    margin-top: 10px;
    width: 150px;
}


@media (max-width: 575.98px) { 
  .btn-booking .btn {
        width: 100%;
    }
    .btn-menu {
        width: 100%;
        margin-bottom: 10px;
    }
    /* .card-body{
        padding-left: 0px;
    } */

}
</style>