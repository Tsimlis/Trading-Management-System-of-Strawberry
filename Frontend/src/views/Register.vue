<template>
    <div class="register">
        <div class="row">
          <div class="col-4 p-0"><img src="/img/strawLOGO.ico" alt="straw" class="img-logo w-75 zoomingBox"></div>
          <div class="col-8 p-0 mt-4"><img src="/img/logo.svg" alt="Logo" class=""></div>
        </div>
        
        <div class="card shadow-lg">
            <h1 class="card-header">
                ลงทะเบียน
            </h1>
            <div class="card-body">
                <form @submit.prevent="onSubmit()">
                    <div class="form-group">
                      <!-- <div class="row form-group pr-3 pl-3"> -->

                        <div class="col mb-3">
                          <label >ชื่อเข้าระบบ <b class="text-danger"> *</b></label>
                          <input type="text" name="u_username"
                              v-validate="{ required: true, regex: /^[A-Za-z0-9]{6,15}$/ }"
                              v-model.trim="form.u_username"
                              :class="{ 'is-invalid': errors.has('u_username') }"
                              class="form-control">
                          <span class="invalid-feedback">{{ errors.first('u_username') ? 'กรุณากรอกชื่อผู้ใช้เป็นภาษาอังกฤษ (6 ตัวอักษรขึ้นไป)' : ''  }}</span>
                        </div>
                        <div class="col mb-3">
                            <label >รหัสผ่าน <b class="text-danger"> *</b></label>
                            <input type="password" name="u_password"
                                v-validate="{ required: true, regex: /^[A-Za-z0-9]{6,15}$/ }"
                                v-model.trim="form.u_password"
                                :class="{ 'is-invalid': errors.has('u_password') }"
                                class="form-control">
                            <span class="invalid-feedback">{{ errors.first('u_password') ? 'กรุณากรอกรหัสเป็นภาษาอังกฤษ A-Z,a-z,0-9 (6 ตัวขึ้นไป)' : ''  }}</span>
                        </div>
                      <!-- </div> -->

                      <div class="row form-group pr-3 pl-3">
                        <div class="col">
                        <label >ชื่อผู้ใช้งาน/ชื่อร้าน <b class="text-danger"> *</b></label>
                            <input type="text" name="u_fullname"
                                v-validate="'required'"
                                v-model.trim="form.u_fullname"
                                :class="{ 'is-invalid': errors.has('u_fullname') }"
                                class="form-control">
                            <span class="invalid-feedback">{{ errors.first('u_fullname') ? 'กรุณาใส่ชื่อจริง' : ''  }}</span>
                        </div>
                        <!-- <div class="col">
                        <label >เบอร์โทรศัพท์</label>
                            <input type="text" name="u_phone" placeholder="08xxxxxxxx"
                                :class="{ 'is-invalid': errors.has('u_phone') }"
                                v-validate="{ required: true, regex: /^[0-9]{9,10}$/ }"
                                v-model.trim="form.u_phone"
                                class="form-control">
                            <span class="invalid-feedback">ใส่ขีดด้วย {{ errors.first('u_phone') ? 'กรุณาใส่เบอร์โทรศัพท์' : ''  }}</span>
                        </div> -->
                      </div>

                      
                        <div class="col mb-3">
                            <label >อีเมล</label>
                            <input type="email" name="u_email"
                                v-model.trim="form.u_email"
                                class="form-control">
                            <!-- <span class="invalid-feedback">{{ errors.first('u_email') ? 'กรุณาใส่อีเมลให้ถูกต้อง' : ''  }}</span> -->
                        </div>

                        <div class="row form-group pr-3 pl-3">
                          <div class="col">
                              <label >ไอดีไลน์</label>
                              <input type="text" name="u_lineId"
                                  v-model.trim="form.u_lineId"
                                  class="form-control">
                          </div>
                          <div class="col">
                            <label >เบอร์โทรศัพท์ <b class="text-danger"> *</b></label>
                            <input type="text" name="u_phone" placeholder="08xxxxxxxx"
                                :class="{ 'is-invalid': errors.has('u_phone') }"
                                v-validate="{ required: true, regex: /^[0-9]{9,10}$/ }"
                                v-model.trim="form.u_phone"
                                class="form-control">
                            <span class="invalid-feedback">{{ errors.first('u_phone') ? 'กรุณาใส่เบอร์โทรศัพท์' : ''  }}</span>
                          </div>
                        </div>
                      
                      <div class="row form-group pr-3 pl-3">
                        <div class="col">
                            <label >ที่อยู่ <b class="text-danger"> *</b></label>
                            <textarea class="form-control" name="u_address"
                                v-validate="'required'"
                                v-model.trim="form.u_address"
                                :class="{ 'is-invalid': errors.has('u_address') }"
                                cols="10" rows="3"></textarea>
                            <span class="invalid-feedback">{{ errors.first('u_address') ? 'กรุณาใส่ที่อยู่' : ''  }}</span>
                        </div>
                      </div>

                      <div class="row form-group pr-3 pl-3">
                        <div class="col">
                            <label >ประเภทผู้ใช้งาน <b class="text-danger"> *</b></label>
                            <select class="form-control" id="" name="u_role"
                              v-model="form.u_role"
                              v-validate="'required'"
                              :class="{ 'is-invalid': errors.has('u_role') }">
                                <option value="selling">ร้านค้า</option>
                                <option value="user">ลูกค้า</option>
                                <option value="buying">รับซื้อสตรอว์เบอร์รี่</option>
                                <option value="farmer">เกษตกร</option>
                                <!-- <option value="admin">admin</option> -->
                            </select>
                            <span class="invalid-feedback">{{ errors.first('u_role') ? 'กรุณาเลือกประเภทผู้ใช้งาน' : ''  }}</span>
                        </div>
                      </div>

                      <div class="row form-group pr-3 pl-3" v-if="form.u_role == 'buying' || form.u_role == 'selling'">
                        <div class="col">
                            <label >กรุณาใส่รูปหน้าบัตรประจำตัวประชาชน <b class="text-danger"> *</b></label>
                            <label class="btn btn-info btn-block" >
                                <i class="fa fa-upload"></i> อัพโหลดภาพ
                                <input type="file" class="d-none" @change="onChangeFile($event.target)">
                            </label>
                            <div class="text-center" v-show="form.u_card" >
                              <img class="w-50" :src="form.u_card" :alt="form.u_id" >
                            </div>
                        </div>
                      </div>

                      <div class="row form-group pr-3 pl-3" v-if="form.u_role == 'farmer' || form.u_role == 'selling'">
                        <div class="col">
                            <label >ชื่อธนาคาร <b class="text-danger"> *</b></label>
                            <select class="form-control" name="u_bank_name"
                              v-model="form.u_bank_name"
                              v-validate="'required'"
                              :class="{ 'is-invalid': errors.has('u_bank_name') }">
                              <option v-for="item in Bank" :key="item.value" :value="item.value">
                                  {{item.name}}
                              </option>
                            </select>
                            <span class="invalid-feedback">{{ errors.first('u_bank_name') ? 'กรุณาเลือกชื่อธนาคาร' : ''  }}</span>
                        </div>
                      </div>

                      <div class="row form-group pr-3 pl-3" v-if="form.u_role == 'farmer' || form.u_role == 'selling'">
                        <div class="col">
                              <label >เลขพร้อมเพย์</label>
                              <input type="text" name="u_promptPay" 
                                  v-model.trim="form.u_promptPay"
                                  class="form-control">
                          </div>
                        <div class="col">
                            <label >เลขบัญชี <b class="text-danger"> *</b></label>
                            <input type="number" name="u_bank_acc"
                                :class="{ 'is-invalid': errors.has('u_bank_acc') }"
                                v-validate="{ required: true, regex: /^[0-9]{10,12}$/ }"
                                v-model.trim="form.u_bank_acc"
                                class="form-control">
                            <span class="invalid-feedback">{{ errors.first('u_bank_acc') ? `ตัวเลข 10-12 ตัว` : ''  }}</span>
                        </div>

                      </div>

                    </div>

                    

                    <div v-if="errorMessage" class="alert alert-warning text-center">
                        {{ errorMessage }}
                    </div>

                    <div class="form-group buttons pr-3 pl-3">
                      <div v-if="form.u_role != '' ">
                        <button @click="form.u_store = 'pending'" 
                                v-if="form.u_role === 'buying' || form.u_role === 'selling'" 
                                type="submit" class="btn btn-block btn-warning">
                            ขอการอนุมัติเปิดร้าน
                        </button>

                        <button @click="form.u_store = 'pass'" 
                                v-if="form.u_role === 'user' || 
                                      form.u_role === 'farmer' || 
                                      form.u_role === 'admin'" 
                                      type="submit"
                                      class="btn btn-info btn-block">
                            ลงทะเบียน
                        </button>
                      </div>
                        <button type="button" @click="onRedirectToLogin()" class="btn btn-secondary btn-block">
                            เข้าสู่ระบบ
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      form: {
        u_username: "",
        u_password: "",
        u_fullname: "",
        u_email: "",
        u_role: "",
        u_phone: "",
        u_lineId: "",
        u_address: "",
        u_store: "",
        u_promptPay: "",
        u_card: "",
        u_bank_acc: "",
        u_bank_name: ""
      },
      errorMessage: "",
      Bank: [
        {name: "ธนาคารกรุงเทพ", value: "BBL"},
        {name: "ธนาคารกสิกรไทย", value: "KBANK"},
        {name: "ธนาคารกรุงไทย", value: "KTB"},
        {name: "ธนาคารไทยพาณิชย์", value: "SCB"},
        {name: "ธนาคารกรุงศรีอยุธยา", value: "BAY"},
        {name: "ธนาคารเกียรตินาคิน", value: "KK"},
        {name: "ธนาคารซีไอเอ็มบีไทย", value: "CIMBT"},
        {name: "ธนาคารทิสโก้", value: "TISCO "},
        {name: "ธนาคารธนชาต", value: "TBANK"},
        {name: "ธนาคารยูโอบี", value: "UOB "},
        {name: "ธนาคารไอซีบีซี (ไทย)", value: "ICBC"},
        {name: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร", value: "BACC"},
        {name: "ธนาคารออมสิน", value: "GSB"}
      ],
    };
  },
  watch: {
    
  },
  methods: {
    // บันทึกข้อมูลลงทะเบียน
    onSubmit() {
      this.$validator.validateAll().then(valid => {
        if (!valid) return;
        this.errorMessage = "";

        let Card = true;
        if (this.form.u_role == 'buying' || this.form.u_role == 'selling') {
          if (this.form.u_card == "") {
            this.alertify.warning('กรุณาใส่รูปหน้าบัตรประชาชนด้วย!')
            Card = false;
          }
        }
        
        if (Card) {
          axios.post("api/account/register", this.form).then(res => {
            const dul = res.data
            if (dul == 'ใส่ชื่อเข้าระบบใหม่' || dul== 'มีชื่อผู้ใช้งานนี้แล้ว') this.alertify.warning(dul);
            else {
              this.onReset();
              this.onRedirectToLogin();
            }
              
          }).catch(err => (this.errorMessage = err.response.data.message));
        }
        
      });
    },
    // ล้างค่า Form
    onReset() {
      this.errorMessage = null;
      this.$validator.reset();
      this.form = {
        u_username: "",
        u_password: "",
        u_firstname: "",
        u_lastname: ""
      };
    },
    // ไปที่หน้าเข้าสู่ระบบ
    onRedirectToLogin() {
      this.$router.push({ name: "login" });
    },
    // เปลี่ยนไฟล์อัพโหลดเป็น Base64 string
    onChangeFile(input) {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        if (file.type.indexOf("image/") >= 0) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.addEventListener("load", () => {
            this.form.u_card = reader.result;
          });

          return;
        }
      }
    },
  }
};
</script>

<style scoped>
.register {
  max-width: 500px;
  margin: 3% auto;
}
.img-logo {
  width: 85%;
  display: block;
  margin: auto;
  margin-bottom: 30px;
  float: right;
}
h1 {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 5px;
}
/* .card-body {
  padding-left: 15%;
  padding-right: 15%;
} */
.buttons .btn-secondary {
  margin-top: 20px;
}
.buttons {
  margin-top: 30px;
  margin-bottom: 50px;
}

@media (max-width: 575.98px) { 
  .card-body {
    padding-left: 15px;
    padding-right: 15px;
  }
  .register {
    padding-left: 10px;
    padding-right: 10px;
  }
  .img-logo {
    width: 100%;
  }
}
</style>


