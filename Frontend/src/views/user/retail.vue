<template>
  <div class="home">
    <Layout>
          <div class="form-group mb-5">

            <!-- card -->
            <div class="form-group mt-5" >
              <div class="row" >
                <div class="col-sm-4 mb-3" v-for="item in show" :key="item.r_id">
                    
                  <figure class="figure modal_con zoomingBox">
                    <img  :src="`/api/uploads/${item.r_image}` || '/img/no-image.png'" 
                          :alt="item.r_name" class="figure-img img-fluid m-0 rounded pointer"  
                          @click="onDialog(item)"
                          style="height: 300px;">

                    <figcaption class="figure-caption text-right mt-3">
                      {{item.r_sale_name}} : สตรอว์เบอร์รี {{item.r_look}}
                      <h6 class="m-0" v-if="item.r_look != 'juice'"><i class="fa fa-comments text-success" @click="onChat(item)"></i> #{{item.r_id}} พิเศษ {{item.r_weigth}} กก. ราคา {{item.r_price}} บาท</h6>
                      <h6 class="m-0" v-if="item.r_look == 'juice'"><i class="fa fa-comments text-success" @click="onChat(item)"></i> #{{item.r_id}} พิเศษ {{item.r_weigth}} ขวด ราคา {{item.r_price}} บาท</h6>
                      <h6 class="m-0">คงเหลือ {{item.r_stock}}</h6>
                      <h6 class="m-0">{{item.r_detail}}</h6>
                      <h5 class="m-0" v-show="item.r_free == 0">ฟรีจัดส่ง !</h5>
                      <h5 class="m-0" v-show="item.r_free != 0">ค่าจัดส่ง {{item.r_free}}</h5>
                    </figcaption>
                  </figure>
                  
                </div>
              </div>
            </div>
          </div>
        <Pagination :data="store" :page="page" @onPage="onPage($event)" />  
        
        <Chat :message="chatItem" @onClose="chatItem = null" /> 
        <RetailDialog :store="retailItem" @onClose="retailItem = null" />
    </Layout>
  </div>
</template>

<script>
import Layout from "@/components/Layout";
import RetailDialog from "./retailDialog.vue"
import Chat from "./customerChat.vue"
import Pagination from "@/components/Pagination";
import {mapState} from 'vuex'
import axios from 'axios'


export default {
    data(){
        return{
            retailItem: null,
            chatItem: null,
            store: {},
            show: {},
            page: 0
        }
    },
  components: {
    Layout,
    RetailDialog,
    Pagination,
    Chat
  },
  computed: {
      ...mapState({ userId: state => state.user})
  },
  watch: {
    store(value){
        this.$set(this.store, 'limit', 9);  // จำนวนที่แสดงใน 1 หน้า
        this.$set(this.store, 'rows', value.length);
        this.page = 1 //เมื่อข้อมุูลเข้าให้เป็นหน้าที่ 1
    },
    //  การแบ่งหน้า
    page(num){
        const end = num * this.store.limit
        const start = end - this.store.limit
        this.show = this.store.slice(start, end)
    },    
  },
  mounted() {
    // แสดงข้อมูลสินค้าทุกร้าน
    axios.get(`/api/customer/retail`).then(res => this.store = res.data ).catch(error => this.alertify.error(error.response.data.message));

  },
  methods:{
    onDialog(item){
        this.retailItem = item
    },
    onPage(page){
        this.page = page;
    },
    onChat(item){
      this.chatItem = item
    }
  }
};
</script>

<style scoped>
.card-img-overlay {
  position: relative;
  background-color: #fff;
  padding-bottom: 5px;
  padding-top: 5px;
  color: #6C757D;
}
.card-img {
  border-radius: 0px;
}
.img-fluid{
    max-width: 100%;
    height: 200px;
}
a {
  color: #6C757D;
}
.nav-tabs .nav-link.active  {
  background-color: #eeeeee;
  border-color: #dee2e6 #dee2e6 #17A2B8;
}

.modal_con {
  /* margin: 23px;
  max-width: 50%; */
  padding: 1rem 2rem;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.4); 
  border-radius: 0.25rem;
}
</style>