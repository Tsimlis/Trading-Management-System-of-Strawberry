<template>
    <Layout>
        <div class="form-group">
            <div class="card text-center" style="background-color: #17a2b8;"><h5 class="mt-2" style="color: white;">ชื่อร้าน {{userId.u_fullname}}</h5></div>
        </div>
        
        <div class="form-group">
            <div class="row">
                <!-- กราฟวงกลม -->
                <div class="col-4">
                    <div class="card mb-3 text-center">
                        <canvas class="mb-3" id="sizeStre" ></canvas>
                        <label >ยอดขายปลีก : {{Retail.total.price}} บาท</label>
                    </div>
                </div>
                <!-- กราฟตาราง -->
                <div class="col-8">
                    <div class="card mb-3 text-center">
                        <canvas  id="priceStre" ></canvas>
                        <label >ยอดขายส่ง : {{Whole.total.price}} บาท</label>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 3 ปุ่ม -->
        <div class="form-group">
            <div class="row">
                <div class="col-4">
                    <div class="card text-center pointer" style="background-color: firebrick; height: 80px;" @click="onHistory()">
                        <h5 style="color: blanchedalmond; margin-top: 10px;">ประวัติการขาย</h5>
                        <label style="color: blanchedalmond;" >ทั้งหมด</label>
                    </div>
                </div>
                <div class="col-4">
                    <div class="card text-center pointer" style="background-color: darkgoldenrod; height: 80px;" @click="onWeek()">
                        <h5 style="color: blanchedalmond; margin-top: 10px;">ยอดขาย</h5>
                        <label style="color: blanchedalmond;">ใน 1 สัปดาห์</label>
                    </div>
                </div>
                <div class="col-4">
                    <div class="card text-center pointer" style="background-color: darkolivegreen; height: 80px;" @click="onSave()">
                        <h5 style="color: blanchedalmond; margin-top: 10px;">บันทึกประวัติ</h5>
                        <label style="color: blanchedalmond;">ยอดรวมวันนี้</label>
                    </div>
                </div>
            </div>
        </div>

        <div class="card mb-3">
            <div class="card-body">
                <header class="mb-4">
                  <h5><i class="fa fa-list-alt"></i> รายการของวันนี้</h5>
                  <label>*แสดงเฉพาะสินค้าที่จัดส่งแล้ว และรับสำเร็จ </label>
                </header>

                <div class="table-responsive">
                  <table class="table text-center text-nowrap">
                    <thead>
                        <tr>
                            <th>รายการ</th>
                            <th>ชื่อ</th>
                            <th>วัน-เวลา (ส่ง/รับ)</th>
                            <th>เป็นเงิน</th>
                            <th>สถานะ</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody> 
                      <tr v-for="item in show" :key="item.or_id">
                        <td >
                          <tr v-for="(child, index) in JSON.parse(item.or_list)" :key="item[index]"> 
                            <td class="text-left w-100" style="border-top: 0; ">
                              <div v-show="JSON.parse(child).look">
                                <b>ขายปลีก</b>
                                <tr><b>{{index + 1}}.</b> สตรอว์เบอร์รี {{JSON.parse(child).look}} </tr>
                                <tr>ราคา {{JSON.parse(child).price}} จำนวน x{{JSON.parse(child).multiply}}</tr>
                                <tr>วันทำรายการ </tr>
                                <tr>{{item.or_created | formatDate}}</tr>
                              </div>

                              <div v-show="JSON.parse(child).xxl">
                                <!-- <b>{{index + 1}}.</b>  -->
                                <b>ขายส่ง</b>
                                <tr v-show="Object(JSON.parse(child).xxl).weigth">
                                  ไซซ์ยักษ์ XXL : {{Object(JSON.parse(child).xxl).weigth}} * {{Object(JSON.parse(child).xxl).price}} บาท
                                </tr>
                                <tr v-show="Object(JSON.parse(child).xl).weigth">
                                  ไซซ์ยักษ์ XL : {{Object(JSON.parse(child).xl).weigth}} * {{Object(JSON.parse(child).xl).price}} บาท
                                </tr>
                                <tr v-show="Object(JSON.parse(child).l).weigth">
                                  ไซซ์ยักษ์ L : {{Object(JSON.parse(child).l).weigth}} * {{Object(JSON.parse(child).l).price}} บาท
                                </tr>
                                <tr v-show="Object(JSON.parse(child).m).weigth">
                                  ไซซ์ยักษ์ M : {{Object(JSON.parse(child).m).weigth}} * {{Object(JSON.parse(child).m).price}} บาท
                                </tr>
                                <tr v-show="Object(JSON.parse(child).s).weigth">
                                  ไซซ์ยักษ์ S : {{Object(JSON.parse(child).s).weigth}} * {{Object(JSON.parse(child).s).price}} บาท
                                </tr>
                                <tr v-show="Object(JSON.parse(child).mix).weigth">
                                  ไซซ์คละ : {{Object(JSON.parse(child).mix).weigth}} * {{Object(JSON.parse(child).mix).price}} บาท
                                </tr>
                                <tr v-show="Object(JSON.parse(child).drying).weigth">
                                  อบแห้ง : {{Object(JSON.parse(child).drying).weigth}} * {{Object(JSON.parse(child).drying).price}} บาท
                                </tr>
                                <tr v-show="Object(JSON.parse(child).juice).weigth">
                                  น้ำผลไม้ : {{Object(JSON.parse(child).juice).weigth}} * {{Object(JSON.parse(child).juice).price}} บาท
                                </tr>
                                <tr>วันทำรายการ </tr>
                                <tr>{{item.or_created | formatDate}}</tr>
                              </div>

                              <tr>
                                ค่าขนส่ง {{item.or_free}} บาท<br>
                                <b>จำนวนเงิน {{+Object(JSON.parse(child).total) + item.or_free}} บาท</b>
                              </tr>
                            </td>
                          </tr>
                        </td>
                        <td>{{ item.or_customer_name}}</td>
                        <td>{{ item.or_receive || item.or_created | formatDate}}</td>
                        <td>{{ item.or_pay}}</td>
                        <td >
                          <div class="col" v-if="item.or_status == 'order'" >
                            <button class="btn btn-sm btn-warning " @click="onPage()"  >
                              <i class="fa fa-times-circle"></i> รอจัดส่ง
                            </button><br>
                          
                            <!-- <button class="btn btn-sm btn-info mt-2" @click="onPage()"  >
                              <i class="fa fa-check"></i> จัดส่งพัสดุ
                            </button> -->
                          </div>

                          <div v-if="item.or_status == 'failed'" >
                            <button class="btn btn-sm btn-info" @click="onPage()" >
                              <i class="fa fa-repeat"></i> ส่งใหม่
                            </button><br>

                            <button class="btn btn-sm btn-warning mt-2" @click="onPage()" >
                              <i class="fa fa-money"></i> ชำระคืน
                            </button>
                          </div>

                          <div class="text-info" v-if="item.or_status == 'send'" >
                            <i class="fa fa-check-circle"></i> อยู่กับขนส่ง
                          </div>
                          <div class="text-success" v-if="item.or_status == 'success'" >
                            <i class="fa fa-motorcycle"></i> รับพัสดุแล้ว
                          </div>

                          <div class="text-danger" v-if="item.or_status == 'cancer'" >
                            <i class="fa fa-times-circle"></i> ยกเลิกแล้ว
                          </div>
                            
                        </td>
                        <td class="text-center">
                            <i @click="onChat(item)" class=" fa fa-comments text-success pointer"></i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div> 
                <Pagination :data="success" :page="page" @onPage="onPage($event)" />
            </div>
        </div>

        
        <HistoryDialog :history="historyItem" @onClose="historyItem = null" />
        <WeekDialog :week="weekItem" @onClose="weekItem = null" />
    </Layout>
