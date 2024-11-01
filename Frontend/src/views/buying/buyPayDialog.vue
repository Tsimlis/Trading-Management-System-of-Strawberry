<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="pay-dialog">
        <div class="modal-dialog" role="document">
            <form class="modal-content" style="max-width: 600px">
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
                            <input class="form-check-input" type="radio" name="Radios" id="Radios2" value="online" v-model="type" @click="genQRcode()">
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
                                <!-- <div class="row pl-4"><label >ราคาเสนอลำดับที่ : {{form.f_id}}</label></div> -->
                                <div class="row pl-4"><label >ชื่อเกษตรกร : {{form.f_name}}</label></div>
                                <div class="row pl-4"><label >วันที่ทำรายการ : {{form.f_created | formatDate}}</label></div>
                                <div class="row pl-4"><label >ขนาด XXL</label></div>
                                <div class="row pl-4">
                                    <div class="col-4"><label >{{form.f_price_xxl}} บาท/กก.</label></div>
                                    <div class="col-4"><label >จำนวน : {{form.f_weigth_xxl}} กก.</label></div>
                                    <div class="col-4"><label >= {{size.xxl}} บาท</label></div>
                                </div>
                                <div class="row pl-4"><label >ขนาด XL</label></div>
                                <div class="row pl-4">
                                    <div class="col-4"><label >{{form.f_price_xl}} บาท/กก.</label></div>
                                    <div class="col-4"><label >จำนวน : {{form.f_weigth_xl}} กก.</label></div>
                                    <div class="col-4"><label >= {{size.xl}} บาท</label></div>
                                </div>
                                <div class="row pl-4"><label >ขนาด L</label></div>
                                <div class="row pl-4">
                                    <div class="col-4"><label >{{form.f_price_l}} บาท/กก.</label></div>
                                    <div class="col-4"><label >จำนวน : {{form.f_weigth_l}} กก.</label></div>
                                    <div class="col-4"><label >= {{size.l}} บาท</label></div>
                                </div>
                                <div class="row pl-4"><label >ขนาด M</label></div>
                                <div class="row pl-4">
                                    <div class="col-4"><label >{{form.f_price_m}} บาท/กก.</label></div>
                                    <div class="col-4"><label >จำนวน : {{form.f_weigth_m}} กก.</label></div>
                                    <div class="col-4"><label >= {{size.m}} บาท</label></div>
                                </div>
                                <div class="row pl-4"><label >ขนาด S</label></div>
                                <div class="row pl-4">
                                    <div class="col-4"><label >{{form.f_price_s}} บาท/กก.</label></div>
                                    <div class="col-4"><label >จำนวน : {{form.f_weigth_s}} กก.</label></div>
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
                                        v-model="form.f_pay"></div>
                            <div class="col-3"><label class="text-bottom"><b>บาทถ้วน</b></label></div>
                        </div>
                    </div>



                    <!-- ทางออนไลน์ -->
                    <div class="form-group col" v-show="type == 'online'">
                        <label class="m-0">QR pramtpay</label>
                        <div class=" text-center">
                            <div class="form-group col" v-show="qrImage.svg">
                                <div v-html="qrImage.svg"></div>
                                
                                <div class="row text-center">
                                    <div class="col-6"><label>ชื่อเกษตรกร : {{form.f_farmer_name}}</label></div>
                                    <div class="col-6"><label>จำนวนเงิน : {{form.f_pay}}</label></div>
                                </div>
                                <div class="row text-center">
                                    <div class="col-6"><label>ธนาคาร : {{bank.u_bank_name}}</label></div>
                                    <div class="col-6"><label>เลขบัญชี : {{bank.u_bank_acc}}</label></div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="btn btn-secondary btn-block">
                                    <i class="fa fa-upload "></i> ยืนยันใบเสร็จ
                                    <input type="file" class="d-none" @change="onChangeFile($event.target)">
                                </label>

                                <img class="img-fluid w-100" :src="Image || '/img/no-image.png'" alt="image example" v-if="Image">
                            </div>

                        </div>
                    </div>

                </div>

                <div class="modal-footer " >
                    <button @click.prevent="onSubmit(form)" class="btn btn-info btn-block mt-2 mb-4" :disabled="(type == 'online' && Image == '') || type == ''">ยืนยันการชำระ</button>
                </div>
            </form>
        </div>
    </div>
