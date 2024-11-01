<template>
    <Layout>
        <div  class="form-group">
            <router-link class="btn btn-menu" :to="{ name:'farmer-present' }">เสนอขาย</router-link>
            <router-link class="btn btn-menu" :to="{ name:'farmer-store' }">ร้านรับซื้อ</router-link>
        </div>

        <div class="card mb-3">
            <div class="card-body">
                <header class="row mb-4">
                    <div class="col-sm-9"><h5><i class="fa fa-list-alt"></i> รายการที่ร้านรับซื้อ</h5></div>
                    <div class="col-sm-3 ">
                        <div class="btn btn-info present" @click="onPresent()">เสนอราคา</div>
                    </div>
                </header>

                <div class="table-responsive text-nowrap">
                  <table class="table content">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>ชื่อร้าน</th>
                            <th>วันทำรายการ</th>
                            <th>XXL (กก.)</th>
                            <th>XL (กก.)</th>
                            <th>L (กก.)</th>
                            <th>M (กก.)</th>
                            <th>S (กก.)</th>
                            <th>สถานะ</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item,index in show" :key="item.f_id" :class="getStatus(item)" v-show="item.f_order != 'not'"> 
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.f_buying_name }}</td>
                            <td>{{ item.f_updated | formatDate}}</td>
                            <td class="text-center">{{ item.f_weigth_xxl}}</td>
                            <td class="text-center">{{ item.f_weigth_xl}}</td>
                            <td class="text-center">{{ item.f_weigth_l}}</td>
                            <td class="text-center">{{ item.f_weigth_m}}</td>
                            <td class="text-center">{{ item.f_weigth_s}}</td>
                            <td class="text-left">
                                <label class="badge badge-warning" v-if=" item.f_order == 'pending' " ><i class="fa fa-hourglass"></i> รอดำเนินการ</label>
                                <label class="badge badge-success" v-if=" item.f_order == 'allowed' " ><i class="fa fa-check-square-o"></i> อนุมัติรับซื้อ</label>
                                <label class="badge badge-danger" v-if=" item.f_order == 'not allowed' " ><i class="fa fa-window-close"></i> ไม่อนุม้ติ</label>
                            </td>
                            <td><i class="fa fa-comments pointer" @click="onChat(item)"></i></td>
                        </tr>
                    </tbody>
                  </table>
                </div>
                <Pagination :data="show" :page="page" @onPage="onPage($event)" />
            </div>
        </div>

        <Message :message="chatItem" @onClose="chatItem = null" />
        <StorePresentDialog :present="presentItem" @onClose="presentItem = null" />
    </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { mapState } from 'vuex'
import axios from 'axios'
import StorePresentDialog from './storePresentDialog.vue'
import Message from "./farmerChat.vue"

export default {
  data() {
    return {
      search: {},
      page: 1,
      search_types: [
      //   {name: "ชื่อ", value: "b_name"},
      ],
      presentItem: null,
      chatItem: null,
      show: {}
    };
  },
  components: {
    Layout,
    Pagination,
    Search,
    StorePresentDialog,
    Message
  },
  computed:{
    ...mapState({ userId: state => state.user })
  },
  mounted() {
    // ดึงประวัติการขายของเกษตรกรทั้งหมด
    axios.get(`/api/farmer/all/${this.userId.u_id}`).then(res => this.show = res.data ).catch(err => this.alertify.error(err.response.data.message))
  },
  methods: {
    // การสร้างสีให้ด้วยการเช็ค status
    getStatus(item){
        const status = {}
        status[item.f_order] = true
        return status;
    },
    onPage(page){
        this.page = page;
    },
    onSearch(word){
        this.search = word;
        //  this.$store.dispatch("set_booking_manage", { page: 1, ...this.search });
    },
    onPresent(item){
      this.presentItem = this.userId
    },
    onChat(item){
      this.chatItem = item
    }
  }
};
</script>

<style  scoped>
.table-responsive {
  max-height: 400px; /* กำหนดความสูงของตารางเพื่อให้สามารถเลื่อนขึ้นลงได้ */
  overflow-y: auto;
}
.table th:nth-child(n+11), .table td:nth-child(n+11) {
  display: none; /* ซ่อนคอลัมน์ที่เกินจำนวนที่ต้องการ */
}


.present{
  float: right;
}
.btn-menu {
  color: #ffffff;
  background-color: #ced4da;
  margin-right: 7px;
  min-width: 130px;
}
.btn.router-link-active {
  background-color: #17a2b8;
}
.btns{
  width: 200px;
  text-align: right;
}
.btns .btn {
  width: 82px;
}
tr.allowed td {
  color: #28a745;
}
tr.not.allowed td {
  color: #dc2545;
}


@media (max-width: 575.98px) { 
  button {
    width: 100%;
  }

}
</style>

