<template>
    <div class="login">
      <div class="row">
        <div class="col-4 p-0"><img src="/img/strawLOGO.ico" alt="straw" class="img-logo w-75 zoomingBox"></div>
        <div class="col-8 p-0 mt-4"><img src="/img/logo.svg" alt="Logo" class=""></div>
      </div>
        
        <div class="card shadow-lg">
            <h1 class="card-header">
                เข้าสู่ระบบ
            </h1>
            <div class="card-body ">
                <form @submit.prevent="onSubmit()">
                    <div class="form-group">
                        <label for="">ชื่อผู้ใช้งาน</label>
                        <input type="text" name="u_username"
                            v-validate="{ required: true }"
                            v-model.trim="form.u_username"
                            :class="{ 'is-invalid': errors.has('u_username') }"
                            class="form-control">
                        <span class="invalid-feedback">{{ errors.first('u_username') ? 'กรุณากรอกชื่อผู้ใช้งาน' : ''  }}</span>
                    </div>

                    <div class="form-group">
                        <label for="">รหัสผ่าน</label>
                        <input type="password" name="u_password"
                            v-validate="{ required: true }"
                            v-model.trim="form.u_password"
                            :class="{ 'is-invalid': errors.has('u_password') }"
                            class="form-control">
                        <span class="invalid-feedback">{{ errors.first('u_password') ? 'กรุณากรอกรหัสใหม่' : '' }}</span>
                    </div>

                    <div v-if="errorMessage == 'Invalid username or password'" class="alert alert-warning text-center">
                        กรุณาตรวจสอบชื่อและรหัสผ่านเข้าใช้ให้ถูกต้อง
                    </div>

                    <div class="form-group buttons text-center">
                        <button type="submit" class="btn btn-info btn-block">
                            เข้าสู่ระบบ
                        </button>

                        <button type="button" @click="onRedirectToRegister()" class="btn btn-secondary btn-block">
                            ลงทะเบียน
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
        u_password: ""
      },
      errorMessage: "",
      cout: 0
    };
  },
  methods: {
    // ส่งข้อมูลไปตรวจสอบ
    onSubmit() {
      this.$validator.validateAll().then(valid => {
        if (!valid) return;

        axios.post("api/account/login", this.form).then(res => {
            this.$router.push({ name: "home" });
          }).catch(err => {
            (this.errorMessage = err.response.data.message);
            this.cout++
            if (this.errorMessage == 'Invalid username or password' && this.cout > 2) {
              this.alertify.warning('ตรวจสอบชื่อและรหัสผ่านเข้าใช้ หรือร้านรับซื้อและร้านขายอาจต้องรอการอนุมัติเปิดร้าน')
            }
            
          });
      });
    },
    // ล้างค่า Form
    onReset() {
      this.errorMessage = null;
      this.$validator.reset();
      this.form = {
        u_username: "",
        u_password: ""
      };
    },
    // ไปที่หน้าเข้าลงทะเบียน
    onRedirectToRegister() {
      this.$router.push({ name: "register" });
    }
  }
};
</script>

<style scoped>
.login {
  max-width: 500px;
  margin: 3% auto;
}
.img-logo {
  /* max-width: 100%; */
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
.card-body {
  padding-left: 15%;
  padding-right: 15%;
}
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
  .login {
    padding-left: 10px;
    padding-right: 10px;
  }
  .img-logo {
    width: 100%;
  }
}
</style>


