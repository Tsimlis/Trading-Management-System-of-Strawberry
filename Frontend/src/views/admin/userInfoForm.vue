<template>
    <Layout>
        <div  class="form-group">
            <router-link class="btn btn-menu" :to="{ name:'user-info' }">รายการสมาชิก</router-link>
            <router-link class="btn btn-menu" :to="{ name:'user-info-form' }">เพิ่มข้อมูลใหม่</router-link>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <header>
                  <div class="row">
                    <div class="col-sm-6"><h5><i class="fa fa-edit"></i> เพิ่ม/แก้ไข ข้อมูลสมาชิก</h5></div>
                  </div>
                </header>
                <hr>
                
                <form @submit.prevent="onSubmit()">
                  <div class="form-group" >
                    <div class="form-group">
                        <label for="">ชื่อผู้ใช้</label>
                        <input type="text" class="form-control" name="username" v-model.trim="form.u_username" required >
                    </div>

                    <div class="form-group">
                        <label for="">รหัสผ่าน</label>
                        <input type="text" class="form-control" name="password" v-model.trim="form.u_password" required >
                    </div>
                    
                    <div class="form-group col-md-15">
                      <label for="role">ประเภทผู้ใช้</label>
                      <select id="role" class="form-control" name="role" v-model="form.u_role" required>
                        <option value="user">ซื้อผลผลิต</option>
                        <option value="farmer">เกษตกร</option>
                        <option value="buying">ร้านรรับซื้อ</option>
                        <option value="selling">ร้านขาย</option>
                      </select>
                    </div>

                    <div class="form-group col-md-15" v-show="form.u_role === 'buying' || form.u_role === 'selling'" >
                      <label for="store">สถานะร้านค้า</label>
                      <select id="store" class="form-control" name="store" v-model="form.u_store" >
                        <option value="pending">รออนุมัติ</option>
                        <option value="pass">อนุม้ติ</option>
                      </select>
                    </div>

                    <div class="form-group" >
                        <label for="">ชื่อเต็ม/ชื่อร้าน</label>
                        <input type="text" class="form-control" name="fullname" v-model.trim="form.u_fullname" required >
                    </div>

                    <div class="form-group">
                        <label for="">อีเมล</label>
                        <input type="email" class="form-control" name="email" v-model.trim="form.u_email" required >
                    </div>

                    <div class="form-group" >
                        <label for="">เบอร์โทร</label>
                        <input type="number" class="form-control" name="phone" v-model.trim="form.u_phone" required >
                    </div>

                    <div class="form-group">
                        <label for="">ไอดีไลน์</label>
                        <input type="text" class="form-control" name="lineId" v-model.trim="form.u_lineId" required >
                    </div>
                    
                    <div class="form-group">
                        <label for="">ที่อยู่</label>
                        <textarea class="form-control" name="adress" v-model.trim="form.u_address" rows="4"></textarea>
                    </div>

                  </div>

                  <!-- btn -->
                  <div class="form-group mt-4 mb-5">
                      <div class="row">
                          <div class="col-sm-6">
                              <button type="submit" class="btn btn-info btn-block mb-2">
                                  บันทึกข้อมูล
                              </button>
                          </div>
                          <div class="col-sm-6">
                              <router-link :to="{name: 'user-info'}" class="btn btn-danger btn-block mb-2">
                                  ยกเลิก
                              </router-link>
                          </div>
                      </div>
                  </div>
                </form>
            </div>
        </div>
    </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import axios from "axios";

export default {
  components: {
    Layout
  },
  data() {
    return {
      form: {
        u_role: "",
        u_username: "",
        u_password: "",
        u_fullname: "",
        u_email: "",
        u_phone: "",
        u_lineId: "",
        u_address: "",
        u_store: "",
      }
    };
  },
  mounted(){
    this.UpdateItem();
  },
  methods: {
    // ส่งข้อมูลแก้ไขไปยัง Backend
    onSubmit() {
      this.$validator.validateAll().then(valid => {
        if (!valid) return;
        //ตรวจสอบว่ามีการแก้ไข หรือเพิ่มไม
        const update = this.$router.currentRoute.query.id;
        const request = isNaN(update) ? axios.post('/api/userinfo', this.form) //สร้างใหม่
          : axios.put(`/api/userinfo/${update}`, this.form); //ทำการแก้ไข
          //ส่งข้อมูลไป server
        request.then(res => this.$router.push({name: "user-info"}))
        .catch(error => this.alertify.error(error.response.data.message))
      })
    },

    //นำข้อมูลจาก server ไปใส่ในหน้าแก้ไข
    UpdateItem(){
      const id = this.$route.query.id;
      if(isNaN(id)) return

      axios.get(`/api/userinfo/${id}`).then(res => {
        const form = res.data;
        this.form.u_username = form.u_username;
        this.form.u_password = form.u_password;
        this.form.u_role = form.u_role;
        this.form.u_fullname = form.u_fullname;
        this.form.u_email = form.u_email;
        this.form.u_phone = form.u_phone;
        this.form.u_lineId = form.u_lineId;
        this.form.u_address = form.u_address;
        this.form.u_store = form.u_store;
        }).catch(() => this.$router.push({name: "user-info"}))
    }
  }
};
</script>

<style scoped>

.btn-menu {
  color: #ffffff;
  background-color: #ced4da;
  margin-right: 7px;
  min-width: 130px;
}
.btn.router-link-exact-active {
  background-color: #17a2b8;
}
form {
  max-width: 500px;
  margin: auto;
}
form img {
  border: solid 1px #6c757d;
}


@media (max-width: 575.98px) { 
  
}
</style>

