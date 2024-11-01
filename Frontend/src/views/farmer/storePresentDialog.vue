<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="store-present-dialog">
        <div class="modal-dialog" role="document"  style="max-width: 550px;">
            <form class="modal-content" @submit.once="onSubmit()">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-ticket"></i> เสนอราคา</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body" v-show="show == ''">
                    <div class="col" >

                        <div class="form-group">
                            <label class="btn btn-secondary btn-block">
                                <i class="fa fa-upload"></i> อัพโหลดภาพ
                                <input type="file" class="d-none" @change="onChangeFile($event.target)">
                            </label>

                            <img class="img-fluid w-100" :src="form.fp_image || '/img/no-image.png'" alt="image example">
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ ขนาด XXL</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">น้ำหนักที่ต้องการขาย (กก.)</label>
                                    <input type="number" class="form-control" name="fp_price_xxl.weigth" 
                                    v-model.trim="form.fp_price_xxl.weigth" >
                                </div>
                                <div class="col ml-3">
                                    <label for="">ขายในราคากิโลกรัมละ (บาท)</label>
                                    <input type="number" class="form-control" name="fp_price_xxl.price" 
                                    v-model.trim="form.fp_price_xxl.price" >
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ ขนาด XL</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">น้ำหนักที่ต้องการขาย (กก.)</label>
                                    <input type="number" class="form-control" name="fp_price_xl.weigth" 
                                    v-model.trim="form.fp_price_xl.weigth" >
                                </div>
                                <div class="col ml-3">
                                    <label for="">ขายในราคากิโลกรัมละ (บาท)</label>
                                    <input type="number" class="form-control" name="fp_price_xl.price" 
                                    v-model.trim="form.fp_price_xl.price" >
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ ขนาด L</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">น้ำหนักที่ต้องการขาย (กก.)</label>
                                    <input type="number" class="form-control" name="fp_price_l.weigth" 
                                    v-model.trim="form.fp_price_l.weigth" >
                                </div>
                                <div class="col ml-3">
                                    <label for="">ขายในราคากิโลกรัมละ (บาท)</label>
                                    <input type="number" class="form-control" name="fp_price_l.price" 
                                    v-model.trim="form.fp_price_l.price" >
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ ขนาด M</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">น้ำหนักที่ต้องการขาย (กก.)</label>
                                    <input type="number" class="form-control" name="fp_price_m.weigth" 
                                    v-model.trim="form.fp_price_m.weigth" >
                                </div>
                                <div class="col ml-3">
                                    <label for="">ขายในราคากิโลกรัมละ (บาท)</label>
                                    <input type="number" class="form-control" name="fp_price_m.price" 
                                    v-model.trim="form.fp_price_m.price" >
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ ขนาด S</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">น้ำหนักที่ต้องการขาย (กก.)</label>
                                    <input type="number" class="form-control" name="fp_price_s.weigth" 
                                    v-model.trim="form.fp_price_s.weigth" >
                                </div>
                                <div class="col ml-3">
                                    <label for="">ขายในราคากิโลกรัมละ (บาท)</label>
                                    <input type="number" class="form-control" name="fp_price_s.price" 
                                    v-model.trim="form.fp_price_s.price" >
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>เพิ่มเติม</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <textarea class="form-control" name="fp_detial" rows="3"
                                    v-model.trim="form.fp_detail"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                  
                </div> 

                <div class="modal-footer">
                    <button type="submit" class="btn btn-info btn-block mt-2 mb-4" :disabled="show.length > 0">เสนอราคา</button>
                </div>


                <!-- ส่วนของร้านรับซื้อที่สนใจ -->
                <div class="modal-body" v-show="show != ''">
                    <div class="table-responsive " >
                        <table class="table content text-center">
                            <thead>
                                <tr class="text-nowrap">
                                    <!-- <th>#</th> -->
                                    <th>ร้านที่รับซื้อ</th>
                                    <th>เวลา</th>
                                    <th>สถานะ</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in show" :key="item.fp_id" > 
                                    <!-- <td>{{ item.fp_id }}</td> -->
                                    <td>{{ item.fp_buy_name }}<br><label v-if="item.fp_pay">{{`ขำระ : ${item.fp_pay}`}}</label></td>
                                    <td>{{ item.fp_updated | formatDate}}</td>
                                    <td class="text-left">
                                        <label class="btn btn-warning" v-if=" item.fp_exp == 'allowed' " >
                                            <i class="fa fa-hourglass"></i> กรุณานำส่งผลผลิต
                                        </label>
                                        <label class="btn btn-success" v-if=" item.fp_exp == 'pending' " @click.once="onAccess(item, item.fp_buy_name)">
                                            <i class="fa fa-check-square-o"></i> ยินดีขาย
                                        </label>
                                        <label class="text-nowrap" v-if=" item.fp_exp == 'success' " >
                                            <i class="fa fa-car"></i> นำส่ง
                                        </label>
                                    </td>
                                    <td>
                                        <!-- <img :src="`/api/uploads/${item.fp_image}`" alt="stament" class="w-100 pointer" @click="toImage(item.fp_image)"> -->
                                        <img :src="`/api/uploads/${item.fp_imagePay}`" alt="stament" class='pointer' style="max-height: 164px;" @click="toImage(item.fp_imagePay)">
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <br>
                <br>

            </form>
        </div>

    <Img :img="imageItem" @onClose="imageItem = null" />
    </div>
    
