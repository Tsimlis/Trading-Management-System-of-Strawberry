<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="store-dialog">
        <div class="modal-dialog" role="document">
            <form class="modal-content" >
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-ticket"></i> เสนอขายสินค้า</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="col" >

                        <div class="form-group">
                            <label class="btn btn-secondary btn-block">
                                <i class="fa fa-upload"></i> อัพโหลดภาพ
                                <input type="file" class="d-none" @change="onChangeFile($event.target)">
                            </label>

                            <img class="img-fluid w-100" :src="form.f_image || '/img/no-image.png'" alt="image example">
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ ขนาด XXL</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">น้ำหนัก (กก.)</label>
                                    <input type="number" class="form-control" name="f_weigth_xxl" 
                                    v-model.trim="form.f_weigth_xxl"
                                    :disabled="form.f_price_xxl == 0">
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ ขนาด XL</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">น้ำหนัก (กก.)</label>
                                    <input type="number" class="form-control" name="f_weigth_xl" 
                                    v-model.trim="form.f_weigth_xl"
                                    :disabled="form.f_price_xl == 0">
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ ขนาด L</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">น้ำหนัก (กก.)</label>
                                    <input type="number" class="form-control" name="f_weigth_l" 
                                    v-model.trim="form.f_weigth_l"
                                    :disabled="form.f_price_l == 0">
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ ขนาด M</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">น้ำหนัก (กก.)</label>
                                    <input type="number" class="form-control" name="f_weigth_m" 
                                    v-model.trim="form.f_weigth_m"
                                    :disabled="form.f_price_m == 0">
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ ขนาด S</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">น้ำหนัก (กก.)</label>
                                    <input type="number" class="form-control" name="f_weigth_s" 
                                    v-model.trim="form.f_weigth_s"
                                    :disabled="form.f_price_s == 0">
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div> 

                <div class="modal-footer">
                    <button @click.prevent="onSave()" class="btn btn-info btn-block mt-2 mb-4">เสนอขายผลผลิต</button>
                    <button @click.once="onCancer()" class="btn btn-danger btn-block mt-2 mb-4">ยกเลิก</button>
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
        store: {
            required: true
        }
    },
    watch: {
        store(value){
            
            if(!value) return
            this.jquery("#store-dialog").modal();
            this.form.f_farmer_id = this.userId.u_id
            this.form.f_name = this.userId.u_fullname
            this.form.f_buying_id = value.b_user_id
            this.form.f_buying_name = value.b_name
            this.form.f_price_xxl = value.b_price_xxl
            this.form.f_price_xl = value.b_price_xl
            this.form.f_price_l = value.b_price_l
            this.form.f_price_m = value.b_price_m
            this.form.f_price_s = value.b_price_s
        }
    },
    computed:{
        ...mapState({ userId: state => state.user })
    },
    mounted() {
        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#store-dialog").on("hide.bs.modal", event => {
            this.$emit('onClose', event)
        })
    },
    data(){
        return{
            form: {
                f_buying_id: "",
                f_buying_name: "",
                f_farmer_id: "",
                f_name: "",
                f_detail: "",
                f_image: "",
                f_weigth_xxl: '0',
                f_weigth_xl: '0',
                f_weigth_l: '0',
                f_weigth_m: '0',
                f_weigth_s: '0',
                f_price_xxl: '',
                f_price_xl: '',
                f_price_l: '',
                f_price_m: '',
                f_price_s: ''
            }
        }
    },
    methods: {
    onSave(){
        this.$validator.validateAll().then(valid => {
            if(!valid) return;
            
            // ถ้าไม่ใส่ค่าไม่บันทึก
            if(this.form.f_weigth_xxl == 0 && this.form.f_weigth_xl == 0 &&this.form.f_weigth_l == 0 && this.form.f_weigth_m == 0 && this.form.f_weigth_s == 0) {
                this.alertify.error('ไม่มีการทำรายการ');
                setTimeout(() => { 
                    this.jquery("#store-dialog").modal("hide") }, 3000)
            } 
            else {
                // บันทึกข้อมูล
                axios.post("/api/farmer", this.form).then(res => {
                    this.alertify.warning('ทำรายการสำเร็จ');
                    setTimeout(() => { 
                    this.jquery("#store-dialog").modal("hide") }, 3000)
                    window.location.reload();
                }).catch(error => this.alertify.error(error.response.data.message));  
            }
        })
    },
    onCancer(){
        this.jquery("#store-dialog").modal("hide");
    },
    // เปลี่ยนไฟล์อัพโหลดเป็น Base64 string
    onChangeFile(input) {
    this.form.f_image = "";
    if (input.files && input.files.length > 0) {
        const file = input.files[0];
        if (file.type.indexOf("image/") >= 0) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener("load", () => {
            this.form.f_image = reader.result;
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