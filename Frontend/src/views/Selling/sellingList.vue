<template>
    <Layout>
        <div  class="form-group">
            <router-link class="btn btn-menu" :to="{ name:'selling-list' }">เพิ่มสินค้า</router-link>
            <router-link class="btn btn-menu" :to="{ name:'selling-express' }">เช็กการจัดส่ง</router-link>
        </div>

        <div class="form-group">
            <div class="card text-center" style="background-color: darkcyan;"><h5 class="mt-2" style="color: blanchedalmond;">ชื่อร้าน {{userId.u_fullname}}</h5></div>
        </div>

        <!-- ปรับราคา -->
        <div class="card mb-3" style="background-color: papayawhip; border-color: sienna;">
            <div class="card-body">
              <header class="row">
                <div class="col-sm-9"><h5><i class="fa fa-money"></i> ราคาขายส่ง (บาท)</h5></div>
                <div class="col-sm-3 ">
                    <div class="btn btn-warning float-right" @click="onPrice()">ปรับราคา</div>
                </div>
              </header>
              <div class="table-responsive">
                  <table class="table text-center"  style="border-top: hidden;">
                    <thead style="border-bottom: hidden;">
                        <tr>
                            <th>XXL (บาท)</th>
                            <th>XL (บาท)</th>
                            <th>L (บาท)</th>
                            <th>M (บาท)</th>
                            <th>S (บาท)</th>
                            <th>คละ (บาท)</th>
                            <th>อบแห้ง</th>
                            <th>น้ำสตรอว์เบอร์รี</th>
                        </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="font-size: 30px;">{{priceWhole.w_price_xxl}}</td>
                        <td style="font-size: 30px;">{{priceWhole.w_price_xl}}</td>
                        <td style="font-size: 30px;">{{priceWhole.w_price_l}}</td>
                        <td style="font-size: 30px;">{{priceWhole.w_price_m}}</td>
                        <td style="font-size: 30px;">{{priceWhole.w_price_s}}</td>
                        <td style="font-size: 30px;">{{priceWhole.w_price_mix}}</td>
                        <td style="font-size: 30px;">{{priceWhole.w_price_drying}}</td>
                        <td style="font-size: 30px;">{{priceWhole.w_price_juice}}</td>
                      </tr>
                    </tbody>
                  </table>
              </div>
            </div>

            <div class="card-body">
              <header class="row">
                <div class="col-sm-9">
                  <h5><i class="fa fa-shopping-basket"></i> ใส่จำนวนผลผลิตที่ต้องการลงขายวันนี้ (กก.)</h5>
                  <label class="mt-1 ml-4"><b><u>น้ำหนักที่มีตอนนี้</u></b></label>
                  </div>
                <div class="col-sm-3 ">
                    <div class="btn btn-warning float-right" @click="onAmount()">เติมผลผลิต</div>
                </div>
              </header>
              <div class="table-responsive">
                  <table class="table text-center"  style="border-top: hidden;">
                    <thead style="border-bottom: hidden;">
                        <tr>
                            <th>XXL (กก.)</th>
                            <th>XL (กก.)</th>
                            <th>L (กก.)</th>
                            <th>M (กก.)</th>
                            <th>S (กก.)</th>
                            <th>คละ (กก.)</th>
                            <th>อบแห้ง (กก.)</th>
                            <th>น้ำสตรอว์เบอร์รี(ขวด)</th>
                        </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="font-size: 30px;">{{weigthWhole.sw_xxl}}</td>
                        <td style="font-size: 30px;">{{weigthWhole.sw_xl}}</td>
                        <td style="font-size: 30px;">{{weigthWhole.sw_l}}</td>
                        <td style="font-size: 30px;">{{weigthWhole.sw_m}}</td>
                        <td style="font-size: 30px;">{{weigthWhole.sw_s}}</td>
                        <td style="font-size: 30px;">{{weigthWhole.sw_mix}}</td>
                        <td style="font-size: 30px;">{{weigthWhole.sw_drying}}</td>
                        <td style="font-size: 30px;">{{weigthWhole.sw_juice}}</td>
                      </tr>
                    </tbody>
                  </table>
              </div>
            </div>
        </div>


        <!-- เพิ่มจำนวน -->
        <div class="card mb-3" style=" border-color: sienna;">

            <div class="card-body">
              <header class="row">
                <div class="col-sm-9"><h5><i class="fa fa-list"></i> รายการขายปลีก</h5></div>
                <div class="col-sm-3 ">
                    <div class="btn btn-info float-right" @click="onAdd()">เพิ่มสินค้า</div>
                </div>
              </header>
              <div class="table-responsive ">
                  <table class="table text-center"  style="border-top: hidden;">
                    <thead class="text-nowrap"  >  <!-- style="border-bottom: hidden;" -->
                        <tr>
                            <th>ประเภท/ขนาด</th>
                            <th>(กก./ขวด)</th>
                            <th>ราคา (บาท)</th>
                            <th>ค่าจัดส่ง</th>
                            <th>วันทำรายการ</th>
                            <th>วันแก้ไขล่าสุด</th>
                            <th>สถานะ</th>
                            <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in show" :key="item.r_id">
                        <td>{{item.r_look}}</td>
                        <td>{{item.r_weigth}}</td>
                        <td>{{item.r_price}}</td>
                        <td>{{item.r_free}}</td>
                        <td>{{item.r_created | formatDate}}</td>
                        <td>{{item.r_updated | formatDate}}</td>
                        <td class="text-right">
                            <label class="badge badge-success" v-if=" item.r_status == 'nexp' " ><i class="fa fa-check-square-o"></i> ลงขายแล้ว</label>
                            <label class="badge badge-danger" v-if=" item.r_status == 'exp' " ><i class="fa fa-window-close"></i> ไม่แสดง</label>
                        </td>
                        <td class="text-right no-wrap">
                            <i @click="onUpdate(item)" class="pointer fa fa-edit text-info mr-3"></i>
                            <i @click="onDelete(item)" class="pointer fa fa-trash text-danger"></i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
              </div>
            </div>

        </div>

      <Pagination :data="promote" :page="page" @onPage="onPage($event)" />
      <PriceDialog :price="priceItem" @onClose="priceItem = null" />
      <AmountDialog :amount="amountItem" @onClose="amountItem = null" />
      <RetailDialog :retail="retailItem" @noClose="retailItem = null" />
    </Layout>
