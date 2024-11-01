<template>
  <div class="home">
    <Layout>
          <div class="form-group mb-5">

            <div class="cont">
              <div class="modal_con text-center zoomingBox">
                <h2>ยินดีต้อนรับ</h2>
                <p class="terms">
                  ทุกท่านที่ซื้อผลผลิตสตรอว์เบอร์รี่
                </p>
                <button type="button" class="accept-button">ชุมชนสตรอว์เบอร์รี่</button>
              </div>
            </div>

              <!-- <div class="col aline-center p-0 mb-3"> -->
                <!-- ภาพโปรไฟล์หลัก -->
                <!-- <div id="carousel" class="carousel slide" data-ride="carousel">
                  <div class="carousel-inner">
                    <div class="carousel-item active">
                      <img class="rounded mx-auto d-block w-100 img-show " :src="'/strawberry/strawHome.jpg' || '/img/no-image.png'" alt="First slide">
                      <div class="carousel-caption d-none d-md-block">
                        <h5>ชุมชนสตรอว์เบอร์รี</h5>
                        <p>ยินดีต้อนรับทุกท่าน</p>
                      </div>
                    </div>
                    <div  v-for="item in news.result" :key="item.n_title" >
                      <div class="carousel-item " v-if="item.n_profile === 'yes'">
                        <img class="rounded mx-auto d-block img-show" :src="`/api/uploads/${item.n_image}`" :alt="item.n_id">
                        <div class="carousel-caption d-none d-md-block">
                          <h5>{{item.n_title}}</h5>
                          <p>{{item.n_detail}}</p>
                        </div>
                      </div>
                      
                    </div>
                  </div> -->
                  <!-- <a class="carousel-control-prev" href="#carousel" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                  </a>
                  <a class="carousel-control-next" href="#carousel" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                  </a> -->
                <!-- </div>
              </div> -->

            <!-- Nav news -->
            <ul class="nav nav-tabs mb-4" id="myTab" role="tablist">
              <li class="nav-item">
                <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">หน้าหลัก</a>
              </li>
              <li class="nav-item" v-show="userRole != 'user'">
                <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">ราคากลาง</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">ติดต่อ</a>
              </li>
            </ul>
            <div class="tab-content ml-3 mr-3 p-3 modal_news" id="myTabContent">
              <!-- ข่าวสาร -->
              <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                <h3 class="text-center mb-5 text-info"  >ข่าวทั่วไป</h3>

                <!-- card image-->
                <div class="form-group mt-5" >
                  <div class="row" >
                    <div class="col-sm-4 mb-3" v-for="item in news.result" :key="item.n_id" v-show="item.n_profile === 'no'" >
                      <figure class="figure pl-5" > <!--  style="float: right;" -->
                        <!-- <img class="img-fluid" :src="item.n_image || '/img/no-image.png'" alt="image" v-show="item.n_type === 'price'"> -->
                        <img  :src="`/api/uploads/${item.n_image}`" :alt="item.n_title" 
                              class="figure-img img-fluid rounded img-thumbnail w-75 zoomingBox" 
                              @click="go(item)">
                        <figcaption class="figure-caption pl-3">
                          <b>{{For(item.n_title)}}</b><br>
                          <h6 style="max-width: 330px;">{{For(item.n_detail)}}...</h6>
                          <h6>{{item.n_created | formatDate}}</h6>
                        </figcaption>
                      </figure>
                      
                    </div>
                  </div>
                </div>
              </div>

              <!-- ราคากลาง -->
              <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab" v-show="userRole != 'user'">
                <div >
                  <h3 class="text-center mb-3 text-info" ></h3>  <!-- ใส่ชื่อหัวข้อ -->
                  <!-- <h5>{{price.p_title}}</h5> -->

                  <!-- <div class="form-group mt-5">
                    <div class="row">
                      <div class="col-6 text-right pr-5 zoomingBox"><img class="img-fluid" :src="'/strawberry/sizeXXL.png' || '/img/no-image.png'" alt="image"></div>
                      <div class="col-6 mt-5 pl-5"><h4>สตรอว์เบอร์รีไซซ์ XXL </h4><h4>ราคา {{price.p_xxl}}  บาท</h4></div>
                    </div>
                  </div>
                  <div class="form-group mt-5">
                    <div class="row">
                      <div class="col-6 text-center zoomingBox"><img class="img-fluid" :src="'/strawberry/sizeXL.jpg' || '/img/no-image.png'" alt="image"></div>
                      <div class="col-6 mt-5 pl-5"><h4>สตรอว์เบอร์รีไซซ์ XL </h4><h4>ราคา {{price.p_xl}}  บาท</h4></div>
                    </div>
                  </div> -->

                  <!-- <label>ราคาเมื่อ{{scrap.date}}</label> -->
                  <div class="form-group mt-5">
                    <div class="row">
                      <div class="col-3 text-right zoomingBox"><img class="img-fluid" :src="'/strawberry/sizeL.jpg' || '/img/no-image.png'" alt="image"></div>
                      <div class="col-3 text-right pr-5 zoomingBox"><img class="img-size" :src="'/strawberry/size_L.png' || '/img/no-image.png'" alt="image"></div>
                      <div class="col-6 mt-5 pl-5"><h4>สตรอว์เบอร์รีไซซ์ L </h4>
                        <!-- <div v-show="scrap.p1 == null"><h4>ราคา {{price.p_l}}  บาท</h4></div> -->
                        <div v-show="scrap.p1 == null"><label>..กำลังโหลดข้อมูล</label></div>
                        <div v-show="scrap.p1 != null"><h4>ราคา {{scrap.p1}}  บาท</h4><label>(ราคากลางตลาดสี่มุมเมือง)</label></div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group mt-5">
                    <div class="row">
                      <div class="col-3 text-right zoomingBox"><img class="img-fluid" :src="'/strawberry/sizeM.jpg' || '/img/no-image.png'" alt="image"></div>
                      <div class="col-3 text-right pr-5 zoomingBox"><img class="img-size" :src="'/strawberry/size_M.png' || '/img/no-image.png'" alt="image"></div>
                      <div class="col-6 mt-5 pl-5"><h4>สตรอว์เบอร์รีไซซ์ M </h4>
                        <!-- <div v-show="scrap.p2 == null"><h4>ราคา {{price.p_m}}  บาท</h4></div> -->
                        <div v-show="scrap.p1 == null"><label>..กำลังโหลดข้อมูล</label></div>
                        <div v-show="scrap.p2 != null"><h4>ราคา {{scrap.p2}}  บาท</h4><label>(ราคากลางตลาดสี่มุมเมือง)</label></div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group mt-5">
                    <div class="row">
                      <div class="col-3 text-right zoomingBox"><img class="img-fluid" :src=" '/strawberry/sizeS.png' || '/img/no-image.png'" alt="image"></div>
                      <div class="col-3 text-right pr-5 zoomingBox"><img class="img-size" :src=" '/strawberry/size_S.png' || '/img/no-image.png'" alt="image"></div>
                      <div class="col-6 mt-5 pl-5"><h4>สตรอว์เบอร์รีไซซ์  S </h4>
                        <!-- <div v-show="scrap.p3 == null"><h4>ราคา {{price.p_s}}  บาท</h4></div> -->
                        <div v-show="scrap.p1 == null"><label>..กำลังโหลดข้อมูล</label></div>
                        <div v-show="scrap.p3 != null"><h4>ราคา {{scrap.p3}}  บาท</h4><label>(ราคากลางตลาดสี่มุมเมือง)</label></div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>

              <!-- ติดต่อ -->
              <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                <h3  class="text-center mb-5 text-info"  >ติดต่อ</h3>
              </div>

            </div>
          </div>
          <News :news="newsItem" @onClose="newsItem = null" />
            
    </Layout>
  </div>
