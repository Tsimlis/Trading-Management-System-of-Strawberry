<template>
    <Layout>
        <div class="card mb-3">
            <div class="card-body">
                <header class="mb-4">
                    <Search :types="search_types" @onSearch="onSearch($event)" />
                    <h5><i class="fa fa-list-alt"></i> รายการข้อความ</h5>
                </header>

                <div class="table-responsive">
                  <table class="table table-hover text-center ">  <!-- text-nowrap -->
                    <thead class="text-nowrap">
                        <tr>
                            <th></th>
                            <th>ชื่อผู้รับ</th>
                            <th>ชื่อผู้ส่ง</th>
                            <th>ข้อความ</th>
                            <th>เวลาส่ง</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in show" :key="item.id">
                          <td @click="onDialog(item)">{{index + 1}}</td>
                          <!-- 2 ตัวนี้ไว้แยกแสดงคนส่งกับคนรับ -->
                          <td @click="onDialog(item)" v-if="item.rec_name != userId.u_fullname" >{{ item.rec_name }}</td>
                          <td @click="onDialog(item)" v-if="item.send_name != userId.u_fullname" >{{ item.send_name }}</td>
                          <!-- สองตัวนี้คือแสดงค่าเดียวกัน แต่แยกรูปกับข้อความ -->
                          <td @click="onDialog(item)" v-show="max( item ).length > 200"><i class="fa fa-picture-o"></i><span class="badge badge-warning rounded-circle" v-if="For(item) != 0">{{ For(item) }}</span></td>
                          <td @click="onDialog(item)" class="text-right" v-show="max( item ).length < 200">...{{ max( item ) }}<span class="badge badge-warning rounded-circle" v-if="For(item) != 0">{{ For(item) }}</span></td>
                          
                          <td @click="onDialog(item)">{{ item.updated | formatDate }}</td>
                          
                          <td>
                              <i @click="onDelete(item)" class="pointer fa fa-trash text-danger"></i>
                          </td>
                        </tr>
                    </tbody>
                  </table>
                </div>
                <label class="pointer text-danger" @click="onDialog(userId)" v-if="userId.u_role != 'admin'">*<u>แจ้งผู้ดูแลระบบ</u></label>
                <Pagination :data="message" :page="page" @onClose="roomItem = null" @onPage="onPage($event)" />
            </div>
        </div>

        <MessageDialog :message="roomItem" @onClose="roomItem = null" />
    </Layout>
</template>


<script>
import Layout from "@/components/Layout";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { mapState } from "vuex";
import axios from "axios";
import MessageDialog from './messageDialog.vue';
import imageCompression from 'browser-image-compression';

export default {
  data() {
    return {
      page: 1,
      search_types: [
        { name: "ชื่อผู้ใช้", value: "n_name" },
      ],
      roomItem: null,
      message: {},
      show: [],
    };
  },
  components: {
    Layout,
    Pagination,
    Search,
    MessageDialog
  },
  watch: {
    message(value){
      Object.assign(this.message, { limit: 4 ,rows: value.length });
      // ฟังกชันปรับหน้าเป็นเหตุการณ์ล่าสุด
      this.refectPage();
    },
    //  การแบ่งหน้า และ ถ่ายข้อมูล
    page(num){
      this.refectPage();
    },
  },
  computed: {
    ...mapState({ userId: state => state.user })
  },
  mounted() {
    // แสดงข้อความที่ส่งให้ admin ทั้งหมด
    this.sendMessage();
    setInterval(() => { this.sendMessage() } , 5000);
    
    
  },
  methods: {
    // ลบข้อมูล
    onDelete(item) {
      this.alertify.confirm("คุณต้องการจะลบข้อมูลนี้จริงหรือ?", () => {
        axios.delete(`/api/socket/Delete/${item.id}`)
          .then( ).catch(error => this.alertify.error(error.response.data.message));
      });
    },
    //หน้า dialog
    onDialog(item){  //เมื่อทำการจอง จะแสดงข้อมูลหน้า Dialog
        this.roomItem = item;
    },
    // การแบ่งหน้า Pagination
    onPage(page) {
      this.page = page;
    },
    // การค้นหาข้อมูล Filter
    onSearch(search) {
      this.page = 1;
    //   this.$store.dispatch("set_message", { page: this.page, ...this.search });
    },
    max(item) {
      const parsedMessage = JSON.parse(item.message);
      const max = parsedMessage[parsedMessage.length - 1]
      const write = JSON.parse(max).receive || JSON.parse(max).send
      return write
    },
    sendMessage(){
      // แสดงข้อความเข้าของ admin
      axios.get(`/api/socket/admin/${this.userId.u_id}`)
        .then(res => this.message = res.data ).catch(error => this.alertify.error(error.response.data.message));
    },
    For(item){
      let send_cout = 0;
      let rec_cout = 0;
      item.rec_id == this.userId.u_id ? rec_cout = item.rec_cout : '';
      item.send_id == this.userId.u_id ? send_cout = item.send_cout : '';
      const cout = send_cout || rec_cout
      return cout
    },
    refectPage(){
      const end = this.page * this.message.limit
      const start = end - this.message.limit
      this.show = this.message.slice(start, end)
    },
    onChangeFile(input) {
        this.send.message = "";
        const file = input.files[0];
        this.compressed(file);
    },
    async compressed(file){

      const options = {
        maxSizeMB: 0.3, // ขนาดสูงสุดของไฟล์ (หน่วย MB)
        maxWidthOrHeight: 250, // ขนาดสูงสุดของภาพ (กว้างหรือสูง)
        useWebWorker: true, // ใช้ Web Worker เพื่อลดเวลาในการประมวลผล
        maxIteration: 10, // จำนวนครั้งในการบีบอัดเพื่อรักษาคุณภาพ
        initialQuality: 0.3 // คุณภาพเริ่มต้นในการบีบอัด (0 - 1)
      };

      try {
        // บีบอัดไฟล์
        const compressedFile = await imageCompression(file, options);
        // แปลงไฟล์บีบอัดเป็น Base64
        this.send.message = await imageCompression.getDataUrlFromFile(compressedFile);
      } catch (error) {
        console.error('Error during image compression:', error);
      }

    },
  }
};


</script>

<style  scoped>
.btn {
  color: #ffffff;
  background-color: #ced4da;
  margin-right: 7px;
  min-width: 130px;
}
.btn.router-link-active {
  background-color: #17a2b8;
}


@media (max-width: 575.98px) { 
  
}
</style>