</template>

<script>
import {mapState} from "vuex"
import axios from "axios"
import Layout from "@/components/Layout"
import Pagination from "@/components/Pagination";
import PriceDialog from "./sellingPriceDialog.vue"
import AmountDialog from "./sellingAmountDialog.vue"
import RetailDialog from "./sellingRetailDialog.vue"

export default {
    data(){
        return{
            priceItem: null,
            amountItem: null,
            retailItem: null,
            priceWhole: {},
            weigthWhole: {},
            promote: {},
            show: {},
            page: 0
        }
    },
    components:{
        Layout,
        PriceDialog,
        AmountDialog,
        RetailDialog,
        Pagination
    },
    computed:{
      ...mapState({ userId: state => state.user})
    },
    watch: {
        promote(value){
            this.$set(this.promote, 'limit', 5);  // จำนวนที่แสดงใน 1 หน้า
            this.$set(this.promote, 'rows', value.length);
            this.page = 1 //เมื่อข้อมุูลเข้าให้เป็นหน้าที่ 1
        },
        //  การแบ่งหน้า
        page(num){
            const end = num * this.promote.limit
            const start = end - this.promote.limit
            this.show = this.promote.slice(start, end)
        },    
    },
    mounted(){
      // แสดงข้อมูลราคาที่ประกาศไป
      axios.get(`/api/selling/priceWhole/${this.userId.u_id}`)
        .then(res => this.priceWhole = res.data).catch(error => this.alertify.error(error.response.data.message))
      // แสดงข้อมูลน้ำหนัก ขายส่ง
      axios.get(`/api/selling/weigthWhole/${this.userId.u_id}`)
        .then(res => this.weigthWhole = res.data ).catch(error => this.alertify.error(error.response.data.message))
      //  แสดงรายการสินค้าที่ลงขายปลีก
      axios.get(`/api/selling/retail/${this.userId.u_id}`)
        .then(res => this.promote = res.data ).catch(error => this.alertify.error(error.response.data.message))

    },
    methods:{
        onPrice(){
          this.priceItem = this.userId
        },
        onAmount(){
          this.amountItem = this.userId
        },
        onAdd(){
          this.retailItem = this.userId
        },
        onUpdate(item){
          this.retailItem = item.r_id
        },
        onDelete(item){
          this.alertify.confirm("คุณต้องการจะลบข้อมูลนี้จริงหรือ?", () => {
            axios.post(`/api/selling/retail/${item.r_id}`, item).then(res => {
                this.alertify.warning('ลบรายการแล้ว')
                window.location.reload()
            }).catch(error => this.alertify.error(error.response.data.messgae))
          })
        },
        onPage(page){
            this.page = page;
        },
    }
}
</script>

<style scoped>

.btn-menu {
  color: #ffffff;
  background-color: #ced4da;
  margin-right: 7px;
  min-width: 130px;
}
.btn.router-link-active {
  background-color: #17a2b8;
}
</style>