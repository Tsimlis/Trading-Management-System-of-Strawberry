<template>
    <Layout>
        <div  class="form-group">
            <router-link class="btn btn-menu" :to="{ name:'news-list' }">ข้อมูลข่าวสาร</router-link>
            <router-link class="btn btn-menu" :to="{ name:'news-form' }">เพิ่มข้อมูลใหม่</router-link>
        </div>
        <div class="card mb-3" >
            <div class="card-body">
                <header>
                  <div class="row">
                    <div class="col-sm-6"><h5><i class="fa fa-edit"></i> เพิ่ม/แก้ไข ข้อมูลข่าวสาร</h5></div>
                    <div class="col-sm-3">
                      <div class="form-check">
                        <input class="form-check-input" type="radio" name="Radios" id="Radios1" value="news" v-model="type" checked>
                        <label class="form-check-label" for="Radios1">
                          แจ้งข่าว
                        </label>
                      </div>
                    </div>
                    <!-- <div class="col-sm-3">
                      <div class="form-check">
                        <input class="form-check-input" type="radio" name="Radios" id="Radios2" value="price" v-model="type">
                        <label class="form-check-label" for="Radios2">
                          แจ้งราคา
                        </label>
                      </div>
                    </div> -->
                  </div>
                </header>
                <hr>
                
                <form @submit.prevent="onSubmit()">
                  <div class="form-group" v-show="!type">
                    <div class="form-group">
                        <label for="">เลือกประเภทการเพิ่มข่าวสาร</label>
                    </div>
                  </div>

                  <!-- ข่าวสาร -->
                  <div class="form-group" v-show="type === 'news'">
                    <div class="form-group">
                        <label for="">ชื่อหัวข้อ</label>
                        <input type="text" class="form-control" name="n_title" 
                            v-model.trim="form.n_title" 
                            v-validate="{ required: true }"
                            :class="{ 'is-invalid': errors.has('n_title') }"
                            >
                        <p class="invalid-feedback">{{ errors.first('n_title') }}</p>
                    </div>

                    <div class="form-group">
                        <label for="">รายละเอียด</label>
                        <textarea class="form-control" v-model.trim="form.n_detail" rows="4"></textarea>
                    </div>

                    <div class="input-group mb-4">
                      <div class="input-group-prepend">
                        <label class="input-group-text" for="inputGroupSelect01">อัพขึ้นเป็นข่าวหลัก</label>
                      </div>
                      <select class="custom-select" v-model.trim="form.n_profile" >
                        <option value="yes">เป็นข่าวหลัก</option>
                        <option value="no">เป็นข่าวทั่วไป</option>
                      </select>
                    </div>

                    <div class="form-group">
                        <label class="btn btn-secondary btn-block">
                            <i class="fa fa-upload"></i> อัพโหลดภาพ
                            <input type="file" class="d-none" @change="onChangeFile($event.target)">
                        </label>
                        <img class="img-fluid" :src="form.n_image || '/img/no-image.png'" alt="image">
                    </div>
                  </div>
                    

                  <!-- ส่วนของ ราคา -->
                  <div class="price" v-show="type === 'price'">
                      <div class="form-group">
                          <label for="">สตรอว์เบอร์รี่ ขนาด XXL</label>
                          <input type="number" class="form-control" name="p_xxl" 
                              v-model.trim="price.p_xxl">
                      </div>
                      <div class="form-group">
                          <label for="">สตรอว์เบอร์รี่ ขนาด XL</label>
                          <input type="number" class="form-control" name="p_xl" 
                              v-model.trim="price.p_xl">
                      </div>
                      <div class="form-group">
                          <label for="">สตรอว์เบอร์รี่ ขนาด L</label>
                          <input type="number" class="form-control" name="p_l" 
                              v-model.trim="price.p_l" >
                      </div>
                      <div class="form-group">
                          <label for="">สตรอว์เบอร์รี่ ขนาด M</label>
                          <input type="number" class="form-control" name="p_m" 
                              v-model.trim="price.p_m" >
                      </div>
                      <div class="form-group">
                          <label for="">สตรอว์เบอร์รี่ ขนาด S</label>
                          <input type="number" class="form-control" name="p_s" 
                              v-model.trim="price.p_s" >
                      </div>
                      
                  </div>  

                  <!-- btn -->
                  <div class="form-group mt-4 mb-5">
                      <div class="row">
                          <div class="col-sm-6" v-show="type === 'news'">
                              <button type="submit" class="btn btn-info btn-block mb-2" >
                                  บันทึกข้อมูล
                              </button>
                          </div>
                          <div class="col-sm-6" v-show="type === 'price'">
                              <button @click="onSave()" class="btn btn-info btn-block mb-2" >
                                  ประกาศราคา
                              </button>
                          </div>
                          
                          <div class="col-sm-6" v-show="type">
                              <router-link :to="{name: 'news-list'}" class="btn btn-danger btn-block mb-2">
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
      type: "",
      form: {
        n_title: "",
        n_detail: "",
        n_image: "",
        n_profile: ""
      },
      price : {
        p_title: "แจ้งราคา",
        p_xxl: "",
        p_xl: "",
        p_l: "",
        p_m: "",
        p_s: ""
      }
    };
  },
  mounted(){
    // ฟังกชันจาก methods
    this.UpdateItem();
  },
  watch:{
    // "$route.query.id"(){
    //   this.form = {
    //     n_title: "",
    //     n_profile: "",
    //     n_detail: "",
    //     n_image: "",
    //   },
    //   this.price = {
    //     p_title: "แจ้งราคา",
    //     p_xxl: "",
    //     p_xl: "",
    //     p_l: "",
    //     p_m: "",
    //     p_s: ""
    //   }
    //   this.$validator.reset();
    // }
  },
  methods: {
    // ทำการบันทึกข่าวไปยัง backend
    onSubmit() {
      this.$validator.validateAll().then(valid => {
        if (!valid) return;
        if (this.jquery.trim(this.form.n_image) == "")
          return this.alertify.warning("กรุณาอัพโหลดภาพ");
        //ตรวจสอบว่ามีการแก้ไข หรือเพิ่มไม
        const update = this.$router.currentRoute.query.id;
        const request = isNaN(update) ? axios.post('/api/news', this.form) //สร้างใหม่
          : axios.put(`/api/news/${update}`, this.form); //ทำการแก้ไข
          //ส่งข้อมูลไป server
        request.then(res => this.$router.push({name: "news-list"}))
        .catch(error => this.alertify.error(error.response.data.message))
      })
    },
    // บันทึกราคา
    onSave(){
      const update = this.$router.currentRoute.query.id;
      const request = isNaN(update) ? axios.post('/api/news/price', this.price) //สร้างใหม่
        : axios.put(`/api/news/price/${update}`, this.price); //ทำการแก้ไข
        //ส่งข้อมูลไป server
      request.then(res => this.$router.push({name: "news-list"}))
      .catch(error => this.alertify.error(error.response.data.message))
    },

    // เปลี่ยนไฟล์อัพโหลดเป็น Base64 string
    onChangeFile(input) {
      this.form.n_image = "";
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        if (file.type.indexOf("image/") >= 0) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.addEventListener("load", () => {
            this.form.n_image = reader.result;
          });
          return;
        }
      }
      this.alertify.warning("กรุณาเลือกภาพที่จะอัพโหลด !");
    },

    //นำข้อมูลจาก server ไปใส่ในหน้าแก้ไข
    UpdateItem(){
      const id = this.$route.query.id;
      const news = this.$route.query.news;
      this.type = news
      if(isNaN(id)) return
      if(news != 'news'){
        axios.get(`/api/news/price/${id}`).then(res => {
          const form = res.data;
          this.price.p_xxl = form.p_xxl;
          this.price.p_xl = form.p_xl;
          this.price.p_l = form.p_l;
          this.price.p_m = form.p_m;
          this.price.p_s = form.p_s;
        }).catch(() => this.$router.push({name: "news-list"}))
      } else {
        axios.get(`/api/news/${id}`).then(res => {
          const form = res.data;
          this.form.n_type = form.n_type;
          this.form.n_title = form.n_title;
          this.form.n_detail = form.n_detail;
          this.form.n_image = form.n_image;
          this.form.n_profile = form.n_profile;
        }).catch(() => this.$router.push({name: "news-list"}))
      }
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
  max-width: 350px;
  margin: auto;
}
form img {
  border: solid 1px #6c757d;
}


@media (max-width: 575.98px) { 
  
}
</style>

