<template>
    <Layout>
        <div class="form-group">
            <div class="card text-center" style="background-color: #17a2b8;"><h5 class="mt-2" style="color: white;"> {{userId.u_fullname}}</h5></div>
        </div>
        
        <div class="form-group">
            <div class="row">
                <!-- กราฟวงกลม -->
                <div class="col-4">
                    <div class="card mb-3 text-center">
                        <canvas class="mb-3" id="sizeStre" ></canvas>
                        <label >จำนวนรับซื้อวันนี้ : {{totalWeigthAll + totalWeigthAll_2}} กก.</label>
                    </div>
                </div>
                <!-- กราฟตาราง -->
                <div class="col-8">
                    <div class="card mb-3 text-center">
                        <canvas  id="priceStre" ></canvas>
                        <label for="">รวมยอดรายจ่ายวันนี้ : {{(totalAll + totalAll_2).toLocaleString()}} บาท</label>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 3 ปุ่ม -->
        <div class="form-group">
            <div class="row">
                <div class="col-4">
                    <div class="card text-center pointer" style="background-color: firebrick; height: 80px;" @click="onHistory()">
                        <h5 style="color: blanchedalmond; margin-top: 10px;">ประวัติการซื้อ</h5>
                        <label style="color: blanchedalmond;" >ทั้งหมด</label>
                    </div>
                </div>
                <div class="col-4">
                    <div class="card text-center pointer" style="background-color: darkgoldenrod; height: 80px;" @click="onWeek()">
                        <h5 style="color: blanchedalmond; margin-top: 10px;">ยอดการซื้อ</h5>
                        <label style="color: blanchedalmond;">ใน 1 สัปดาห์</label>
                    </div>
                </div>
                <div class="col-4">
                    <div class="card text-center pointer" style="background-color: darkolivegreen; height: 80px;" @click="onSave()">
                        <h5 style="color: blanchedalmond; margin-top: 10px;">บันทึก</h5>
                        <label style="color: blanchedalmond;">ยอดรวมวันนี้</label>
                    </div>
                </div>
            </div>
        </div>

        <!-- ตารางรายการ -->
        <div class="card mb-3" style="margin-top: 30px;">
            <div class="card-body">
                <header class="mb-4">
                    <h5><i class="fa fa-list-alt"></i> รายการรับซื้อ</h5>
                </header>

                <div class="table-responsive text-nowrap">
                  <table class="table text-center">
                    <thead>
                        <tr>
                            <th>ชื่อ</th>
                            <th>XXL<br>(กก/บาท)</th>
                            <th>XL<br>(กก/บาท)</th>
                            <th>L<br>(กก/บาท)</th>
                            <th>M<br>(กก/บาท)</th>
                            <th>S<br>(กก/บาท)</th>
                            <th>รวม (บาท)</th>
                            <th>สถานะ</th>
                            <th>วัน-เวลา</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in farmer" :key="item.f_id" > 
                            <td>{{item.f_name}}</td>
                            <td>{{item.f_weigth_xxl}} * {{item.f_price_xxl}}</td>
                            <td>{{item.f_weigth_xl}} * {{item.f_price_xl}}</td>
                            <td>{{item.f_weigth_l}} * {{item.f_price_l}}</td>
                            <td>{{item.f_weigth_m}} * {{item.f_price_m}}</td>
                            <td>{{item.f_weigth_s}} * {{item.f_price_s}}</td>
                            <td>{{totalOnTable[index]}}</td>
                            <td class="text-left">
                                <label class="btn btn-warning" v-if=" item.f_order == 'allowed'" @click="onPay(item)" ><i class="fa fa-hourglass"></i> รอชำระ</label>
                                <label class="badge badge-success" v-if=" item.f_order == 'success' " ><i class="fa fa-check-square-o"></i> ชำระแล้ว</label>
                                <!-- <label class="badge badge-danger" v-if=" item.f_order == 'not allowed' " ><i class="fa fa-window-close"></i> ยกเลิก</label> -->
                            </td>
                            <td>{{item.f_created | formatDate}}</td>
                        </tr>
                    </tbody>

                    <thead style="margin-top: 10px;">
                        <tr>
                            <th></th>
                            <th>{{sumPrice_xxl}} บาท<br>{{sumWeigth_xxl}} กก.</th>
                            <th>{{sumPrice_xl}} บาท<br>{{sumWeigth_xl}} กก.</th>
                            <th>{{sumPrice_l}} บาท<br>{{sumWeigth_l}} กก.</th>
                            <th>{{sumPrice_m}} บาท<br>{{sumWeigth_m}} กก.</th>
                            <th>{{sumPrice_s}} บาท<br>{{sumWeigth_s}} กก.</th>
                            <th>จำนวนทั้งสิ้น<br>{{totalWeigthAll}} กก.</th>
                            <th>{{totalAll.toLocaleString()}} บาท</th>
                            <th></th>
                        </tr>
                    </thead>

                  </table>
                </div>
            </div>
        </div>
        <br>

        <!-- ตารางซื้อเพิ่มเติม -->
        <label v-show="present">* &nbsp;รายการรับซื้อจากการโพสต์ขายของเกษตรกร</label>
        <div class="card">
            <div class="card-body">
                <header class="mb-4">
                    <h5><i class="fa fa-list-ol"></i> รายการรับซื้อเพิ่มเติม</h5>
                </header>

                <div class="table-responsive text-nowrap">
                  <table class="table text-center">
                    <thead>
                        <tr>
                            <th>ชื่อ</th>
                            <th>XXL<br>(กก/บาท)</th>
                            <th>XL<br>(กก/บาท)</th>
                            <th>L<br>(กก/บาท)</th>
                            <th>M<br>(กก/บาท)</th>
                            <th>S<br>(กก/บาท)</th>
                            <th>รวม (บาท)</th>
                            <th>สถานะ</th>
                            <th>วัน-เวลา</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        <tr v-for="(item, index) in present" :key="item.f_id" > 
                            <td>{{item.fp_name}}</td>
                            <td>{{convert(item.fp_price_xxl).weigth}} * {{convert(item.fp_price_xxl).price}}</td>
                            <td>{{convert(item.fp_price_xl).weigth}} * {{convert(item.fp_price_xl).price}}</td>
                            <td>{{convert(item.fp_price_l).weigth}} * {{convert(item.fp_price_l).price}}</td>
                            <td>{{convert(item.fp_price_m).weigth}} * {{convert(item.fp_price_m).price}}</td>
                            <td>{{convert(item.fp_price_s).weigth}} * {{convert(item.fp_price_s).price}}</td>
                            <td>{{totalOnTable_2[index]}}</td>
                            <td class="text-left">
                                <label class="btn btn-warning" v-if=" item.fp_exp == 'allowed'" ><i class="fa fa-hourglass"></i> รอชำระ</label>
                                <label class="badge badge-success" v-if=" item.fp_exp == 'success' " ><i class="fa fa-check-square-o"></i> ชำระแล้ว</label>
                                <!-- <label class="badge badge-danger" v-if=" item.f_order == 'not allowed' " ><i class="fa fa-window-close"></i> ยกเลิก</label> -->
                            </td>
                            <td>{{item.fp_created | formatDate}}</td>
                        </tr>
                    </tbody>

                    <thead style="margin-top: 10px;">
                        <tr>
                            <th></th>
                            <th>{{sum2Price_xxl}} บาท<br>{{sum2Weigth_xxl}} กก.</th>
                            <th>{{sum2Price_xl}} บาท<br>{{sum2Weigth_xl}} กก.</th>
                            <th>{{sum2Price_l}} บาท<br>{{sum2Weigth_l}} กก.</th>
                            <th>{{sum2Price_m}} บาท<br>{{sum2Weigth_m}} กก.</th>
                            <th>{{sum2Price_s}} บาท<br>{{sum2Weigth_s}} กก.</th>
                            <th>จำนวนทั้งสิ้น<br>{{totalWeigthAll_2}} กก.</th>
                            <th>{{totalAll_2.toLocaleString()}} บาท</th>
                            <th></th>
                        </tr>
                    </thead>

                  </table>
                </div>
            </div>
        </div>

        <PayDialog :pay="payItem" @onClose="payItem = null" />
        <HistoryDialog :history="historyItem" @onClose="historyItem = null" />
        <WeekDialog :week="weekItem" @onClose="weekItem = null" />
    </Layout>
