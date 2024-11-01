<template>
    <Layout>
        <div class="form-group">
            <router-link class="btn btn-menu" :to="{ name:'user-info' }">รายการสมาชิก</router-link>
            <router-link class="btn btn-menu" :to="{ name:'user-info-form' }">เพิ่มข้อมูลใหม่</router-link>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <header class="mb-4">
                    <Search :types="search_types" @onSearch="onSearch($event)" />
                    <h5><i class="fa fa-list-alt"></i> รายการข้อมูลสมาชิก</h5>
                </header>

                <div class="table-responsive">
                  <table class="table table-hover text-nowrap text-center">
                    <thead >
                        <tr class="">
                            <!-- <th>id</th> -->
                            <!-- <th>ชื่อเข้าระบบ</th> -->
                            <th>ประเภทผู้ใช้</th>
                            <th>ชื่อผู้ใช้</th>
                            <!-- <th>อีเมล</th> -->
                            <th>เบอร์โทร</th>
                            <!-- <th>ไอดีไลน์</th> -->
                            <th>ที่อยู่</th>
                            <th>เลขบัญชี</th>
                            <th>สถานะร้านค้า</th>
                            <th>วันที่แก้ไขล่าสุด</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in userinfo.result" :key="item.u_id" :class="getStatus(item)" v-show="item.u_role != 'admin'">
                            <!-- <td>{{ item.u_id }} </td> -->
                            <!-- <td>{{ item.u_username }}</td> -->
                            <td>{{ item.u_role }}</td>
                            <td>{{ item.u_fullname }}</td>
                            <!-- <td>{{ item.u_email || 'ไม่มี' }}</td> -->
                            <td>{{ item.u_phone }}</td>
                            <!-- <td>{{ item.u_lineId || 'ไม่มี' }}</td> -->
                            <td>{{ item.u_address }}</td>
                            <td style="padding: 5px;">
                              <div>{{ item.u_bank_name }}</div>
                              <div>{{ item.u_bank_acc }}</div>
                            </td>
                            <td class="btns no-wrap" style="padding: 7px;">
                              <div v-show="item.u_role === 'buying' || item.u_role === 'selling'">

                                <div v-if="item.u_store == 'pending'" >
                                  <div class="text-center">
                                    <img class="w-100 pointer" :src="`/api/uploads/${item.u_card}`" :alt="item.u_id" @click="onImage(item.u_card)">
                                  </div>

                                  <div class="text-center mt-2">
                                    <button @click="onUpdateStatus('not', item)" class="btn btn-sm btn-danger mr-2"  >
                                      <i class="fa fa-times-circle"></i> ไม่อนุม้ติ
                                    </button>
                                  
                                    <button @click="onUpdateStatus('pass', item)" class="btn btn-sm btn-warning"  >
                                      <i class="fa fa-check-circle"></i> อนุมัติ
                                    </button>  
                                  </div>
                                </div>

                                <div v-if="item.u_store == 'pass'" >
                                  <i class="fa fa-check-circle text-success"></i> อนุมัติแล้ว
                                </div>

                                <div v-if="item.u_store == 'not'" >
                                  <i class="fa fa-times-circle text-danger"></i> ไม่อนุม้ติ
                                </div>
                              </div>
                              
                               
                            </td>
                            <td>{{ item.u_updated | formatDate}}</td>
                            <td class="text-right no-wrap" >
                                <!-- <i @click="onUpdate(item)" class="pointer fa fa-edit text-info mr-2"></i> -->
                                <i @click="onDelete(item)" class="pointer fa fa-trash text-danger mr-2"></i>
                                <!-- <i @click="onChat(item)" class="pointer fa fa-comments text-success"><span class="badge badge-warning rounded-circle" v-if="For(item) != 0">{{ For( item )}}</span></i> -->
                            </td>
                        </tr>
                    </tbody>
                  </table>
                </div>
                
                <Pagination :data="userinfo" :page="page" @onPage="onPage($event)" />
            </div>
        </div>

        <Chat :message="chatItem" @onClose="chatItem = null" />
        <Img :img="imageItem" @onClose="imageItem = null" />
    </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import Chat from "./userMessageDialog.vue";
import Img from "@/components/ImageView.vue";
import { mapState } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      search: {},
      page: 1,
      search_types: [
        { name: "ชื่อผู้ใช้งาน", value: "u_full" },
        { name: "ประเภทผู้ใช้", value: "u_role" },
        { name: "สถานะ", value: "u_status" },
      ],
      users: {},
      chatItem: null,
      imageItem: null,
      message: [],
    };
  },
  components: {
    Layout,
    Pagination,
    Search,
    Chat,
    Img
  },
  computed: {
      ...mapState({
          userinfo: state => state.userinfo,
          userId: state => state.user
        })
  },
  mounted() {
      this.$store.dispatch("set_userinfo");
      // แจ้งเตือนข้อความ
      this.sendMessage();
      setInterval(() => { this.sendMessage() } , 5000);
  },
  methods: {
    // แก้ไขข้อมูลโดยส่ง id ไปที่หน้า Form create
    onUpdate(item) {
      this.$router.push({ name: "user-info-form", query: { id: item.u_id } });
    },
    // เปลี่ยนสถานะการเปิดร้าน
    onUpdateStatus(u_store, item){
      this.alertify.confirm("คุณต้องการทำรายการต่อไปหรือไม่", () => {
        axios.put(`/api/userinfo/store/${item.u_id}`, {u_store}).then(res => {
          this.$store.dispatch('set_userinfo');
          this.page = 1
        }).catch(err => this.alertify.error(err.response.data.message))
      }).setHeader('แจ้งเตือน');
    },
    onChat(item){
      this.chatItem = item
    },
    onImage(item){
      this.imageItem = item
    },
    // ลบข้อมูล
    onDelete(item) {
      this.alertify.confirm("คุณต้องการจะลบข้อมูลนี้จริงหรือ?", () => {
        axios.delete(`/api/userinfo/${item.u_id}`)
          .then(() => this.$store.dispatch("set_userinfo"))
          .catch(error => this.alertify.error(error.response.data.message));
      });
    },
    // การแบ่งหน้า Pagination
    onPage(page){
        this.page = page;
        this.$store.dispatch("set_userinfo", { page : this.page, ...this.search });
    },
    onSearch(word){
        this.search = word;
        this.$store.dispatch("set_userinfo", { page: 1, ...this.search });
    },
    // การสร้างสีให้ด้วยการเช็ค status
    getStatus(item){
        const status = {}
        status[item.u_status] = true
        return status;
    },
    sendMessage(){
      // แสดงข้อความ
      axios.get(`/api/socket/admin/${this.userId.u_id}`)
        .then(res => this.message = res.data ).catch(error => this.alertify.error(error.response.data.message));
    },
    For(item){
      let send_cout = 0;
      let rec_cout = 0;
      this.message.forEach((body) => {
        body.send_id == item.u_id ? rec_cout = body.rec_cout : '';
        body.rec_id == item.u_id ? send_cout = body.send_cout : '';
      })
      const cout = send_cout || rec_cout
      return cout
    }
  }
};


</script>

<style  scoped>
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
  width: 100px;
  text-align: right;
}
.btns .btn {
  width: 75px;
}


@media (max-width: 575.98px) { 
  
}
</style>


