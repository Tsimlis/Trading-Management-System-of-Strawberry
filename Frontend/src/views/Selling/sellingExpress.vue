<template>
    <Layout>
        <div  class="form-group">
            <router-link class="btn btn-menu" :to="{ name:'selling-list' }">เพิ่มสินค้า</router-link>
            <router-link class="btn btn-menu" :to="{ name:'selling-express' }">เช็กการจัดส่ง</router-link>
        </div>

        <!-- ตารางรายชื่อ -->
        <div class="card mb-3">
            <div class="card-body">
                <header class="mb-4">
                  <h5><i class="fa fa-list-alt"></i> ทำรายการจัดส่ง</h5>
                </header>

                <div class="table-responsive">
                  <table class="table text-center text-nowrap">
                    <thead>
                        <tr >
                          <th>รายการ</th>
                          <th>ชื่อ</th>
                          <th>ใบเสร็จ</th>
                          <th>วัน-เวลาส่ง</th>
                          <th>วัน-เวลารับ</th>
                          <th>สถานะ</th>
                          <th></th>
                        </tr>
                    </thead>
                    <tbody> 
                      <tr v-for="(item, index) in show" :key="item.or_id">
                        <td >
                          <tr v-for="(child, index) in JSON.parse(item.or_list)" :key="item[index]"> 
                            <td class="text-left w-100" style="border-top: 0; ">
                              
                              <div v-show="JSON.parse(child).look">
                                <tr><b>{{index + 1}}.</b> สตรอว์เบอร์รี {{JSON.parse(child).look}} </tr>
                                <tr>ราคา {{JSON.parse(child).price}} จำนวน x{{JSON.parse(child).multiply}}</tr>
                                <tr>วันทำรายการ </tr>
                                <tr>{{item.or_created | formatDate}}</tr>
                              </div>

                              <div v-show="JSON.parse(child).xxl">
                                <b>{{index + 1}}.</b> ผลผลิตราคาส่ง
                                <tr v-show="Object(JSON.parse(child).xxl).weigth">
                                  ไซซ์ยักษ์ XXL : {{Object(JSON.parse(child).xxl).weigth}} * {{Object(JSON.parse(child).xxl).price}} บาท
                                </tr>
                                <tr v-show="Object(JSON.parse(child).xl).weigth">
                                  ไซซ์ยักษ์ XL : {{Object(JSON.parse(child).xl).weigth}} * {{Object(JSON.parse(child).xl).price}} บาท
                                </tr>
                                <tr v-show="Object(JSON.parse(child).l).weigth">
                                  ไซซ์ยักษ์ L : {{Object(JSON.parse(child).l).weigth}} * {{Object(JSON.parse(child).l).price}} บาท
                                </tr>
                                <tr v-show="Object(JSON.parse(child).m).weigth">
                                  ไซซ์ยักษ์ M : {{Object(JSON.parse(child).m).weigth}} * {{Object(JSON.parse(child).m).price}} บาท
                                </tr>
                                <tr v-show="Object(JSON.parse(child).s).weigth">
                                  ไซซ์ยักษ์ S : {{Object(JSON.parse(child).s).weigth}} * {{Object(JSON.parse(child).s).price}} บาท
                                </tr>
                                <tr v-show="Object(JSON.parse(child).mix).weigth">
                                  ไซซ์คละ : {{Object(JSON.parse(child).mix).weigth}} * {{Object(JSON.parse(child).mix).price}} บาท
                                </tr>
                                <tr v-show="Object(JSON.parse(child).drying).weigth">
                                  อบแห้ง : {{Object(JSON.parse(child).drying).weigth}} * {{Object(JSON.parse(child).drying).price}} บาท
                                </tr>
                                <tr v-show="Object(JSON.parse(child).juice).weigth">
                                  น้ำผลไม้ : {{Object(JSON.parse(child).juice).weigth}} * {{Object(JSON.parse(child).juice).price}} บาท
                                </tr>
                                <tr>วันทำรายการ {{item.or_created | formatDate}}</tr>
                              </div>

                              <tr><b>จำนวนเงิน {{item.or_pay}} บาท</b></tr>
                            </td>
                          </tr>
                        </td>
                        <td>{{ item.or_customer_name}}</td>
                        <td>
                          <div class="img-container pointer" @click="onImage(item.or_imagePay)">
                            <img :alt="item.or_id" :src="`/api/uploads/${item.or_imagePay}`">
                          </div>
                        </td>
                        <td>{{ item.or_send | formatDate}}</td>
                        <td>{{ item.or_receive | formatDate}}</td>
                        <td >
                          <div class="col " v-if="item.or_status == 'order'" >
                            <input type="text" class="form-control mb-1 w-100" placeholder="เลขพัสดุ/เบอร์รถด่วน" v-model="tracking[index]" >
                            <select class="form-group w-100" v-model="courierKey[index]" >
                              <option :value="item" v-for="item in courier" :key="item" >{{item}}</option>
                            </select>
                            <div>
                              <button class="btn btn-sm btn-info" @click="onUpdateStatus('send', item, index)"  >
                                <i class="fa fa-check"></i> แจ้งเลขพัสดุ
                              </button>
                            
                              <button class="btn btn-sm btn-danger ml-2" @click="onUpdateStatus('failed', item, index)"  >
                                <i class="fa fa-times-circle"></i> ล้มเหลว
                              </button>
                            </div>
                            
                          </div>

                          <div class="" v-if="item.or_status == 'failed'" >
                            <div v-if="!item.or_imageRepay">
                              <button class="btn btn-sm btn-info" @click="onUpdateStatus('order', item, index)" >
                                <i class="fa fa-repeat"></i> ส่งใหม่
                              </button><br>

                              <button class="btn btn-sm btn-warning mt-2" @click="onRepay(item)" >
                                <i class="fa fa-money"></i> ชำระคืน
                              </button>
                            </div>

                            <div v-if="item.or_imageRepay" >
                              <div class="text-info"><i class="fa fa-money"></i>  ชำระคืนแล้ว</div>
                              <div class="img-container pointer" @click="onImage(item.or_imageRepay)">
                                <img :alt="item.or_id" :src="`/api/uploads/${item.or_imageRepay}`">
                              </div>
                            </div>
                            
                          </div>

                          <div class="text-info " v-if="item.or_status == 'send'" >
                            <i class="fa fa-check-circle"></i> อยู่กับขนส่ง
                          </div>
                          <div class="text-success " v-if="item.or_status == 'success'" >
                            <i class="fa fa-motorcycle"></i> รับพัสดุแล้ว
                          </div>

                          <div class="text-danger " v-if="item.or_status == 'cancer'" >
                            <i class="fa fa-times-circle"></i> ยกเลิกแล้ว<br>
                            <button class="btn btn-sm btn-warning mt-2" @click="onRepay(item)" >
                              <i class="fa fa-money"></i> ชำระคืน
                            </button>
                          </div>
                            
                        </td>
                        <td class="text-center">
                            <i @click="onChat(item)" class=" fa fa-comments text-success pointer"></i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div> 
                <Pagination :data="order" :page="page" @onPage="onPage($event)" />
            </div>
        </div>
    
    <Chat :message="chatItem" @onClose="chatItem = null" />
    <QrCode :code="codeItem" @onClose="codeItem = null"/>
    <Img :img="imageItem" @onClose="imageItem = null" />
    </Layout>