</template>

<script>
import Layout from "@/components/Layout"
import Pagination from "@/components/Pagination"
import HistoryDialog from "./sellingHistoryDialog.vue"
import WeekDialog from "./sellingWeekDialog.vue"
import Chart from 'chart.js/auto'
import {mapState} from 'vuex'
import axios from 'axios'

export default {
    components:{
        Layout,
        Pagination,
        HistoryDialog,
        WeekDialog
    },
    data(){
        return{
            success: [],
            historyItem: null,
            weekItem: null,
            show: [],
            page: 0,            
            Retail: {
              XXL: {weigth: 0, price: 0},
              XL: {weigth: 0, price: 0},
              L: {weigth: 0, price: 0},
              M: {weigth: 0, price: 0},
              S: {weigth: 0, price: 0},
              mix: {weigth: 0, price: 0},
              drying: {weigth: 0, price: 0},
              juice: {weigth: 0, price: 0},
              total: {weigth: 0, price: 0},
            },
            Whole: {
              xxl: {weigth: 0, price: 0},
              xl: {weigth: 0, price: 0},
              l: {weigth: 0, price: 0},
              m: {weigth: 0, price: 0},
              s: {weigth: 0, price: 0},
              mix: {weigth: 0, price: 0},
              drying: {weigth: 0, price: 0},
              juice: {weigth: 0, price: 0},
              total: {weigth: 0, price: 0},
            },
            free: 0
        }
    },
    computed:{
        ...mapState({ userId: state => state.user })
    },
    watch: {
        success(value){
            Object.assign(this.success, { limit: 5 , rows: value.length});
            this.page = 1 //เมื่อข้อมุูลเข้าให้เป็นหน้าที่ 1

            // ฟังกชันคำนวนผลรวม
            this.calculate(value);
            // แทนค่าตาราง ขายส่ง
            this.table(this.Whole);
            // แทนค่าวงกลม ขายปลีก
            this.circle(this.Retail);
        },
        //  การแบ่งหน้า
        page(num){
            const end = num * this.success.limit
            const start = end - this.success.limit
            this.show = this.success.slice(start, end)
        },
    },
    mounted(){
        // ดึงรายการที่สั่งซื้อสำเร็จของร้าน
        axios.get(`/api/selling/orderDay/${this.userId.u_id}`)
            .then(res => this.success = res.data ).catch(error => this.alertify.error(error.response.data.message))
    },
    methods:{
        sum(obj){
            const sumValues = Object.values(obj)
            return sumValues;
        },
        onPage(page){
            this.page = page;
        },
        onHistory(){
            this.historyItem = this.userId
        },
        onWeek(){
            this.weekItem = this.userId
        },
        // เปลี่ยนสถานะการซื้อ
        onPage(){
          this.$router.push({ name: 'selling-express' })
        },
        onSave(){
          const listAll = {
                t_sale_id: this.userId.u_id,
                t_sale_name: this.userId.u_fullname,
                t_xxl: {retail:{    price: this.Retail.XXL.price ,
                                weigth: this.Retail.XXL.weigth },
                        whole: {  price: this.Whole.xxl.price ,
                                weigth: this.Whole.xxl.weigth }
                },
                t_xl: { retail:{    price: this.Retail.XL.price ,
                                weigth: this.Retail.XL.weigth },
                        whole: {  price: this.Whole.xl.price ,
                                weigth: this.Whole.xl.weigth }
                },
                t_l: {  retail:{    price: this.Retail.L.price ,
                                weigth: this.Retail.L.weigth },
                        whole: {  price: this.Whole.l.price,
                                weigth: this.Whole.l.weigth }
                },
                t_m: {  retail:{    price: this.Retail.M.price ,
                                weigth: this.Retail.M.weigth },
                        whole: {  price: this.Whole.m.price,
                                weigth: this.Whole.m.weigth }
                },
                t_s: {  retail:{    price: this.Retail.S.price ,
                                weigth: this.Retail.S.weigth },
                        whole: {  price: this.Whole.s.price ,
                                weigth: this.Whole.s.weigth }
                },
                t_mix: {  retail:{    price: this.Retail.mix.price ,
                                weigth: this.Retail.mix.weigth },
                        whole: {  price: this.Whole.mix.price,
                                weigth: this.Whole.mix.weigth }
                },
                t_drying: {  retail:{    price: this.Retail.drying.price ,
                                weigth: this.Retail.drying.weigth },
                        whole: {  price: this.Whole.drying.price,
                                weigth: this.Whole.drying.weigth }
                },
                t_juice: {  retail:{    price: this.Retail.juice.price ,
                                weigth: this.Retail.juice.weigth },
                        whole: {  price: this.Whole.juice.price ,
                                weigth: this.Whole.juice.weigth }
                },
                t_total: {
                    retail:{    price: this.Retail.total.price,
                                weigth: this.Retail.total.weigth },
                    whole: {  price: this.Whole.total.price ,
                                weigth: this.Whole.total.weigth }
                },
                t_free: this.free,
                t_pay: { price: this.Retail.total.price + +this.Whole.total.price}
            }
            this.alertify.warning('บันทึกประวัติ')

            // บันทึกสรุปยอดขายตอนนี้
            axios.post(`/api/selling/saveTotal`, listAll ).then( ).catch(error => this.alertify.error(error.response.data.message))
            
        },
        calculate(value){
          // แยกจำนวนคำสั่งซื้อ
          value.map((item) => {
            // แยกรายการไซซ์
            JSON.parse(Object(item).or_list).forEach((body) => {
              // console.log(JSON.parse(body))
              const store = JSON.parse(body)
              const sizeRe = ['XXL', 'XL', 'L', 'M', 'S', 'mix', 'drying', 'juice']
              const sizeWe = ['xxl', 'xl', 'l', 'm', 's', 'mix', 'drying', 'juice']

              if(store.id) {
                sizeRe.forEach((item) => {
                  if(store.look == item) {
                    this.Retail[item].weigth = store.weigth * +store.multiply
                    this.Retail[item].price = store.price * +store.multiply
                    
                    this.Retail.total.weigth += this.Retail[item].weigth
                    this.Retail.total.price += this.Retail[item].price

                    //reset
                    // this.Retail[item].price = 0
                  }
                })
              }
              if(store.xxl){
                sizeWe.forEach((item) => {
                  Object.keys(store).forEach((body) => {
                    if(body == item) {
                      this.Whole[item].weigth += +store[item].weigth
                      this.Whole[item].price += +store[item].price * store[item].weigth

                      this.Whole.total.weigth += this.Whole[item].weigth
                      this.Whole.total.price += this.Whole[item].price
                    }
                  })
                })
              }
            })
            // ราคาจัดส่งตามแต่ละคำสั่งซื้อ
            this.free += +Object(item).or_free
          })  
        },
        table(value){
          // ตาราง bar
          var ctx = document.getElementById('priceStre');
          var priceStre = new Chart(ctx, {
              type: 'bar',
              data: {
                  labels: ['ไซซ์ยักษ์ XXL', 'ไซซ์จัมโบ้ XL', 'ไซซ์ใหญ่ L', 'ไซซ์กลาง M', 'ไซซ์เล็ก S', 'ไซซ์คละ', 'อบแห้ง', 'น้ำผลไม้'],
                  datasets: [ {
                      label: 'น้ำหนัก',
                      data: [value.xxl.weigth, value.xl.weigth, value.l.weigth, value.m.weigth, value.s.weigth, value.mix.weigth, value.drying.weigth, value.juice.weigth],
                      backgroundColor: "rgba(71, 183,132, 0.5)",
                      borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                        'rgb(201, 203, 207)',
                        'rgba(190, 150, 80)'
                      ],
                      borderWidth: 2
                  },{
                      label: 'ยอดขาย',
                      data: [value.xxl.price, value.xl.price, value.l.price, value.m.price, value.s.price, value.mix.price, value.drying.price, value.juice.price],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(255, 205, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(201, 203, 207, 0.5)',
                        'rgba(190, 150, 80, 0.5)'
                      ],
                      borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                        'rgb(201, 203, 207)',
                        'rgba(190, 150, 80)'
                      ],
                      borderWidth: 2
                  } ]
              },
              options: {
              plugins: {
                // title: {
                //   display: true,
                //   text: 'หัวข้อตาราง'
                // },
              },
              responsive: true,
              interaction: {
                intersect: false,
              },
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true
                }
              }
            }
          });
        },
        circle(value){
          // กราฟวงกลม
          var ctx = document.getElementById('sizeStre');
          var sizeStre = new Chart(ctx, {
              type: 'doughnut',
              data: {
                  labels: [`XXL :${value.XXL.price}`, `XL :${value.XL.price}`, `L :${value.L.price}`, `M :${value.M.price}`, `S :${value.S.price}`, `mix :${value.mix.price}`, `dring :${value.drying.price}`, `juice :${value.juice.price}`],
                  datasets: [{
                      label: 'ยอดขาย',
                      data: [value.XXL.weigth, value.XL.weigth, value.L.weigth, value.M.weigth, value.S.weigth, value.mix.weigth, value.drying.weigth, value.juice.weigth],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(255, 205, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(201, 203, 207, 0.5)',
                        'rgba(190, 150, 80, 0.5)'
                      ],
                      borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                        'rgb(201, 203, 207)',
                        'rgba(190, 150, 80)'
                      ],
                      borderWidth: 3
                  }]
              },
              options: {
                  responsive: true
              }
          });
        },
    }
}
</script>

<style scoped>
.btn-menu {
  color: #ffffff;
  background-color: #ced4da;
  margin-right: 7px;
  min-width: 130px;
}
</style>