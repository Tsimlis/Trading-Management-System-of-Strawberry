<template>
    <div class="layout">
        <Navbar />
        <div class="container " style="max-width: 1800px;" > <!--  -->
            <slot name="buttons"></slot>
            <div class="row  font">

                <!-- before :left, after :right -->
                <div class="col-lg-3 pr-5" >

                    <div class="pl-0 mb-4">
                      <section class="card ">
                          <header class="card-header text-center ">
                              <h5 class="m-0 pointer" @click="notify()">แจ้งเตือนสำหรับคุณ</h5>
                          </header>
                          <!-- <body > -->
                            <div class="sidebar-link text-nowrap">
                              <router-link :to="{name: 'message'}" class="sidebar-link" > ข้อความใหม่ <span class="badge badge-warning rounded-circle">{{ admin }}</span></router-link>
                              <!-- admin -->
                              <router-link :to="{name: 'user-info'}" v-show="userLogin.u_role === 'admin'" class="sidebar-link"> คำขอเปิดร้าน <span class="badge badge-primary rounded-circle">{{ store }}</span></router-link>
                              <!-- user -->
                              <router-link :to="{name: 'basket'}" v-show="userLogin.u_role === 'user'" class="sidebar-link"> สินค้าที่ยังไม่ชำระ <span class="badge badge-primary rounded-circle">{{ basket }}</span></router-link>
                              <router-link :to="{name: 'your-product'}" v-show="userLogin.u_role === 'user'" class="sidebar-link"> สินค้าที่คุณจะได้รับ <span class="badge badge-success rounded-circle">{{ Package }}</span></router-link>
                              <!-- buying -->
                              <router-link :to="{name: 'buy-list'}" v-show="userLogin.u_role === 'buying'" class="sidebar-link"> มีเกษตรกรขาย <span class="badge badge-info rounded-circle">{{ present }}</span></router-link>
                              <!-- selling -->
                              <router-link :to="{name: 'selling-express'}" v-show="userLogin.u_role === 'selling'" class="sidebar-link" @click.native="status('send')"> สินค้าที่จัดส่งแล้ว <span class="badge badge-success rounded-circle">{{ saleSending }}</span></router-link>
                              <router-link :to="{name: 'selling-express'}" v-show="userLogin.u_role === 'selling'" class="sidebar-link" @click.native="status('order')"> สินค้าที่ยังไม่จัดส่ง <span class="badge badge-danger rounded-circle">{{ saleNot }}</span></router-link>
                              <!-- farmer -->
                              <router-link :to="{name: 'farmer-present'}" v-show="userLogin.u_role === 'farmer'" class="sidebar-link"> อนุมัติรับซื้อ <span class="badge badge-success rounded-circle">{{ farmerBuying }}</span></router-link>
                              <router-link :to="{name: 'farmer-present'}" v-show="userLogin.u_role === 'farmer'" class="sidebar-link" @click.native="onPresent()"> รับซื้อราคาพิเศษ <span class="badge badge-info rounded-circle">{{ storeExtra }}</span></router-link>
                            </div>
                            
                          <!-- </body> -->
                      </section>
                    </div>

                    <Sidebar />
                </div>

                <div class="col-lg-9">
                    <slot></slot>
                </div>
                
                
                <audio ref="Message" src="../assets/Sound/livechat-129007.mp3"></audio>
            </div>
        </div>
        <StorePresentDialog :present="presentItem" @onClose="presentItem = null" />
    </div>
</template>

<script>
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StorePresentDialog from '../views/farmer/storePresentDialog.vue'
import {mapState} from 'vuex'
import axios from 'axios'

