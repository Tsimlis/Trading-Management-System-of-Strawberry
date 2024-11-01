<template>
    <Layout>
        <div class="card mb-3">
            <div class="card-body">
                <header>
                    <h5><i class="fa fa-edit"></i> เพิ่ม/แก้ไข ข้อมูลผู้ใช้</h5>
                </header>
                <hr>
                
                <form >
                    <div class="form-group">
                        <a href="" class="float-right text-danger" @click.prevent="image = true" v-show="image != true">แก้ไข</a>
                        <label for="">รูปประจำตัว</label>
                        <label class="btn btn-secondary btn-block" v-show="image">
                            <i class="fa fa-upload"></i> อัพโหลดภาพ
                            <input type="file" class="d-none" @change="onChangeFile($event.target)">
                        </label>
                        <div class="text-center">
                          <div v-if="(form.u_image == checkImage) && (checkImage != null)"><img class="w-50" :src="`/api/uploads/${form.u_image}`" :alt="form.u_id" ></div>
                          <div v-if="(form.u_image != checkImage) || (checkImage == null)"><img class="w-50" :src="form.u_image || '/img/no-image.png'" :alt="form.u_id" ></div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="">ชื่อผู้ใช้งาน</label>
                        <a href="" class="float-right text-danger" @click.prevent="name = false" v-show="name != false">แก้ไข</a>
                        <input type="text" class="form-control text-center" name="username" 
                            v-model.trim="form.u_username" 
                            required
                            :disabled="name">
                    </div>

                    <div class="form-group">
                        <label for="">รหัสผ่าน</label>
                        <a href="" class="float-right text-danger" @click.prevent="password = false" v-show="password != false">เปลี่ยนรหัสผ่าน</a>
                        <input type="text" class="form-control text-center" name="password" 
                            v-model.trim="form.u_password"
                            placeholder="*****" 
                            required
                            :disabled="password">
                    </div>

                    <div class="form-group" >
                        <label for="">ชื่อ-นามสกุล</label>
                        <a href="" class="float-right text-danger" @click.prevent="fullname = false" v-show="fullname != false">แก้ไข</a>
                        <input type="text" class="form-control text-center" name="fullname" 
                            v-model="form.u_fullname"
                            required
                            :disabled="fullname">
                    </div>

                    <div class="form-group">
                        <label for="">ที่อยู่</label>
                        <a href="" class="float-right text-danger" @click.prevent="address = false" v-show="address != false">แก้ไข</a>
                        <textarea class="form-control text-center" v-model.trim="form.u_address" 
                            rows="4"
                            :disabled="address"></textarea>
                    </div>

                    <div class="form-group" >
                        <label for="">เบอร์โทรศัพท์</label>
                        <a href="" class="float-right text-danger" @click.prevent="phone = false" v-show="phone != false">แก้ไข</a>
                        <input type="text" class="form-control text-center" name="phone"
                            v-model="form.u_phone" 
                            v-validate="{ required: true, regex: /^[0-9]{9,10}$/ }"
                            :class="{ 'is-invalid': errors.has('phone') }"
                            :disabled="phone">  <!-- pattern="\d{3}-\d{3}-\d{4}" placeholder="08x-xxx-xxxx" -->
                            <span class="invalid-feedback">ใส่ขีดด้วย 08x-xxx-xxxx {{ errors.first('phone') }}</span>
                    </div>

                    <div class="form-group" v-show="form.u_promptPay != ''">
                        <label >เลขพร้อมเพย์</label>
                        <a href="" class="float-right text-danger" @click.prevent="promptPay = false" v-show="promptPay != false">แก้ไข</a>
                        <input type="number" class="form-control text-center" name="promptPay" 
                            v-model="form.u_promptPay" 
                            :class="{ 'is-invalid': errors.has('promptPay') }"
                            :disabled="promptPay">
                            <span class="invalid-feedback">ใส่ขีดด้วย 08x-xxx-xxxx {{ errors.first('promptPay') }}</span>
                    </div>

                    <div class="form-group" v-show="form.u_emaill != ''">
                        <label >อีเมล</label>
                        <a href="" class="float-right text-danger" @click.prevent="email = false" v-show="email != false">แก้ไข</a>
                        <input type="text" class="form-control text-center" name="email" 
                            v-model="form.u_email"
                            required
                            :disabled="email">
                    </div>

                    <div class="form-group" v-show="form.u_lineId != ''">
                        <label >ไอดีไลน์</label>
                        <a href="" class="float-right text-danger" @click.prevent="lineId = false" v-show="lineId != false">แก้ไข</a>
                        <input type="text" class="form-control text-center" name="lineId" 
                            v-model="form.u_lineId"
                            required
                            :disabled="lineId">
                    </div>

                    <div class="form-group" v-show="form.u_bank_name != ''">
                        <label >ชื่อธนาคาร</label>
                        <a href="" class="float-right text-danger" @click.prevent="bank_name = false" v-show="bank_name != false">แก้ไข</a>
                        <input type="text" class="form-control text-center" name="bank_name" 
                            v-model="form.u_bank_name"
                            required
                            :disabled="bank_name">
                    </div>

                    <div class="form-group" v-show="form.u_bank_acc != ''">
                        <label >เลขบัญชี</label>
                        <a href="" class="float-right text-danger" @click.prevent="bank_acc = false" v-show="bank_acc != false">แก้ไข</a>
                        <input type="text" class="form-control text-center" name="bank_acc" 
                            v-model="form.u_bank_acc"
                            required
                            :disabled="bank_acc">
                    </div>

                    <div class="form-group" v-show="form.u_card != ''">
                        <label >หน้าบัตรประชาชน</label>
                        <!-- <a href="" class="float-right text-danger" @click.prevent="card = false" v-show="card != false">แก้ไข</a> -->
                        <div class="">
                          <img class="w-50" :src="`/api/uploads/${form.u_card}`" :alt="form.u_id" >
                        </div>
                    </div>
                    

                    
                    <!-- button -->
                    <div class="form-group mt-4 mb-5">
                        <div class="row">
                            <div class="col-sm-6">
                                <button @click.prevent="onSubmit()" class="btn btn-info btn-block mb-2">
                                    บันทึกข้อมูล
                                </button>
                            </div>
                            <div class="col-sm-6">
                                <router-link :to="{name: 'home'}" class="btn btn-danger btn-block mb-2">
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
import {mapState} from 'vuex'

