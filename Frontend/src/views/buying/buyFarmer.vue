<template>
    <Layout>
        <Search :types="search_type" @onSearch="onSearch($event)" />
        <div class="form-group">
            <router-link class="btn btn-menu" :to="{ name: 'buy-list'}">รายการรับซื้อ</router-link>
            <router-link class="btn btn-menu" :to="{ name: 'buy-farmer' }">เกษตรกร</router-link>
        </div>
        
        <div class="form-group" v-for="item in show" :key="item.fp_id">
            <div class="card mb-3" >
                <div class="row align-items-center">
                    <div class="col-sm-4">
                        <img :src="`/api/uploads/${item.fp_image}`" :alt="item.fp_id" class="img-show" >
                    </div>
                    <div class="col-sm-8">
                        <div class="card-body">
                            <div>ชื่อเกษตรกร : {{item.fp_name}}</div>
                            <div>เสนอขายวันที่ : {{item.fp_created | formatDate}}</div>
                            <div>* : {{item.fp_detail}}</div>
                            <!-- <div v-show="form.status != '' ">สถานะ : รออนุมัติ</div> -->
                            <div class="row btn-table">
                                <button @click="onChat(item)" class="btn btn-info" v-if="item.fp_buy_id == userId.u_id">
                                    <i class="fa fa-comments"></i> แชท
                                </button>
                                <button @click="onDetailDialog(item)" class="btn btn-secondary" v-if="item.fp_buy_id != userId.u_id " :disabled="item.fp_exp == 'success'">
                                    <i class="fa fa-info"></i> รายละเอียด
                                </button>
                                <div v-if="item.fp_exp != 'success'">
                                    <button @click="onMoney(item)" class="btn btn-warning" v-if="item.fp_buy_id == userId.u_id ">
                                        <i class="fa fa-money"></i> ช่องทางชำระ
                                    </button>
                                    
                                </div>
                                <div class="btn" v-if="item.fp_exp == 'success'">
                                    <i class="fa fa-check text-info" ></i> ชำระแล้ว &nbsp;&nbsp;&nbsp; {{item.fp_buy_name}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>        

        <Pagination :data="offer" :page="page" @onPage="onPage($event)" />
        <BuyChat :message="messageItem" @onClose="messageItem = null" />
        <BuyDetailDialog :buying="buyDetailItem" @onClose="buyDetailItem = null" @onDialog="messageItem = $event" />
        <MoneyDialog :money="moneyItem" @onClose="moneyItem = null"  />
    </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import { mapState } from "vuex"
import axios from 'axios'
import Pagination from "@/components/Pagination";
import BuyChat from "./buyChat.vue"
import BuyDetailDialog from "./buyDetailDialog.vue"
import MoneyDialog from "./buyMoneyDialog.vue"

export default {
    components:{
        Layout,
        Search,
        Pagination,
        BuyChat,
        BuyDetailDialog,
        MoneyDialog
    },
    data(){
        return {
            show: {},
            page: 0,
            search_type: [
                {name: "ชื่อหัวข้อ", value: "n_name"},
                {name: "ราคา", value: "n_price"},
                {name: "รายละเอียด", value: "n_detail"}
            ],
            search: "",
            messageItem: null,
            buyDetailItem: null,
            moneyItem: null,
            offer: {}
        }
    },
    computed:{
        ...mapState({ userId: state => state.user})
    },
    watch: {
        offer(value){
            this.$set(this.offer, 'limit', 5);  // จำนวนที่แสดงใน 1 หน้า
            this.$set(this.offer, 'rows', value.length);
            this.page = 1 //เมื่อข้อมุูลเข้าให้เป็นหน้าที่ 1
        },
        //  การแบ่งหน้า
        page(num){
            const end = num * this.offer.limit
            const start = end - this.offer.limit
            this.show = this.offer.slice(start, end)
        },    
    },
    mounted() {
        axios.get('/api/buying/').then(res => this.offer = res.data ).catch(error => this.alertify.error(error.response.data.message))
    },
    methods: {
        onPage(page){
            this.page = page;
        },
        onSearch(word){
            this.search = word;
            // this.$store.dispatch("set_news", { page: 1, ...this.search });
        },
        onDelete(item){
            this.alertify.confirm('คุณต้องการลบใช่หรือไม่', () => {
                console.log('delete buy stroe')
            // axios.delete(`/api/booking/manage/${item.bk_id}`).then(response => {
            // this.$store.dispatch('set_booking_manage');
            }).catch(err => this.alertify.error(err.response.data.message))
        },
        onChat(item){
            this.messageItem = item
        },
        onDetailDialog(item){
            this.buyDetailItem = item
        },
        onMoney(item){
            this.moneyItem = item
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
.img-show{
    max-width: 75%;
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
.btn-table .btn{
    margin-right: 10px;
    margin-top: 10px;
    width: 150px;
}


@media (max-width: 575.98px) { 
  .btn-table .btn {
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