</template>

<script>
import Pagination from '@/components/Pagination'
import Layout from '@/components/Layout'
import QrCode from './sellingQR.vue'
import Chat from './sellingChat.vue'
// import Img from './sellingImage.vue'
import Img from '@/components/ImageView'
import {mapState} from 'vuex'
import axios from 'axios'

export default {
    data(){
        return{
            order: {},
            show: {},
            page: 1,
            codeItem: null,
            chatItem: null,
            imageItem: null,
            tracking: [],
            courierKey: [],
            courier: [
              "รถด่วน",
              "kerry-express",
              "shopee-express",
              "flash-express",
              "scg-express",
              "jt-express",
              "best-express",
              "speed-d",
              "ninja-van",
              "nim-express",
              "inter-express",
              "tnt-express",
              "shippop", 
              "business-idea-transport", 
              "dhl-ecommerce",
              "teleport"
            ],
            status: ""
        }
    },
    components:{
        Pagination,
        Layout,
        QrCode,
        Chat,
        Img
    },
    computed:{
    ...mapState({ userId: state => state.user })
    },
    watch: {
        order(value){
            this.$set(this.order, 'limit', 5);  // จำนวนที่แสดงใน 1 หน้า
            this.$set(this.order, 'rows', value.length);

            this.showPage(); // ฟังกชันแบ่งหน้า เปลี่ยนหน้า   
        },
        //  การแบ่งหน้า
        page(num){
            this.showPage();
        },
    },
    mounted(){
      // ดึงรายการสั่งซื้อผลผลิตของร้าน
      this.getPackage(this.$route.query.status);
      setInterval(() => { this.getPackage( this.$route.query.status ) }, 5000)

    },
    methods: {
        onPage(page){
            this.page = page;
        },
        onSearch(word){
            this.search = word;
            //  this.$store.dispatch("set_booking_manage", { page: 1, ...this.search });
        },
        onChat(item){
          this.chatItem = item;
        },
        onImage(item){
          this.imageItem = item
        },
        // เปลี่ยนสถานะการซื้อ
        onUpdateStatus(status, item, index){
          const track = {}
          if(status == 'send') {
            if(this.tracking[index] == null) return this.alertify.warning('ใส่เลขพัสดุ');
            if(this.courierKey[index] == null) return this.alertify.warning('เลือกขนส่ง');
            //จัด data เข้า api
            Object.assign(track, {tracking: this.tracking[index], courier: this.courierKey[index], status: status})
          }  
          Object.assign(track, {status: status})

          // บันทึกการเปลี่ยนสถานะและการบันทึกเลขพัสดุติดตาม
          // this.alertify.confirm("คุณต้องการทำรายการต่อหรือไม่", () => {
              axios.put(`/api/selling/orderStatus/${item.or_id}`, track).then(res => {
                window.location.reload();
              }).catch(err => this.alertify.error(err.response.data.message))
          // }).setHeader('แจ้งเตือน')
        },
        onRepay(item){
            this.alertify.confirm("คุณต้องการชำระเงินคืนใช่หรือไม่", () => {
                this.codeItem = item
            })
        },
        getPackage(value){
          axios.post(`/api/selling/storeOrder/${this.userId.u_id}`, value)
            .then(res => this.order = res.data ).catch(error => this.alertify.error(error.response.data.message))
        },
        showPage(){
          const end = this.page * this.order.limit
          const start = end - this.order.limit
          this.show = this.order.slice(start, end)
        },
        status(s) {
          this.$router.push( { query: { status: s } } )
        }
    },
    
}
</script>

<style  scoped>
.img-container {
  border: 0;
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
.btn.router-link-exact-active {
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