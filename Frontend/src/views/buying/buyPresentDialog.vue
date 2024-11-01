<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="buy-present">
        <div class="modal-dialog" role="document">
            <form class="modal-content" @submit.prevent="onSubmit()">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-ticket"></i> ราคารับซื้อ</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="col" >
                      <div class="form-group">
                          <h6>สตรอว์เบอร์รี่ ขนาด XXL</h6>
                          <div class="row">
                            <div class="col ml-3">
                                <label for="">ราคา (บาท)</label>
                                <input type="number" class="form-control" name="b_price_xxl" 
                                v-model.trim="form.b_price_xxl">
                            </div>
                          </div>
                      </div>

                      <div class="form-group">
                          <h6>สตรอว์เบอร์รี่ ขนาด XL</h6>
                          <div class="row">
                            <div class="col ml-3">
                                <label for="">ราคา (บาท)</label>
                                <input type="number" class="form-control" name="b_price_xl" 
                                v-model.trim="form.b_price_xl">
                            </div>
                          </div>
                      </div>

                      <div class="form-group">
                          <h6>สตรอว์เบอร์รี่ ขนาด L</h6>
                          <div class="row">
                            <div class="col ml-3">
                                <label for="">ราคา (บาท)</label>
                                <input type="number" class="form-control" name="b_price_l" 
                                v-model.trim="form.b_price_l">
                            </div>
                          </div>
                      </div>

                      <div class="form-group">
                          <h6>สตรอว์เบอร์รี่ ขนาด M</h6>
                          <div class="row">
                            <div class="col ml-3">
                                <label for="">ราคา (บาท)</label>
                                <input type="number" class="form-control" name="b_price_m" 
                                v-model.trim="form.b_price_m">
                            </div>
                          </div>
                      </div>

                      <div class="form-group">
                          <h6>สตรอว์เบอร์รี่ ขนาด S</h6>
                          <div class="row">
                            <div class="col ml-3">
                                <label for="">ราคา (บาท)</label>
                                <input type="number" class="form-control" name="b_price_s" 
                                v-model.trim="form.b_price_s">
                            </div>
                          </div>
                      </div>

                      <div class="form-group">
                          <h6>รายละเอียดเพิ่มเติม</h6>
                          <div class="row">
                            <div class="col ml-3">
                                <textarea name="b_price_s" class="form-control" rows="3"
                                        v-model.trim="form.b_detail"></textarea>
                                
                            </div>
                          </div>
                      </div>
                      
                  </div>
                </div> 

                <div class="modal-footer">
                    <button type="submit" class="btn btn-info btn-block mt-2 mb-4">เสนอราคารับซื้อ</button>
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
        present: {
            required: true
        }
    },
    watch: {
        present(value){
            if(!value) return
            this.jquery("#buy-present").modal();
            this.form.b_user_id = value.u_id
            this.form.b_name = value.u_fullname
            this.form.b_image = value.u_image
        },
    },
    mounted() {
        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#buy-present").on("hide.bs.modal", event => {
            this.$emit('onClose', event)
        })
        // this.$store.dispatch('get_user_login')
    },
    data(){
        return{
            form: {
                b_user_id: "",
                b_name: "",
                b_image: "",
                b_detail: "",
                b_price_xxl: "0",
                b_price_xl: "0",
                b_price_l: "0",
                b_price_m: "0",
                b_price_s: "0"
            }
        }
    
    },
    methods: {
    onSubmit(){
        this.$validator.validateAll().then(valid => {
            if(!valid) return;
            if(this.form.b_price_xxl == 0 && this.form.b_price_xl == 0 && this.form.b_price_l == 0 && this.form.b_price_m == 0 && this.form.b_price_s == 0 ){
                this.alertify.warning('ยังไม่ได้ทำรายการ');
                return false;
            }
            
            axios.post("/api/buying", this.form)
                .then(response => {
                    this.alertify.success('บันทึกราคาสำเร็จ')
                    this.onReset();
                    this.jquery("#buy-present").modal("hide");
                }).catch(err => this.alertify.error(err.response.data.message));
        })
    },
    onReset(){
        this.$validator.reset();
        this.form = ""
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