</template>

<script>
import Layout from "@/components/Layout"
import Pagination from "@/components/Pagination"
import PayDialog from "./buyPayDialog.vue"
import HistoryDialog from "./buyHistoryDialog.vue"
import WeekDialog from "./buyWeekDialog.vue"
import Chart from 'chart.js/auto'
import {mapState} from 'vuex'
import axios from 'axios'

export default {
    components:{
        Layout,
        Pagination,
        PayDialog,
        HistoryDialog,
        WeekDialog
    },
    data(){
        return{
            payItem: null,
            historyItem: null,
            weekItem: null,
            weigth: [],
            totalOnTable: [],
            totalOnTable_2: [],
            farmer: {},
            calculate: {},
            present: {},

            sumWeigth_xxl: 0,
            sumWeigth_xl: 0,
            sumWeigth_l: 0,
            sumWeigth_m: 0,
            sumWeigth_s: 0,
            sumPrice_xxl: 0,
            sumPrice_xl: 0,
            sumPrice_l: 0,
            sumPrice_m: 0,
            sumPrice_s: 0,
            totalAll: 0,
            totalWeigthAll: 0,
            
            sum2Weigth_xxl: 0,
            sum2Weigth_xl: 0,
            sum2Weigth_l: 0,
            sum2Weigth_m: 0,
            sum2Weigth_s: 0,
            sum2Price_xxl: 0,
            sum2Price_xl: 0,
            sum2Price_l: 0,
            sum2Price_m: 0,
            sum2Price_s: 0,
            totalAll_2: 0,
            totalWeigthAll_2: 0
        }
    },
    computed:{
        ...mapState({
            userId: state => state.user
        }),
    },
    watch: {
        weigth(weigth){
            if(!weigth) return
            this.showCircle(weigth[0]);
            this.onWeigth(weigth[0]);
        },
        farmer(value){
            if(!value) return
            this.totalFarmer(value);
        },
        calculate(newValue) {
            if(!newValue) return
            this.sumAll(newValue);
            this.showBar();
        },
        present(value){
            if(!value) return
            this.totalFarmer_2(value);
        },
    },
    mounted(){
        // ดึงข้อมูลตาราง 1 เกษตรกรต้องการขายให้กับร้านรับซื้อนี้ที่เข้ามา 
        axios.get(`/api/buying/farmer/${this.userId.u_id}`)
            .then(res => this.farmer = res.data).catch(error => this.alertify.error(error.response.data.message))
        // แสดงข้อมูลตาราง 2 ซื้อจากการโพสต์ของเกษตรกร
        axios.get(`/api/buying/farmerPost/${this.userId.u_id}`)
            .then(res => this.present = res.data).catch(error => this.alertify.error(error.response.data.message))
        // //  ดึงข้อมูลที่ชำระเงินแล้วมาคำนวนยอด
        axios.get(`/api/buying/calculate/${this.userId.u_id}`)
            .then(res => this.calculate = res.data).catch(error => this.alertify.error(error.response.data.message))
        // รวมน้ำหนักของแต่ละขนาด มาแสดง
        axios.get(`/api/buying/sumWeigth/${this.userId.u_id}`)
            .then(res => this.weigth = res.data).catch(error => this.alertify.error(error.response.data.message))
        
    },
    methods:{
        convert(item) {
        return JSON.parse(item);
        },
        onPay(item){
            this.payItem = item
        },
        onHistory(){
            this.historyItem = this.userId
        },
        onWeek(){
            this.weekItem = this.userId
        },
        onSave(){
            const listAll = {
                t_buy_id: this.userId.u_id,
                t_buy_name: this.userId.u_fullname,
                t_xxl: {normal:{    price: this.sumPrice_xxl ,
                                weigth: this.sumWeigth_xxl },
                        adjunct: {  price: this.sum2Price_xxl ,
                                weigth: this.sum2Weigth_xxl }
                },
                t_xl: { normal:{    price: this.sumPrice_xl ,
                                weigth: this.sumWeigth_xl },
                        adjunct: {  price: this.sum2Price_xl ,
                                weigth: this.sum2Weigth_xl }
                },
                t_l: {  normal:{    price: this.sumPrice_l ,
                                weigth: this.sumWeigth_l },
                        adjunct: {  price: this.sum2Price_l ,
                                weigth: this.sum2Weigth_l }
                },
                t_m: {  normal:{    price: this.sumPrice_m ,
                                weigth: this.sumWeigth_m },
                        adjunct: {  price: this.sum2Price_m ,
                                weigth: this.sum2Weigth_m }
                },
                t_s: {  normal:{    price: this.sumPrice_s ,
                                weigth: this.sumWeigth_s },
                        adjunct: {  price: this.sum2Price_s ,
                                weigth: this.sum2Weigth_s }
                },
                t_total: {
                    normal:{    price: this.totalAll,
                                weigth: this.totalWeigthAll },
                    adjunct: {  price: this.totalAll_2 ,
                                weigth: this.totalWeigthAll_2 }
                },
                t_pay: { normal: this.totalAll, adjunct: this.totalAll_2 }
            }
            
            this.alertify.warning('บันทึกประวัติ')
            
            axios.post(`/api/buying/totalBuy/${this.userId.u_id}`, listAll ).then( ).catch(error => this.alertify.error(error.response.data.message))
        },
        sumAll(Value){
            const total = []
            Value.map((item) => {
                total.push((item.f_weigth_xxl * item.f_price_xxl) +
                            (item.f_weigth_xl * item.f_price_xl) +
                            (item.f_weigth_l * item.f_price_l) +
                            (item.f_weigth_m * item.f_price_m) +
                            (item.f_weigth_s * item.f_price_s) ) 

                this.sumPrice_xxl += (item.f_weigth_xxl * item.f_price_xxl) 
                this.sumPrice_xl += (item.f_weigth_xl * item.f_price_xl) 
                this.sumPrice_l += (item.f_weigth_l * item.f_price_l) 
                this.sumPrice_m += (item.f_weigth_m * item.f_price_m) 
                this.sumPrice_s += (item.f_weigth_s * item.f_price_s) 
            })
            this.totalAll = total.reduce((partialSum, a) => partialSum + a, 0);
        },
        totalFarmer(Value){
            Value.map((item) => {
                this.totalOnTable.push(
                    (item.f_weigth_xxl * item.f_price_xxl) +
                    (item.f_weigth_xl * item.f_price_xl) +
                    (item.f_weigth_l * item.f_price_l) +
                    (item.f_weigth_m * item.f_price_m) +
                    (item.f_weigth_s * item.f_price_s) ) 
            })
        },
        totalFarmer_2(value){
            value.map((item) => {
                const xxl = JSON.parse(item.fp_price_xxl)
                const xl = JSON.parse(item.fp_price_xl)
                const l = JSON.parse(item.fp_price_l)
                const m = JSON.parse(item.fp_price_m)
                const s = JSON.parse(item.fp_price_s)

                this.totalOnTable_2.push( (xxl.weigth * xxl.price) + (xl.weigth * xl.price) + (l.weigth * l.price) + (m.weigth * m.price) + (s.weigth * s.price) );
                
                this.sum2Price_xxl += +(xxl.price * xxl.weigth)
                this.sum2Price_xl += +(xl.price * xl.weigth)
                this.sum2Price_l += +(l.price * l.weigth)
                this.sum2Price_m += +(m.price * m.weigth)
                this.sum2Price_s += +(s.price * s.weigth)

                this.sum2Weigth_xxl += +xxl.weigth
                this.sum2Weigth_xl += +xl.weigth
                this.sum2Weigth_l += +l.weigth
                this.sum2Weigth_m += +m.weigth
                this.sum2Weigth_s += +s.weigth
            })
            this.totalAll_2 = this.totalOnTable_2.reduce((partialSum, a) => partialSum + a, 0);
            this.totalWeigthAll_2 = (this.sum2Weigth_xxl + this.sum2Weigth_xl + this.sum2Weigth_l + this.sum2Weigth_m + this.sum2Weigth_s)
        },
        onWeigth(weigth){
            this.totalWeigthAll = Object.values(weigth).reduce((acc, value) => acc + value, 0);

            this.sumWeigth_xxl = weigth.total_xxl
            this.sumWeigth_xl = weigth.total_xl
            this.sumWeigth_l = weigth.total_l
            this.sumWeigth_m = weigth.total_m
            this.sumWeigth_s = weigth.total_s
        },
        showCircle(weigth){
            const xxl = (weigth.total_xxl + this.sum2Weigth_xxl)
            const xl = (weigth.total_xl + this.sum2Weigth_xl)
            const l = (weigth.total_l + this.sum2Weigth_l)
            const m = (weigth.total_m + this.sum2Weigth_m)
            const s = (weigth.total_s + this.sum2Weigth_s)


            // วงกลม
            var ctx = document.getElementById('sizeStre');
            var sizeStre = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: [`XXL: ${xxl | 0} กก`, `XL: ${xl | 0} กก`, `L : ${l | 0} กก`, `M : ${m | 0} กก`, `S : ${s | 0} กก`],
                    datasets: [{
                        label: 'ยอดซื้อ',
                        data: [ xxl, xl, l, m, s ] ,
                        backgroundColor: [  'rgba(255, 99, 132, 0.8)',
                                            'rgba(54, 162, 235, 0.8)',
                                            'rgba(255, 206, 86, 0.8)',
                                            'rgba(75, 192, 192, 0.8)',
                                            'rgba(153, 102, 255, 0.8)' ],
                        borderColor: [  'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)' ],
                        borderWidth: 3
                    }]
                },
                options: {
                    responsive: true
                },
            });
        },
        showBar(){
             // ตาราง bar
            var ctx = document.getElementById('priceStre');
            var priceStre = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['ไซซ์ยักษ์ XXL', 'ไซซ์จัมโบ้ XL', 'ไซซ์ใหญ่ L', 'ไซซ์กลาง M', 'ไซซ์เล็ก S'],
                    datasets: [{
                        label: 'ยอดซื้อวันนี้',
                        data: [(this.sumPrice_xxl + this.sum2Price_xxl), (this.sumPrice_xl + this.sum2Price_xl), (this.sumPrice_l + this.sum2Price_l), 
                                (this.sumPrice_m + this.sum2Price_m), (this.sumPrice_s + this.sum2Price_s)],
                        backgroundColor: "rgba(71, 183,132,.5)",
                        borderColor: [  'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)' ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        },
        sendData(data) {
            axios.post(`/api/buying/sendAuto/${this.userId.u_id}`, data)
                .then(res => console.log(res.data)).catch(error => this.alertify.error(error.respose.data.message) )
        }
        
    }
}
</script>

<style scoped>
/* กำหนดขนาดความสูงของตาราง แล้วเลื่อนขึ้น-ลง */
.table-responsive {
  max-height: 400px; /* กำหนดความสูงของตารางเพื่อให้สามารถเลื่อนขึ้นลงได้ */
  overflow-y: auto;
}
.table th:nth-child(n+10), .table td:nth-child(n+10) {
  display: none; /* ซ่อนคอลัมน์ที่เกินจำนวนที่ต้องการ */
}


</style>