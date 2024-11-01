<template>
    <Layout>
        <div  class="form-group">
            <router-link class="btn btn-menu" :to="{ name:'buy-list' }">รายการรับซื้อ</router-link>
            <router-link class="btn btn-menu" :to="{ name:'buy-farmer' }">เกษตรกร</router-link>
        </div>

        <!-- ตารางราคา -->
        <div class="card mb-3" style="background-color: darkcyan; border-color: #17A2B8;">
            <div class="card-body" >
              <header class="row">
                <div class="col-sm-9"  style="color:blanchedalmond;"><h4><i class="fa fa-money"></i> ราคารับซื้อวันนี้ &nbsp;&nbsp;&nbsp;&nbsp;{{date }}</h4></div>
                <div class="col-sm-3 ">
                    <div class="btn btn-warning float-right" @click="onPresent(price)">ปรับราคารับซื้อ</div>
                </div>
              </header>
              <div class="table-responsive">
                  <table class="table text-center"  style="border-top: hidden;">
                    <thead style="border-bottom: hidden;">
                        <tr>
                            <th style="color:gold;">XXL</th>
                            <th style="color:gold;">XL</th>
                            <th style="color:gold;">L</th>
                            <th style="color:gold;">M</th>
                            <th style="color:gold;">S</th>
                        </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="color:blanchedalmond;"><h5>{{price.b_price_xxl}}</h5></td>
                        <td style="color:blanchedalmond;"><h5>{{price.b_price_xl}}</h5></td>
                        <td style="color:blanchedalmond;"><h5>{{price.b_price_l}}</h5></td>
                        <td style="color:blanchedalmond;"><h5>{{price.b_price_m}}</h5></td>
                        <td style="color:blanchedalmond;"><h5>{{price.b_price_s}}</h5></td>
                      </tr>
                    </tbody>
                  </table>
              </div>
            </div>
        </div>    

        <!-- ตารางรายชื่อ -->
        <div class="card mb-3">
            <div class="card-body">
                <header class="mb-4">
                  <h5><i class="fa fa-list-alt"></i> รายการอนุมัติรับซื้อ</h5>
                </header>

                <div class="table-responsive text-nowrap">
                  <table class="table text-center">
                    <thead>
                        <tr>
                            <th>ชื่อเกษตรกร</th>
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
                      <!-- ใส่ store.result -->
                        <tr v-for="item in farmer" :key="item.f_id" :class="getStatus(item)" v-show="item.f_order != 'not'" > 
                            <td>{{ item.f_name }}</td>
                            <td>{{ item.f_created | formatDate}}</td>
                            <td>{{ item.f_weigth_xxl}}</td>
                            <td>{{ item.f_weigth_xl}}</td>
                            <td>{{ item.f_weigth_l}}</td>
                            <td>{{ item.f_weigth_m}}</td>
                            <td>{{ item.f_weigth_s}}</td>
                            <td class="btns no-wrap">
                              <div v-if="item.f_order == 'pending'" >
                                <i @click.once="onUpdateStatus('ยืนยันการซื้อ', 'allowed', item)" class="pointer fa fa-check-square-o text-info mr-3"></i>
                                <!-- <button @click="onUpdateStatus('not allowed', item)" class="btn btn-sm btn-danger mr-2"  >
                                  <i class="fa fa-times-circle"></i> ไม่อนุม้ติ
                                </button> -->

                                
                                <i @click.once="onUpdateStatus('ปฏิเสธการซื้อ', 'not allowed', item)" class="pointer fa fa-window-close text-danger"></i>
                                <!-- <button @click="onUpdateStatus('allowed', item)" class="btn btn-sm btn-warning"  >
                                  <i class="fa fa-check-circle"></i> อนุมัติ
                                </button> -->
                              </div>

                              <div v-if="item.f_order == 'allowed'" >
                                <i class="fa fa-check-circle text-success"></i> อนุมัติซื้อแล้ว
                              </div>

                              <div v-if="item.f_order == 'not allowed'" >
                                <i class="fa fa-times-circle text-danger"></i> ไม่อนุม้ติซื้อ
                              </div>

                              <div v-if="item.f_order == 'success'" >
                                <i class="fa fa-check text-success"></i> ซื้อขายสำเร็จ
                              </div>
                               
                            </td>
                            <td><i class="fa fa-comments text-success pointer" @click="onChat(item)"></i></td>
                        </tr>
                    </tbody>
                  </table>
                </div> 
                <Pagination :data="farmer" :page="page" @onPage="onPage($event)" />
            </div>
        </div>

        <BuyChat :message="chatItem" @onClose="chatItem = null" />
        <BuyPresent :present="presentItem" @onClose="presentItem = null " />
    </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { mapState } from 'vuex'
