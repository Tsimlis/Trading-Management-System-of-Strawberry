<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="selling-price">
        <div class="modal-dialog" role="document">
            <form class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-ticket"></i> ราคาขายส่ง</h5>
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

                            <img class="img-fluid w-100" :src="form.w_image || '/img/no-image.png'" alt="image example">
                        </div>


                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ ขนาด XXL</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">ราคา (บาท)</label>
                                    <input type="number" class="form-control" name="w_price_xxl" 
                                    v-model.trim="form.w_price_xxl" >
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ ขนาด XL</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">ราคา (บาท)</label>
                                    <input type="number" class="form-control" name="w_price_xl" 
                                    v-model.trim="form.w_price_xl" >
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ ขนาด L</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">ราคา (บาท)</label>
                                    <input type="number" class="form-control" name="w_price_l" 
                                    v-model.trim="form.w_price_l" >
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ ขนาด M</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">ราคา (บาท)</label>
                                    <input type="number" class="form-control" name="w_price_m" 
                                    v-model.trim="form.w_price_m" >
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ ขนาด S</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">ราคา (บาท)</label>
                                    <input type="number" class="form-control" name="w_price_s" 
                                    v-model.trim="form.w_price_s" >
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ คละขนาด</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">ราคา (บาท)</label>
                                    <input type="number" class="form-control" name="w_price_mix" 
                                    v-model.trim="form.w_price_mix" >
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่อบแห้ง</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">ราคา (บาท)</label>
                                    <input type="number" class="form-control" name="w_price_drying" 
                                    v-model.trim="form.w_price_drying" >
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>น้ำผลไม้สตรอว์เบอร์รี่</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">ราคา (บาท)</label>
                                    <input type="number" class="form-control" name="w_price_juice" 
                                    v-model.trim="form.w_price_juice" >
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>ค่าจัดส่ง</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">ราคา (บาท)</label>
                                    <input type="number" class="form-control" name="w_free" 
                                    v-model.trim="form.w_free" >
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>ข้อความ</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <textarea class="form-control" name="w_detail" rows="3" v-model="form.w_detail"></textarea>
                                </div>
                            </div>
                        </div>
                      
                    </div>
                </div> 

                <div class="modal-footer">
                    <button class="btn btn-info btn-block mt-2 mb-4" @click.prevent="Present()" >ประกาศราคา</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props:{
        price: {
            required: true
        }
    },
    data(){
        return {
            form: {
                w_sale_id: '',
                w_sale_name: "",
                w_image: "",
                w_detail: "",
                w_free: "",
                w_price_xxl: '0',
                w_price_xl: '0',
                w_price_l: '0',
                w_price_m: '0',
                w_price_s: '0',
                w_price_mix: '0',
                w_price_drying: '0',
                w_price_juice: '0'
            }
        }
    },
    watch: {
        price(value){
            if(!value) return
            this.jquery("#selling-price").modal();
            this.form.w_sale_id = value.u_id
            this.form.w_sale_name = value.u_fullname
        }
    },
    mounted() {
        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#selling-price").on("hide.bs.modal", event => {
            this.$emit('onClose', event)
        })
    },
    methods: {
        Present(){
            if (this.form.w_price_xxl == 0 && this.form.w_price_xl == 0 && this.form.w_price_l == 0 && this.form.w_price_m == 0 &&
                 this.form.w_price_s == 0 && this.form.w_price_mix == 0 && this.form.w_price_drying == 0 && this.form.w_price_juice == 0 ) return this.alertify.warning('ยังไม่ได้ทำรายการ');
            if (this.form.w_free == '') return this.alertify.warning('กรอกข้อมูลค่าขนส่ง');
                
            axios.post('/api/selling/wholesale', this.form).then(response => {
                    this.onReset();
                    this.jquery("#selling-price").modal("hide");
                    window.location.reload();
                }).catch(err => this.alertify.error(err.response.data.message));
        },
        // เปลี่ยนไฟล์อัพโหลดเป็น Base64 string
        onChangeFile(input) {
        this.form.w_image = "";
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            if (file.type.indexOf("image/") >= 0) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener("load", () => {
                this.form.w_image = reader.result;
            });
            return;
            }
        }
        this.alertify.warning("กรุณาเลือกภาพที่จะอัพโหลด !");
        },
        onReset(){
            this.form.w_sale_id = '',
            this.form.w_sale_name = "",
            this.form.w_image = "",
            this.form.w_detial = "",
            this.form.w_free = "",
            this.form.w_price_xxl = '',
            this.form.w_price_xl = '',
            this.form.w_price_l = '',
            this.form.w_price_m = '',
            this.form.w_price_s = '',
            this.form.w_price_mix = '',
            this.form.w_price_drying = '',
            this.form.w_price_juice = ''
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
    padding-left: 8%;
    padding-right: 8%;
}
form img {
  border: solid 1px #6c757d;
}

</style>