</template>

<script>
import Layout from "../components/Layout";
import News from "@/components/NewsDetail.vue"
import {mapState} from 'vuex'
import axios from 'axios'


export default {
  name: "home",
  data(){
    return{
      users: {},
      userRole: "",
      page: 1,
      price: {},
      scrap: {},
      newsItem: {}
    }
  },
  components: {
    Layout,
    News
  },
  computed: {
      ...mapState(['news'])
  },
  watch: {
    scrap(p){
      if (p == null) this.scraping()
    }
  },
   mounted() {
      this.$store.dispatch("set_news");
      const p = {}
      axios.get(`/api/news/price?page=${this.page}`).then(res => {
        this.price = res.data.result[0]
        }).catch(error => this.alertify.error(error.response.data.message))
      
      // ดึงข้อมูลจากหน้าเว็บ ตลาดสี่มุมเมือง
      this.scraping();
  },
  created() {
    this.userRole = this.$store.state.user.u_role
  //   // ตั้งหน้าแรกของผู้เข้าที่เป็น admin
  //   if(userRole && userRole === 'admin') this.$router.push({ name: "booking-calendar" });
  //   // ตั้งหน้าแรกของผู้เข้าที่เป็น user
  //   else this.$router.push({ name:'booking-list' });
  },
  methods: {
    scraping(){
      axios.get('/api/scraping/straw_price')
        .then(res => this.scrap = res.data ).catch(error => this.alertify.error(error.response.data.message))
    },
    For(word) {
      return word.substring(0, 30)
    },
    go(item){
      this.newsItem = item;
    }
  }
};
</script>

<style scoped>
.img-fluid{
  /* max-width: 50%; */
  border-radius: 10px;
  height: 200px;
  width: 300px;
}
.img-size{
  border-radius: 10px;
  height: 200px;
}
.img-show {
  max-width: 50%;
  height: 300px;
}
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
a {
  color: #6C757D;
}
.nav-tabs .nav-link.active  {
  background-color: #eeeeee;
  border-color: #dee2e6 #dee2e6 #17A2B8;
}
.modal_news {
  /* margin: 23px;
  max-width: 50%; */
  /* padding: 1rem 2rem; */
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.4); 
  border-radius: 0.25rem;
}



.cont {
  /* border-radius: 10px; */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  /* background-image: url(https://images.unsplash.com/photo-1553949345-eb786bb3f7ba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80); */
  /* background-image: url(/img/staw_home.jpeg); */
  background-image: url(/strawberry/home_01.jpg);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

.modal_con {
  /* margin: 23px; */
  max-width: 50%;
  padding: 2rem 3rem;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
 background-color: rgba(255, 255, 255, 0.4); 
  border-radius: 0.25rem;
}

.accept-button {
  background-color: #00b894;
  color: #fff;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  border: none;
  outline: none;
}


</style>