</template>

<script>
import axios from 'axios';
import {mapState} from 'vuex'
import Img from '@/components/ImageView'

export default {
    props:{
        present: {
            required: true
        }
    },
    components: {
        Img
    },
    data(){
        return{
            form: {
                fp_farmer_id: "",
                fp_name: "",
                fp_image: "",
                fp_detail: "",
                fp_price_xxl: {weigth: '', price: ''},
                fp_price_xl: {weigth: '', price: ''},
                fp_price_l: {weigth: '', price: ''},
                fp_price_m: {weigth: '', price: ''},
                fp_price_s: {weigth: '', price: ''}
            },
            show: {},
            imageItem: null
        }
    },
    watch: {
        present(value){
            if(!value) return
            this.jquery("#store-present-dialog").modal();
            this.form.fp_farmer_id = value.u_id
            this.form.fp_name = value.u_fullname
        },
    },
    computed:{
        ...mapState({ userId: state => state.user })
    },
    mounted() {
        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#store-present-dialog").on("hide.bs.modal", event => {
            this.$emit('onClose', event)
        })

        // แสดงข้อมูลร้านรับซื้อที่สนใจราคา
        this.getStore();
    },
    methods: {
    onSubmit(){
        this.$validator.validateAll().then(valid => {
            if(!valid) return;
            axios.post("/api/farmer/present", this.form).then(response => {
                    this.Reset();
                    this.alertify.warning('ทำรายการสำเร็จ')
                    setTimeout(() => { 
                    this.jquery("#store-present-dialog").modal("hide") }, 1000);
                }).catch(err => this.alertify.error(err.response.data.message));
        })
    },
    onAccess(item, buy_name){
        this.alertify.confirm('คุณต้องการขายให้ร้าน '+ buy_name +' ใช่หรือไม่', () => {
            axios.put(`/api/farmer/buy/${item.fp_id}`, this.show).then(res => {
                this.alertify.warning('กรุณานำส่งผลผลิตของคุณ');
                setTimeout(() => { this.getStore() }, 3000);
            }).catch(err => this.alertify.error(err.response.data.message))
        }).setHeader('แจ้งเตือน');
    },
    getStore(){
        axios.get(`/api/farmer/buy/${this.userId.u_id}`)
            .then(res => this.show = res.data ).catch(error => this.alertify.error(error.response.data.message))
    },
    Reset(){
        this.form.fp_price_xxl= {weigth: "", price: ""},
        this.form.fp_price_xl= {weigth: "", price: ""},
        this.form.fp_price_l= {weigth: "", price: ""},
        this.form.fp_price_m= {weigth: "", price: ""},
        this.form.fp_price_s= {weigth: "", price: ""}
    },
    // เปลี่ยนไฟล์อัพโหลดเป็น Base64 string
    onChangeFile(input) {
    this.form.fp_image = "";
    if (input.files && input.files.length > 0) {
        const file = input.files[0];
        if (file.type.indexOf("image/") >= 0) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener("load", () => {
            this.form.fp_image = reader.result;
        });
        return;
        }
    }
    this.alertify.warning("กรุณาเลือกภาพที่จะอัพโหลด !");
    },
    toImage(item){
        this.imageItem = item
    }
  }
}
</script>

<style scoped>
.modal{
    color: #525662;
}
.modal-body,
.modal-footer {
    padding-left: 6%;
    padding-right: 6%;
}
.form-check{
    margin-bottom: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.img-EquipmentItem{
    width: 100px;
    height: 70px;
    border: solid 1px #d0d0d0;
    margin: 1px;
    display: inline-block;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
}
</style>