import BuyPresent from "./buyPresentDialog.vue"
import BuyChat from "./buyChat.vue"
import axios from 'axios'

export default {
  data() {
    return {
      price: {},
      search: {},
      page: 1,
      search_types: [
        {name: "ชื่อ", value: "f_name"},
      ],
      presentItem: null,
      date: "",
      time: "",
      farmer: {},
      chatItem: null
    };
  },
  components: {
    Layout,
    Pagination,
    Search,
    BuyPresent,
    BuyChat
  },
  watch:{
    
  },
  computed:{
    ...mapState({
        userId: state => state.user
    })
  },
  mounted() {
    // วันเวลาแบบเรียลไทม์
    setInterval(this.showClockRealTime, 1000);

    // แสดงราคาปัจจุบัน
    axios.get(`/api/buying/${this.userId.u_id}`).then(res => this.price = res.data ).catch(error => {
      if(error.response.data.message == 'Not found item.'){
        this.alertify.warning('กดปุ่ม ปรับราคา เพื่อเสนอราคารับซื้อ')
        return
      } 
      this.alertify.error(error.response.data.message)
    })

    // แสดงตารางของเกษตรกร
    axios.get(`/api/buying/weigth/${this.userId.u_id}`).then(res => this.farmer = res.data ).catch(error => {
      if(error.response.data.message == 'Not found item.'){
        this.alertify.warning('ยังไม่มีรายการเข้า')
        return
      } 
      this.alertify.error(error.response.data.message)
    })
  },
  methods: {
    onUpdateStatus(word, status, item){
      this.alertify.confirm("คุณต้องการ"+word+"ใช่หรือไม่", () => {
        axios.put(`/api/buying/${item.f_id}`, [status]).then(response => {
          if(word == 'ยืนยันการซื้อ') this.alertify.success('ยืนยันการซื้อ');
          else this.alertify.error('ปฏิเสธการซื้อ')
          setTimeout(() => {window.location.reload()}, 3000)
        }).catch(err => this.alertify.error(err.response.data.message))
      }).setHeader('แจ้งเตือน');
    },
    // การสร้างสีให้ด้วยการเช็ค status
    getStatus(item){
        const status = {}
        status[item.bk_status] = true
        return status
    },
    onPage(page){
        this.page = page;
    },
    onSearch(word){
        this.search = word;
        //  this.$store.dispatch("set_booking_historys", { page: 1, ...this.search });
    },
    onPresent(){
        this.presentItem = this.userId
    },
    onChat(item){
        this.chatItem = item
    },
    showClockRealTime() {
        var d = new Date();
        this.date = d.toLocaleDateString()
        this.time = d.toLocaleTimeString()
    }
  }
};
</script>

<style  scoped>
/* กำหนดขนาดความสูงของตาราง แล้วเลื่อนขึ้น-ลง */
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
.badge{
    width: 100px;
    border-radius: 0;
    font-weight: 400;
}
.not.allowed td{
    color: #CD3545;
}
.allowed td{
    color: #28A745;
}


@media (max-width: 575.98px) { 
  .btn-booking .btn {
        width: 100%;
    }
    .btn {
    margin-bottom: 10px;
    width: 100%;
  }

}
</style>