</template>


<script>
import axios from 'axios';
import {mapState} from 'vuex'

export default {
    props:{
        pay: {
            required: true
        }
    },
    data(){
        return{
            type: "",
            check: "",
            form: {
                f_id : "",
                f_farmer_id : "",
                f_farmer_name : "",
                f_image : "",
                f_created : "",
                f_order : "success",
                f_price_xxl : "",
                f_price_xl : "",
                f_price_l : "",
                f_price_m : "",
                f_price_s : "",
                f_weigth_xxl : "",
                f_weigth_xl : "",
                f_weigth_l : "",
                f_weigth_m : "",
                f_weigth_s : ""
            },
            size: {
                xxl: '',
                xl: '',
                l: '',
                m: '',
                s: '',
            },
            bank: {},
            Image: "",
            qrImage: [],
        }
    },
    watch: {
        pay(value){
            if(!value) return
            // เปิดหน้า modal แสดงเมื่อมีข้อมูลเข้า
            this.jquery("#pay-dialog").modal();
            // console.log(value)
            this.Check(value);
        },
        Image(value){
            // เพิ่มรูปเพื่อการบันทึกหลักฐานการชำระ
            Object.assign(this.form, {f_imagePay: value})
        }
    },
    computed:{
        ...mapState({ userId: state => state.user })
    },
    mounted() {
        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#pay-dialog").on("hide.bs.modal", event => {
            this.$emit('onClose', event)
        })
    },
    methods: {
        onSubmit(item){
            console.log(item)
            axios.put(`/api/buying/payOrder/${item.f_id}`, item).then(res => {
                    this.alertify.success('ยืนยันการชำระแล้ว')
                    window.location.reload();
                }).catch(error => this.alertify.error(error.response.data.message))
        },
        Check(value){
            this.form.f_id = value.f_id
            this.form.f_farmer_id = value.f_farmer_id
            this.form.f_farmer_name = value.f_name
            this.form.f_image = value.f_image
            this.form.f_created = value.f_created

            this.form.f_price_xxl = value.f_price_xxl
            this.form.f_price_xl = value.f_price_xl
            this.form.f_price_l = value.f_price_l
            this.form.f_price_m = value.f_price_m
            this.form.f_price_s = value.f_price_s
            this.form.f_weigth_xxl = value.f_weigth_xxl
            this.form.f_weigth_xl = value.f_weigth_xl
            this.form.f_weigth_l = value.f_weigth_l
            this.form.f_weigth_m = value.f_weigth_m
            this.form.f_weigth_s = value.f_weigth_s

            this.size.xxl = (value.f_price_xxl * value.f_weigth_xxl)
            this.size.xl = (value.f_price_xl * value.f_weigth_xl)
            this.size.l = (value.f_price_l * value.f_weigth_l)
            this.size.m = (value.f_price_m * value.f_weigth_m)
            this.size.s = (value.f_price_s * value.f_weigth_s)
            
            this.form.f_pay = (this.size.xxl + this.size.xl + this.size.l + this.size.m + this.size.s)

        },
        genQRcode(){
            axios.get(`/api/userinfo/${this.form.f_farmer_id}`).then(res => {
                this.bank = res.data
                axios.post(`/api/qrcode/store/${this.form.f_farmer_id}`, res.data)
                    .then(res => this.qrImage = res.data ).catch(error => this.alertify.error(error.response.data.message))
            }).catch(error => this.alertify.error(error.response.data.message))
        },
        // เปลี่ยนไฟล์อัพโหลดเป็น Base64 string
        onChangeFile(input) {
            this.Image = "";
            if (input.files && input.files.length > 0) {
                const file = input.files[0];
                if (file.type.indexOf("image/") >= 0) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.addEventListener("load", () => {
                        this.Image = reader.result;
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
    max-width: 600px;
    padding-left: 8%;
    padding-right: 8%;
}
.img-fluid{
    border: solid 1px #6C757D;
}
.black{
    color: #212529;
}

</style>