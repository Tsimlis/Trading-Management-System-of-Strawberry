<template>
    <div class="register">
        
        <div class="card shadow p-3 mb-5 bg-white rounded">
            <h1 style="background-color: lightgray; border-color: #17A2B8;">
                <img src="/img/logo.svg" alt="Logo" class="img-logo ">
            </h1>
            
            
            <div class="card-body">
                
                <form >
                    <div class="form-group">
                        <div class="col pl-0 mb-1">
                            <label class="text-danger">*ตรวจสอบข้อมูลของคุณให้ถูกต้อง ก่อนทำการชำระเงิน</label>
                            
                            <button type="button" class="close pointer" aria-label="Close" @click="onCancer" >
                                <label style="font-weight: 400; font-size: 16px;">back</label> <i class="fa fa-sign-out ml-2" aria-hidden="true"></i>
                            </button>
                        </div>
                        

                        <div class="row form-group">
                            <div class="col">
                                <label for="">ชื่อผู้สั่งสินค้า</label>
                                <input type="text" name="username"
                                    v-validate="{ required: true, regex: /^[ก-ฮA-Za-z0-9]$/ }"
                                    v-model.trim="userId.u_fullname"
                                    :class="{ 'is-invalid': errors.has('fullname') }"
                                    class="form-control">
                                <span class="invalid-feedback">{{ errors.first('fullname') }}</span>
                            </div>
                            <div class="col">
                                <label for="">เบอร์โทรศัพท์</label>
                                <input type="text" name="phone"
                                    v-validate="{ required: true, regex: /^[0-9]{9,10}$/ }"
                                    v-model.trim="userId.u_phone"
                                    :class="{ 'is-invalid': errors.has('phone') }"
                                    class="form-control">
                                <span class="invalid-feedback">{{ errors.first('phone') }}</span>
                            </div>
                        </div>
                        
                        <div class="row form-group">
                            <div class="col">
                                <label for="">ที่อยู่สำหรับจัดส่ง</label>
                                <textarea class="form-control" name="address"
                                    v-validate="'required'"
                                    v-model.trim="userId.u_address"
                                    :class="{ 'is-invalid': errors.has('address') }"
                                    cols="10" rows="3"></textarea>
                                <span class="invalid-feedback">{{ errors.first('address') }}</span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="">รายการสั่งซื้อ</label>
                            <div class="card">
                                <div class="card-body pb-0" v-for="(body, index) in form" :key="body[index]">
                                    <header>
                                        <h5><i class="fa fa-user-circle"></i> {{body.sale_name}}</h5>
                                    </header>
                                    <div class="table-responsive" >
                                        <!-- ตารางขายส่ง -->
                                        <table class="table text-center"  style="border-top: hidden;" >
                                            <thead >
                                                <tr class="text-nowrap">
                                                    <th></th>
                                                    <th>ประเภท/ขนาด</th>
                                                    <th>กก./ขวด</th>
                                                    <th>ราคา</th>
                                                    <th>จำนวน</th>
                                                    <th>เป็นเงิน</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(item, indexx) in body.sale_list" :key="item[indexx]">
                                                    <td class="d-none d-sm-table-cell">
                                                        <div class="img-container">
                                                            <img :alt="item.id" :src="`/api/uploads/${JSON.parse(item).image}`">
                                                        </div>
                                                    </td>
                                                    <!-- แสดงเฉพาะขายปลีก -->
                                                    <td class="pl-3" v-show="JSON.parse(item).look"> 
                                                        <tr v-if="JSON.parse(item).look == 'XXL'">ไซซ์ยักษ์ XXL</tr>
                                                        <tr v-if="JSON.parse(item).look == 'XL'">ไซซ์จัมโบ้ XL</tr>
                                                        <tr v-if="JSON.parse(item).look == 'L'">ไซซ์ใหญ่ L</tr>
                                                        <tr v-if="JSON.parse(item).look == 'M'">ไซซ์กลาง M</tr>
                                                        <tr v-if="JSON.parse(item).look == 'S'">ไซซ์เล็ก S</tr>
                                                        <tr v-if="JSON.parse(item).look == 'mix'">ไซซ์คละ</tr>
                                                        <tr v-if="JSON.parse(item).look == 'drying'">ไซซ์อบแห้ง</tr>
                                                        <tr v-if="JSON.parse(item).look == 'juice'">น้ำสตรอว์เบอร์รี</tr>
                                                    </td>
                                                    <td v-show="JSON.parse(item).look"> {{JSON.parse(item).weigth}} </td>
                                                    <td v-show="JSON.parse(item).look"> {{JSON.parse(item).price}} </td>
                                                    <td v-show="JSON.parse(item).look"> {{JSON.parse(item).multiply}} </td>

                                                    <!-- แสดงเฉพาะขายส่ง -->
                                                    <td v-show="JSON.parse(item).xxl">
                                                        <div v-show="Object(JSON.parse(item).xxl).weigth">
                                                            <b>ไซซ์ยักษ์ </b><br>
                                                            {{Object(JSON.parse(item).xxl).weigth}} กก. {{Object(JSON.parse(item).xxl).price}} บาท <br>
                                                        </div>
                                                        <div v-show="Object(JSON.parse(item).xl).weigth">
                                                            <b>ไซซ์จัมโบ้ </b><br>
                                                            {{Object(JSON.parse(item).xl).weigth}} กก. {{Object(JSON.parse(item).xl).price}} บาท
                                                        </div>
                                                    </td>

                                                    <td v-show="JSON.parse(item).xxl">
                                                        <div v-show="Object(JSON.parse(item).l).weigth">
                                                            <b>ไซซ์ใหญ่ </b><br>
                                                            {{Object(JSON.parse(item).l).weigth}} กก. {{Object(JSON.parse(item).l).price}} บาท <br>
                                                        </div>
                                                        <div v-show="Object(JSON.parse(item).m).weigth">
                                                            <b>ไซซ์กลาง </b><br>
                                                            {{Object(JSON.parse(item).m).weigth}} กก. {{Object(JSON.parse(item).m).price}} บาท
                                                        </div>
                                                    </td>

                                                    <td v-show="JSON.parse(item).xxl">
                                                        <div v-show="Object(JSON.parse(item).s).weigth">
                                                            <b>ไซซ์เล็ก</b><br>
                                                            {{Object(JSON.parse(item).s).weigth}} กก. {{Object(JSON.parse(item).s).price}} บาท <br>
                                                        </div>
                                                        <div v-show="Object(JSON.parse(item).mix).weigth">
                                                            <b>ไซซ์รวม </b><br>
                                                            {{Object(JSON.parse(item).mix).weigth}} กก. {{Object(JSON.parse(item).mix).price}} บาท
                                                        </div>
                                                    </td>

                                                    <td v-show="JSON.parse(item).xxl">
                                                        <div v-show="Object(JSON.parse(item).drying).weigth">
                                                            <b>อบแห้ง </b><br>
                                                            {{Object(JSON.parse(item).drying).weigth}} กก. {{Object(JSON.parse(item).drying).price}} บาท <br>
                                                        </div>
                                                        <div v-show="Object(JSON.parse(item).juice).weigth">
                                                            <b>น้ำสตรอว์เบอร์รี </b><br>
                                                            {{Object(JSON.parse(item).juice).weigth}} กก. {{Object(JSON.parse(item).juice).price}} บาท
                                                        </div>
                                                    </td>

                                                    <!-- รวมราคา -->
                                                    <td > {{JSON.parse(item).total}} </td>
                                                </tr>
                                            </tbody>
                                            <tr>
                                                <th class="p-0"></th><th class="p-0"></th><th class="p-0"></th><th class="p-0"></th><th class="p-0">
                                                </th><th class="p-0 pt-2"><label style="font-weight: 400;">{{body.sale_total}}</label></th>
                                            </tr>
                                        </table>
                                        
                                    </div>

                                </div>
                            </div>
                            <div class="col" 
                                style="border-top: solid 1px lightgray; border-bottom: solid 1px lightgray;  margin-top: 0.8rem; background-color: aliceblue;" >
                                <div class="col"><label class="mt-1"><i class="fa fa-list"></i> ข้อมูลการชำระเงิน</label></div>
                                <div class="mt-2" v-for="(item, index) in form" :key="item[index]">
                                    <div class="col"><label class="mb-0">การสั่งซื้อ {{item.sale_name}}</label><label class="mb-0 float-right">{{item.sale_total}}</label></div>
                                    <div class="col"><label class="mb-0">ค่าจัดขนส่ง</label><label class="mb-0 float-right">{{item.sale_free}}</label></div>
                                    <div class="col"><label ><b></b></label><label class="mb-0 float-right"><u>{{storeTotal[index]}}</u></label></div>
                                </div>
                                
                            </div>
                            <div class="col mt-3">
                                <label style="font-size: 18px;">ยอดชำระเงินทั้งหมด</label><label class="float-right mr-3" style="font-size: 18px;"><b>{{Pay}}</b></label>
                            </div>
                            
                        </div>

                    </div>

                    <!-- ข้อความแจ้งเตือน -->
                    <div v-if="errorMessage" class="alert alert-warning text-center">
                        {{ errorMessage }}
                    </div>

                    <div class="form-group buttons" >
                        <div class="col-sm-3">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" id="Radios1" value="bank" v-model="type" checked>
                                <label class="form-check-label" for="Radios1">
                                    เลขบัญชี
                                </label>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" id="Radios2" value="qrcode" v-model="type">
                                <label class="form-check-label" for="Radios2">
                                    QR code
                                </label>
                            </div>
                        </div>

                        <button type="button" @click="onPay(form, type)" class="btn btn-warning btn-block p-2 mt-2" :disabled="type == ''" >
                            ชำระสินค้า
                        </button>
                        <div class="col">
                            <div class="row mt-3"><label style="font-weight: 700;">ข้อปฏิบัติ</label></div>
                            <div class="row"><label >-ชำระเงินด้วย QR พร้อมเพย์เท่านั้น</label></div>
                            <div class="row"><label >-หากคุณชำระสำเร็จแล้ว ระบบจะทำการแจ้งเตือนให้กับร้านค้าเพื่อดำเนินการต่อไป</label></div>
                            <div class="row"><label >-คุณสามารถสอบถามกับทางร้านค้าได้ผ่านช่องทางแชท</label></div>
                        </div>

                        <button type="button" class="btn btn-secondary btn-block">
                            <!-- ช่องทางการชำระ -->
                        </button>
                        <button type="button" @click="onCancer()" class="btn btn-info btn-block">
                            กลับ
                        </button>
                    </div>
                    
                </form>
                <div v-for="(item, index) in qrLoop" :key="index">
                    <QRpay :code="item" @onClose="callbackData" />
                </div>

                <!-- <QRcode :code="codeItem" @onClose="callbackData" /> -->

                <div v-for="(item, index) in bankLoop" :key="index">
                    <BANKpay :code="item" @onClose="callbackData" />
                </div>
            </div>
        </div>
    </div>

    
