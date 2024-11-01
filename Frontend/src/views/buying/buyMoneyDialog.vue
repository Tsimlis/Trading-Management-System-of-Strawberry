<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="money-dialog">
        <div class="modal-dialog" role="document">
            <form class="modal-content" @submit.once="onSubmit()">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-money" aria-hidden="true"></i> ชำระเงิน</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">

                    <!-- เลือกรูปแบบการชำระ -->
                    <div class="row">
                        <div class="col-sm-6"><h5><i class="fa fa-sort"></i> ช่องทางชำระ</h5></div>
                        <div class="col-sm-3">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="Radios" id="Radios1" value="offline" v-model="type" checked>
                            <label class="form-check-label" for="Radios1">
                            เงินสด
                            </label>
                        </div>
                        </div>
                        <div class="col-sm-3">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="Radios" id="Radios2" value="online" v-model="type">
                            <label class="form-check-label" for="Radios2">
                            ออนไลน์
                            </label>
                        </div>
                        </div>
                    </div>
                    <hr>

                    <div class="form-group">
                        <div class="col">
                            <div class="row">
                                <div class="btn btn-warning" @click="check = !check">ตรวจสอบรายการ</div>
                            </div>
                            <br>
                            <div v-show="check">
                                <div class="row pl-4"><label >ราคาเสนอลำดับที่ : {{form.fp_id}}</label></div>
                                <div class="row pl-4"><label >ชื่อเกษตรกร : {{form.fp_name}}</label></div>
                                <div class="row pl-4"><label >วันที่ทำรายการ : {{form.fp_created | formatDate}}</label></div>
                                <div class="row pl-4"><label >ขนาด XXL</label></div>
                                <div class="row pl-4">
                                    <div class="col-4"><label >{{form.fp_price_xxl.price}} บาท/กก.</label></div>
                                    <div class="col-4"><label >จำนวน : {{form.fp_price_xxl.weigth}} กก.</label></div>
                                    <div class="col-4"><label >= {{size.xxl}} บาท</label></div>
                                </div>
                                <div class="row pl-4"><label >ขนาด XL</label></div>
                                <div class="row pl-4">
                                    <div class="col-4"><label >{{form.fp_price_xl.price}} บาท/กก.</label></div>
                                    <div class="col-4"><label >จำนวน : {{form.fp_price_xl.weigth}} กก.</label></div>
                                    <div class="col-4"><label >= {{size.xl}} บาท</label></div>
                                </div>
                                <div class="row pl-4"><label >ขนาด L</label></div>
                                <div class="row pl-4">
                                    <div class="col-4"><label >{{form.fp_price_l.price}} บาท/กก.</label></div>
                                    <div class="col-4"><label >จำนวน : {{form.fp_price_l.weigth}} กก.</label></div>
                                    <div class="col-4"><label >= {{size.l}} บาท</label></div>
                                </div>
                                <div class="row pl-4"><label >ขนาด M</label></div>
                                <div class="row pl-4">
                                    <div class="col-4"><label >{{form.fp_price_m.price}} บาท/กก.</label></div>
                                    <div class="col-4"><label >จำนวน : {{form.fp_price_m.weigth}} กก.</label></div>
                                    <div class="col-4"><label >= {{size.m}} บาท</label></div>
                                </div>
                                <div class="row pl-4"><label >ขนาด S</label></div>
                                <div class="row pl-4">
                                    <div class="col-4"><label >{{form.fp_price_s.price}} บาท/กก.</label></div>
                                    <div class="col-4"><label >จำนวน : {{form.fp_price_s.weigth}} กก.</label></div>
                                    <div class="col-4"><label >= {{size.s}} บาท</label></div>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                    <!-- เงินสด -->
                    <div class="form-group col" v-show="type == 'offline'">
                        <hr>
                        <div class="row"><label class="m-0" for=""><b>เป็นจำนวนเงิน</b></label></div>
                        <div class="row pl-2">
                            <div class="col-3"></div>
                            <div class="col-6">
                                <input type="number" class="form-control col-sm" 
                                        v-model="form.fp_pay"></div>
                            <div class="col-3"><label class="text-bottom"><b>บาทถ้วน</b></label></div>
                        </div>
                    </div>



                    <!-- ทางออนไลน์ -->
                    <div class="form-group col" v-show="type == 'online'">
                        <div class="row"><label class="m-0" for="">QR promtpay</label></div>
                        <div class="row text-center">
                            <div class="form-group col" v-show="qrImage.svg">
                                <div v-html="qrImage.svg"></div>
                                
                                <div class="row ">
                                    <div class="col-6"><label>ชื่อเกษตรกร : {{form.fp_name}}</label></div>
                                    <div class="col-6"><label>จำนวนเงิน : {{form.fp_pay}}</label></div>
                                </div>

                                <div class="row ">
                                    <div class="col-6"><label>ธนาคาร : {{bank.u_bank_name}}</label></div>
                                    <div class="col-6"><label>เลขบัญชี : {{bank.u_bank_acc}}</label></div>
                                </div>

                                <div class="form-group">
                                    <label class="btn btn-secondary btn-block">
                                        <i class="fa fa-upload "></i> ยืนยันใบเสร็จ
                                        <input type="file" class="d-none" @change="onChangeFile($event.target)">
                                    </label>

                                    <img class="img-fluid w-100" :src="form.fp_imagePay " alt="image example" v-if="form.fp_imagePay">
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="modal-footer" >
                    <button type="submit" class="btn btn-info btn-block mt-2 mb-4" 
                            :disabled=" (form.fp_imagePay == '' && type == 'online') || type == ''">ยืนยันการชำระ</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props:{
        money: { required: true }
    },
    data(){
        return{
            type: "",
            check: false,
            form: {
                fp_id: "",
                fp_pay: "",
                fp_name: "",
                fp_created: "",
                fp_price_xxl: {},
                fp_price_xl: {},
                fp_price_l: {},
                fp_price_m: {},
                fp_price_s: {},
                fp_imagePay: ""
            },
            size: {
                xxl: '',
                xl: '',
                l: '',
                m: '',
                s: ''
            },
            total: '',
            qrImage: [],
            bank: {}
        }
    },
    watch: {
        money(value){
            if(!value) return
            this.jquery("#money-dialog").modal();

            this.form.fp_id = value.fp_id
            this.form.fp_farmer_id = value.fp_farmer_id
            this.form.fp_name = value.fp_name
            this.form.fp_created = value.fp_created
            this.form.fp_price_xxl = JSON.parse(value.fp_price_xxl);
            this.form.fp_price_xl = JSON.parse(value.fp_price_xl);
            this.form.fp_price_l = JSON.parse(value.fp_price_l);
            this.form.fp_price_m = JSON.parse(value.fp_price_m);
            this.form.fp_price_s = JSON.parse(value.fp_price_s);

            this.size.xxl = this.form.fp_price_xxl.price * this.form.fp_price_xxl.weigth
            this.size.xl = this.form.fp_price_xl.price * this.form.fp_price_xl.weigth
            this.size.l = this.form.fp_price_l.price * this.form.fp_price_l.weigth
            this.size.m = this.form.fp_price_m.price * this.form.fp_price_m.weigth
            this.size.s = this.form.fp_price_s.price * this.form.fp_price_s.weigth
            
            this.form.fp_pay = Object.values(this.size).reduce((acc, value) => acc + value, 0);
        },
        type(type){
            // ฟังกชัน genQRcode
            type == 'online' ? this.genQRcode() : '';
        }
    },
    mounted() {
        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#money-dialog").on("hide.bs.modal", event => {
            this.$emit('onClose', event)
            this.type = ""
        })
    },
    methods: {
        onSubmit(){
            this.$validator.validateAll().then(valid => {
                if(!valid) return;

                axios.put(`/api/buying/pay/${this.form.fp_id}`, this.form ).then(res => {
                        this.alertify.warning('ยืนยันการชำระสำเร็จ');
                        this.jquery("#buy-dialog").modal("hide");
                    }).catch(err => this.alertify.error(err.response.data.message));
            })
        },
        genQRcode(){
            axios.get(`/api/userinfo/${this.form.fp_farmer_id}`).then(res => {
                this.bank = res.data
                axios.post(`/api/qrcode/store/${this.form.fp_pay}`, res.data).then(res => {
                        res.data == 'not promptpay' ? this.alertify.error('ไม่ได้ลงทะเบียนพร้อมเพย์') : this.qrImage = res.data ;
                    }).catch(error => this.alertify.error(error.response.data.message))
            }).catch(error => this.alertify.error(error.response.data.message))
        },
        // เปลี่ยนไฟล์อัพโหลดเป็น Base64 string
        onChangeFile(input) {
            this.form.fp_imagePay = "";
            if (input.files && input.files.length > 0) {
                const file = input.files[0];
                if (file.type.indexOf("image/") >= 0) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.addEventListener("load", () => {
                        this.form.fp_imagePay = reader.result;
                    });
                return;
                }
            }
            this.alertify.warning("กรุณาเลือกภาพที่จะอัพโหลด !");
        },
  }
}
</script>

<style scoped>
.modal{
    color: #525662;
}
.modal-dialog{
    max-width: 600px;
}
.modal-body,
.modal-footer {
    padding-left: 8%;
    padding-right: 8%;
}
.form-check{
    margin-bottom: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>