export default {
  components: {
    Layout
  },
  data() {
    return {
      image: false,
      name: true,
      password: true,
      fullname: true,
      address: true,
      phone: true,
      email: true,
      lineId: true,
      promptPay: true,
      card: true,
      bank_name: true,
      bank_acc: true,
      form: {
        u_username: "",
        u_password: "",
        u_fullname: "",
        u_email: "",
        u_phone: "",
        u_lineId: "",
        u_address: "",
        u_image: "",
        u_promptPay: "",
        u_card: "",
        u_bank_name: "",
        u_bank_acc: ""
      },
      checkImage: ""
    };
  },
  computed: {
    ...mapState({ userLogin: state => state.user })
  },
  mounted(){
    this.UpdateItem();
  },
  methods: {
    // ส่งข้อมูลแก้ไขไปยัง Backend
    onSubmit() {
      this.$validator.validateAll().then(valid => {
        if (!valid) return;
        // console.log(this.form)
        const request = axios.put(`/api/userinfo/setting/${this.userLogin.u_id}`, this.form).then(() => {
                          this.alertify.success('ทำการบันทึกแล้ว')
                          window.location.reload()
                        }).catch(error => this.alertify.error(error.response.data.message))
      })
    },

    // เปลี่ยนไฟล์อัพโหลดเป็น Base64 string
    onChangeFile(input) {
      this.form.u_image = "";
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        if (file.type.indexOf("image/") >= 0) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.addEventListener("load", () => {
            this.form.u_image = reader.result;
          });

          return;
        }
      }
    },
    //นำข้อมูลจาก server ไปใส่ในหน้าแก้ไข
    UpdateItem(){
      axios.get(`/api/userinfo/${this.userLogin.u_id}`).then(res => {
        
        this.form.u_username = res.data.u_username;
        this.form.u_password = "",
        this.form.u_fullname = res.data.u_fullname;
        this.form.u_email = res.data.u_email;
        this.form.u_phone = res.data.u_phone;
        this.form.u_lineId = res.data.u_lineId;
        this.form.u_address = res.data.u_address;
        this.form.u_image = res.data.u_image;
        this.form.u_promptPay = res.data.u_promptPay;
        this.form.u_card = res.data.u_card;
        this.form.u_bank_name = res.data.u_bank_name;
        this.form.u_bank_acc = res.data.u_bank_acc;

        // ไว้สลับเมื่อเปลี่ยนรูปโปรไฟล์ใหม่
        this.checkImage = res.data.u_image;
      }).catch(error => this.alertify.error(error.response.data.messgae))
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