</template>

<script>
import axios from "axios";
import {mapState} from "vuex"
// import QRcode from "./qrCode.vue"
import QRpay from './QRpay.vue'
import BANKpay from './BANKpay.vue'

export default {
  data() {
    return {
        codeItem: [],
        errorMessage: '',
        form: [],
        storeTotal: [],
        Pay: 0,
        send: {},
        list: {},
        deductRetail: [],
        deductWhole: [],
        dataSend: null,
        qrLoop: [],
        bankLoop: [],
        checkloop: 0,
        type: ""
    }
  },
  components:{
    // QRcode,/
    QRpay,
    BANKpay
  },
  watch:{
    form(value){
        if(!value) return
        // รวมยอดจ่าย และเลือกค่าขนส่งที่มากที่สุด
        value.forEach((item, index) => {
            this.storeTotal.push(Math.max(...item.sale_free) + +item.sale_total);
            this.Pay += +this.storeTotal[index]
            this.form[index].sale_free = Math.max(...item.sale_free)
            this.form[index].sale_pay = this.storeTotal[index]
        })
    },
    dataSend(data){
        // บันทึกรายการสั่งซื้อหลังจากได้รูปใบเสร็จ
        data != '' ? this.submit(data) : this.alertify.warning('ทำรายการไม่สำเร็จ เนื่องจากไม่มีหลักฐานใบเสร็จ'); //บันทึกรายการสั่งซื้อที่ชำระสำเร็จ
    },
  },
  computed:{
    ...mapState({ userId: state => state.user })
  },
  mounted(){
    const data = localStorage.getItem('file'); // รับค่าจากหน้าคำสั่งซื้อ
    if (data) this.list = JSON.parse(data);
    // ฟังกชันจัดเรียงข้อมูลใหม่
    this.calculate();
  },
  methods: {
    // ชำระเงิน
    onPay(item, type) {
        type == 'qrcode' ? this.qrLoop = item : this.bankLoop = item;
        // this.codeItem = item[0] ตัวแรกทดสอบ ทำรายการแค่ร้านเดียว
    },
    // เมื่อทำการชำระและหลักฐานใบเสร็จแล้วจะส่งค่ามา เพื่อทำการบันทึกรายการ
    callbackData(data, add) {
        this.codeItem.push(data); // คิดก่อนว่าจะใช้ยังๆง
        this.dataSend = [add];

        // this.qrLoop.map((items, indexs) => { items.sale_id === data.sale_id ? this.qrLoop.splice(indexs, 1) : ''; } );
        // console.log(this.qrLoop)
    },
    submit(data){
        // บันทึกรายการสั่งซื้อผลผลิต
        axios.post(`/api/customer/order`, data).then(res => {
                const success = res.data.num
                success.forEach((item) => this.alertify.success('ดำเนินการคำสั่งซื้อที่ #' + Object(item).insertId) )
                this.stockDelete(this.deductRetail, this.deductWhole);
            }).catch(error => this.alertify.error(error.respose.data.message))
    },
    stockDelete(retail, whole){
        axios.put(`/api/customer/deductRetail`, retail)
            .then().catch(error => this.alertify.error(error.response.data.message))
        axios.put(`/api/customer/deductWhole`, whole)
            .then().catch(error => this.alertify.error(error.response.data.message))
        
        this.checkloop++
        
        if(this.qrLoop.length == this.checkloop) this.$router.push({ name: 'retail' });
        if(this.bankLoop.length == this.checkloop) this.$router.push({ name: 'retail' });
    },
    // เลือกช่องทางชำระ
    onSelect() {
        
    },
    onCancer(){
        this.form = "";
        this.$router.push({ name: 'retail' });
    },
    calculate(){
        // แยกเลขร้านที่ซื้อ
        const Items = this.list.map(item => ({ saleName: item.bas_sale_name, saleId: item.bas_sale_id })).filter((value, index, self) => 
                        index === self.findIndex((t) => ( t.saleId === value.saleId ))
                    );
        // แทนค่าในตัวแปรใหม่
        Items.forEach((item) => {
            const arr = {
                    customer_id: this.userId.u_id,
                    customer_name: this.userId.u_fullname,
                    sale_id: item.saleId,
                    sale_name: item.saleName,
                    sale_free: [],
                    sale_total: 0,
                    sale_pay: 0,
                    sale_list: [],
                }
            // แยกประเภทขายส่ง ขายปลีก
            for (let i = 0; i < this.list.length; i++){
                if(item.saleId == this.list[i].bas_sale_id ) {
                    if(this.list[i].bas_retail != null) {
                        arr.sale_list.push(this.list[i].bas_retail);
                        arr.sale_total += +JSON.parse(this.list[i].bas_retail).total
                        arr.sale_free.push(this.list[i].bas_free)
                        // ถ่ายน้ำหนักขายปลีกเพื่อเอาไปลบในฐานข้อมูล
                        this.deductRetail.push(JSON.parse(Object(this.list[i].bas_retail)))  
                    }
                    if(this.list[i].bas_whole != null) {
                        arr.sale_list.push(this.list[i].bas_whole);
                        arr.sale_total += +JSON.parse(this.list[i].bas_whole).total
                        arr.sale_free.push(this.list[i].bas_free)
                        // ถ่ายน้ำหนักขายส่งเพื่อเอาไปลบในฐานข้อมูล
                        this.deductWhole.push( Object.assign(JSON.parse(Object(this.list[i].bas_whole)), {id: item.saleId } ) ) 
                    }
                }
            }
            // เพิ่มใน form ใหม่
            this.form.push(arr)
        })
    },
  }
};
</script>

<style scoped>
.register {
  max-width: 700px;
  margin: 3% auto;
}
.img-logo {
  width: 85%;
  display: block;
  margin: auto;
  /* margin-bottom: 10px; */
}
table td {
    padding: 0;
}
h1 {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 5px;
}
.buttons .btn-secondary {
  margin-top: 20px;
}
.buttons {
  margin-top: 20px;
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