export default {
  components: {
    Navbar,
    Sidebar,
    StorePresentDialog
  },
  data(){
    return{
      audioContext: null,
      audioBuffer: null,
      admin: '',
      store: '',
      basket: '',
      Package: '',
      saleSending: '',
      saleNot: '',
      present: '',
      farmerBuying: '',
      storeExtra: '',
      presentItem: ""
    }
  },
  computed: {
    ...mapState({
      userLogin: state => state.user 
    })
  },
  created() {
    // เรียกข้อความ
    this.Message();
    setInterval(() => { this.Message() }, 5000);

    // ส่วนของ admin
    if(this.userLogin.u_role == 'admin') {
      this.openStore();
      setInterval(() => { this.openStore() }, 5000);   
    }
    // ส่วนของ customer
    if(this.userLogin.u_role == 'user') {
      this.sendPackage();
      this.receivePackage();
      setInterval(() => { this.sendPackage();
                          this.receivePackage(); }, 5000);   
    }
    // ส่วนของ selling
    if(this.userLogin.u_role == 'selling') {
      this.saleSend();
      this.saleNotSend();
      setInterval(() => { this.saleSend();
                          this.saleNotSend(); }, 5000); 
          
    }
    // ส่วนของ buying
    if(this.userLogin.u_role == 'buying') {
      this.farmerPresent();
      setInterval(() => { this.farmerPresent() }, 5000);   
    }
    // ส่วนของ farmer
    if(this.userLogin.u_role == 'farmer') {
      this.buyingTo();
      this.pricePresent();
      setInterval(() => { this.buyingTo();
                          this.pricePresent(); }, 5000);   
    }
    
  },
  mounted() {
    
    // // ฟังกชันส่งข้อมูลมาจาก backend realtime
    // const eventSource = new EventSource('/api/socket/events');
    //   eventSource.onmessage = (event) => {
    //     const data = JSON.parse(event.data);
    //     console.log(data)
    //   };
    //   eventSource.onerror = (error) => {
    //     console.error('SSE error:', error);
    //     eventSource.close();
    //   };

  },
  methods: {
    notify() {
      this.$refs.Message.play();
    },
    Message(){
      axios.get(`/api/socket/admin/${this.userLogin.u_id}`).then(res => {
          const admin = res.data
          let cout = 0
          admin.forEach((item) => {
            item.send_id == this.userLogin.u_id ? (item.send_cout > 0 ? cout++ : '') : '';
            item.rec_id == this.userLogin.u_id ? (item.rec_cout > 0 ? cout++ : '') : '';
          })
          this.admin = cout
        }).catch(error => this.alertify.error(error.response.data.message));
    },
    openStore(){
      axios.get(`/api/userinfo/all`).then(res => {
          this.store = res.data.count
        }).catch(error => this.alertify.error(error.response.data.message));
    },
    sendPackage(){
      axios.get(`/api/customer/basket/${this.userLogin.u_id}`).then(res => {
          this.basket = res.data.length
        }).catch(error => this.alertify.error(error.response.data.message));
    },
    receivePackage(){
      axios.get(`/api/customer/orderSend/${this.userLogin.u_id}`).then(res => {
          this.Package = res.data.length
        }).catch(error => this.alertify.error(error.response.data.message));
    },
    saleSend(){
      axios.get(`/api/selling/sendAll/${this.userLogin.u_id}`).then(res => {
          this.saleSending = res.data.length
        }).catch(error => this.alertify.error(error.response.data.message));
    },
    saleNotSend(){
      axios.get(`/api/selling/sendNot/${this.userLogin.u_id}`).then(res => {
          this.saleNot = res.data.length
        }).catch(error => this.alertify.error(error.response.data.message));
    },
    farmerPresent(){
      axios.get(`/api/buying/weigth/${this.userLogin.u_id}`).then(res => {
          let cout = 0
          const data = res.data
          data.forEach((item) => { item.f_order == 'pending' ? cout++ : '' })
          this.present = cout
        }).catch(error => this.alertify.error(error.response.data.message));
    },
    buyingTo(){
      axios.get(`/api/farmer/all/${this.userLogin.u_id}`).then(res => {
          let cout = 0
          const data = res.data
          data.forEach((item) => { item.f_order == 'allowed' ? cout++ : '' })
          this.farmerBuying = cout
        }).catch(error => this.alertify.error(error.response.data.message));
    },
    pricePresent(){
      axios.get(`/api/farmer/buy/${this.userLogin.u_id}`).then(res => {
          let cout = 0;
          res.data.forEach((item) => { item.fp_exp == 'pending' ? cout++ : ''; })
          this.storeExtra = cout
        }).catch(error => this.alertify.error(error.response.data.message))
    },
    status(s) {
      this.$router.push( { name: 'selling-express', query: { status: s } } )
    },
    onPresent(){
      this.presentItem = this.userLogin
    },
  },
  
};
</script>


<style scoped>
/* .card-body {
    padding-left: 15px;
    padding-right: 15px;
    padding: 0.8rem 0;
  }*/

  .font {
    font-size: 20px;
    font-weight: 300;
  }

  .sidebar-link {
    display: block;
    padding: 0.5rem 1.5rem;
    margin-bottom: 2px;
    color: #525b62;
    font-weight: 400;
    text-decoration: none;
  }



@media (max-width: 575.98px) { 
  
}
</style>

