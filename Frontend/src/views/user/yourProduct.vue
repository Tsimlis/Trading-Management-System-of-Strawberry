<template>
    <Layout>

        <div class="card mb-3">
            <div class="card-body">
                <header class="mb-4">
                    <h5><i class="fa fa-shopping-basket"></i> สินค้าที่คุณจะได้รับ</h5>
                </header>

                <div class="table-responsive">
                  <table class="table text-center">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>รายการ</th>
                            <th>ราคา</th>
                            <th>สถานะ</th>
                            <th>วันที่ส่ง</th>
                            <th>วันที่รับ</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in show" :key="item.or_id" :class="getStatus(item)">
                        <td colspan="2">
                          <tr v-for="(child, index) in JSON.parse(item.or_list)" :key="item[index]"> 
                            <td class="d-none d-sm-table-cell " style=" border-top: 0; width: 40%;">
                                <div class="img-container">
                                    <img :alt="item.or_id" :src="`/api/uploads/${JSON.parse(child).image}`">
                                </div>
                            </td>
                            <td class="text-left w-100" style="border-top: 0; border-right: 1px solid #dee2e6;">
                              <div v-show="JSON.parse(child).look">
                                <tr>ชื่อร้าน {{ item.or_sale_name }}</tr>
                                <tr>ประเภท {{JSON.parse(child).look}} ราคา {{JSON.parse(child).price}}</tr>
                                <tr>จำนวน x{{JSON.parse(child).multiply}}</tr>
                                <tr>วันทำรายการ {{item.or_created | formatDate}}</tr>
                              </div>

                              <div v-show="JSON.parse(child).xxl">
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
                              </div>
                            </td>
                          </tr>
                        </td>
                        <td>{{item.or_pay}}</td>
                        <td >
                          <!-- แทบแสดง -->
                          <label class="badge badge-info" v-if=" item.or_status == 'order' " @click="onCheck()">
                              <i class="fa fa-hourglass"></i> รอการจัดส่ง
                          </label>
                          <label class="badge badge-warning" v-if=" item.or_status == 'cancer' " @click="onCheck()">
                              <i class="fa fa-close"></i> ยกเลิกแล้ว
                          </label>
                          <label class="badge badge-primary pointer" v-if=" item.or_status == 'send' " @click="onLocation(item)">
                              <i class="fa fa-check-square-o "></i> จัดส่งแล้ว
                          </label>
                          <label class="badge badge-warning" v-if=" item.or_status == 'failed' " >
                            <i class="fa fa-window-close"></i> การส่งล้มเหลว
                          </label>
                          <label class="badge badge-success" v-if=" item.or_status == 'success' " @click="onCheck()">
                              <i class="fa fa-hourglass"></i> ส่งสำเร็จ
                          </label>
                          
                          <!-- ปุ่มกด -->
                          <div v-if=" item.or_status == 'order' || item.or_status == 'failed'">
                            <button class="btn btn-warning" @click="onCancer(item)">ยกเลิก</button>
                          </div>
                          <div v-if=" item.or_status == 'success' || item.or_status == 'cancer'">
                            <button class="btn btn-danger" @click="onDelete(item)">ลบทิ้ง</button>
                          </div>
                          <div v-if=" item.or_status == 'send' ">
                            <button class="btn btn-success" @click="onLocation(item)">ติดตามพัสดุ</button>
                          </div>
                        </td>
                        <td>{{ item.or_send | formatDate}}</td>
                        <td>{{ item.or_receive | formatDate}}</td>
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

    <Message :message="chatItem" @onClose="chatItem = null"/>
    </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import Message from './customerChat.vue'
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {
      order: {},
      search: {},
      show: {},
      page: 1,
      search_types: [
        {name: "ชื่อ", value: "or_customer_name"},
      ],
      chatItem: null,
      response: [],
      trackData: {
        'trackingNo': '', 
        'courier': ''
      },
      dataTrack: {}
    };
  },
  components: {
    Layout,
    Pagination,
    Search,
    Message
  },
  computed:{
    ...mapState({ userId: state => state.user })
  },
  watch: {
      order(value){
          Object.assign( this.order, { limit: 5, rows: value.length })
          this.page = this.page
          this.Page();
      },
      //  การแบ่งหน้า
      page(num){
          this.Page();
      },    
  },
  mounted() {
    // ดึงข้อมูลรายการสินค้า
    this.apiOrder();
    setInterval(() => { this.apiOrder(); }, 5000);


    // ดึงรายชื่อบริษัทขนส่ง
    // this.getCourier();
  },
  methods: {
    // การสร้างสีให้ด้วยการเช็ค status
    getStatus(item){
        const status = {}
        status[item.or_status] = true
        return status;
    },
    onPage(page){
        this.page = page;
    },
    Page(){
      const end = this.page * this.order.limit
      const start = end - this.order.limit
      this.show = this.order.slice(start, end)
    },
    onCancer(item){
      // เปลียนสถานะคำสั่งให้เป็น cancer
      this.alertify.confirm("คุณต้องการทำรายการต่อหรือไม่", () => {
        axios.put(`/api/customer/order/${item.or_id}`).then(res => {
            window.location.reload();
          }).catch(error => this.alertify.error(error.response.data.message));
      })
    },
    onDelete(item){
      // ลบรายการคำสั่งซื้อ
      this.alertify.confirm("คุณต้องการลบรายการนี้ใช่หรือไม่", () => {
        axios.delete(`/api/customer/deleteOrder/${item.or_id}`).then(res => {
            window.location.reload();
          }).catch(error => this.alertify.error(error.response.data.message));
      })
    },
    onChat(item){
      this.chatItem = item
    },
    apiOrder(){
      // ดึงรายการสั่งซื้อผลผลิต
      axios.get(`/api/customer/order/${this.userId.u_id}`)
        .then(res => this.order = res.data ).catch(error => this.alertify.error(error.response.data.message))
    },
    // เชื่อม api ขนส่ง
    async onLocation(item) {
      this.$router.push({ name: 'location' , params: item})
      // this.trackData.trackingNo = item.or_tracking
      // this.trackData.courier = item.or_courier

      // try {
      //   const response = await axios.post('/api/tracking', this.trackData).then(res => {
      //     console.log('res.data',res.data)
      //     this.dataTrack = res.data
      //     }).catch(error => this.alertify.error(error.response.data.message))
        
      //   console.log('response', response) // รองอีกตัวแปร

      // } catch (error) { console.error('Error :', error); }
    },
    onCheck(){
      this.alertify.warning('คุณสามารถติดต่อร้านค้าเพื่อการจัดส่งที่เร็วขึ้น')
    },
    // getCourier(){
    //   const headers = {
    //       "Etrackings-Api-Key": "48723e871dcbae86ef1771ce91df293d963a3345",
    //       "Etrackings-Key-Secret": "ef454771722a9a281ebe5a88c616e07bf20756c5693cdadbc0929151e1d0b514af0c1fb0d4590d323a979662b32ef75f102e99e98bd8780166e6c8edf3e35b16b5c7b46eed52cd1178416c",
    //       "Accept-Language": "th",
    //       "Content-Type": "application/json"
    //   };
    //   const data = {}

    //   axios.get('https://api.etrackings.com/api/v3/couriers', headers).then((response) => {
    //     console.log('Courier',response.data);
    //   });
    // },
  }
};
</script>

<style  scoped>
.present{
  float: right;
}
.btn-menu {
  color: #ffffff;
  background-color: #ced4da;
  margin-right: 7px;
  min-width: 130px;
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

