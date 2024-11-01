<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="selling-amount">
        <div class="modal-dialog" role="document">
            <form class="modal-content" >
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-ticket"></i> เพิ่มผลผลิต</h5>
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
                                <label for="">น้ำหนัก (กก.)</label>
                                <input type="number" class="form-control" name="sw_xxl" :disabled="!priceWhole.w_price_xxl"
                                v-model.trim="form.sw_xxl" >
                            </div>
                          </div>
                      </div>

                      <div class="form-group">
                          <h6>สตรอว์เบอร์รี่ ขนาด XL</h6>
                          <div class="row">
                            <div class="col ml-3">
                                <label for="">น้ำหนัก (กก.)</label>
                                <input type="number" class="form-control" name="sw_xl" :disabled="!priceWhole.w_price_xl"
                                v-model.trim="form.sw_xl" >
                            </div>
                          </div>
                      </div>

                      <div class="form-group">
                          <h6>สตรอว์เบอร์รี่ ขนาด L</h6>
                          <div class="row">
                            <div class="col ml-3">
                                <label for="">น้ำหนัก (กก.)</label>
                                <input type="number" class="form-control" name="sw_l"  :disabled="!priceWhole.w_price_l"
                                v-model.trim="form.sw_l" >
                            </div>
                          </div>
                      </div>

                      <div class="form-group">
                          <h6>สตรอว์เบอร์รี่ ขนาด M</h6>
                          <div class="row">
                            <div class="col ml-3">
                                <label for="">น้ำหนัก (กก.)</label>
                                <input type="number" class="form-control" name="sw_m"  :disabled="!priceWhole.w_price_m"
                                v-model.trim="form.sw_m" >
                            </div>
                          </div>
                      </div>

                      <div class="form-group">
                          <h6>สตรอว์เบอร์รี่ ขนาด S</h6>
                          <div class="row">
                            <div class="col ml-3">
                                <label for="">น้ำหนัก (กก.)</label>
                                <input type="number" class="form-control" name="sw_s"  :disabled="!priceWhole.w_price_s"
                                v-model.trim="form.sw_s" >
                            </div>
                          </div>
                      </div>

                      <div class="form-group">
                          <h6>สตรอว์เบอร์รี่ คละขนาด</h6>
                          <div class="row">
                            <div class="col ml-3">
                                <label for="">น้ำหนัก (กก.)</label>
                                <input type="number" class="form-control" name="sw_mix"  :disabled="!priceWhole.w_price_mix"
                                v-model.trim="form.sw_mix" >
                            </div>
                          </div>
                      </div>

                      <div class="form-group">
                          <h6>สตรอว์เบอร์รี่อบแห้ง</h6>
                          <div class="row">
                            <div class="col ml-3">
                                <label for="">น้ำหนัก (กก.)</label>
                                <input type="number" class="form-control" name="sw_drying" :disabled="!priceWhole.w_price_drying"
                                v-model.trim="form.sw_drying" >
                            </div>
                          </div>
                      </div>

                      <div class="form-group" >
                          <h6>น้ำสตรอว์เบอร์รี่</h6>
                          <div class="row">
                            <div class="col ml-3">
                                <label for="">จำนวน (ขวด)</label>
                                <input type="number" class="form-control" name="sw_juice" :disabled="!priceWhole.w_price_juice"
                                v-model.trim="form.sw_juice" >
                            </div>
                          </div>
                      </div>
                      
                  </div>
                </div> 

                <div class="modal-footer">
                    <button @click.prevent="onSave()" class="btn btn-info btn-block mt-2 mb-4">เพิ่มจำนวน</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import {mapState} from "vuex"

export default {
    props:{
        amount: {
            required: true
        }
    },
    data(){
        return{
            priceWhole: {},
            form: {
                sw_sale_id: "",
                sw_sale_name: "",
                sw_xxl: '0',
                sw_xl: '0',
                sw_l: '0',
                sw_m: '0',
                sw_s: '0',
                sw_mix: '0',
                sw_drying: '0',
                sw_juice: '0'
            }
        }
    },
    computed: {
        ...mapState({ userId: state => state.user})
    },
    watch: {
        amount(value){
            if(!value) return
            this.jquery("#selling-amount").modal();
            this.form.sw_sale_id = value.u_id
            this.form.sw_sale_name = value.u_fullname
        }
    },
    mounted() {
        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#selling-amount").on("hide.bs.modal", event => {
            this.$emit('onClose', event)
        })

        // ดึงราคามาเช็คว่าตัวไหนไม่มีให้ปิดเพื่อไม่เกิดการใส่น้ำหนักผิด
        axios.get(`/api/selling/priceWhole/${this.userId.u_id}`)
            .then(res => this.priceWhole = res.data).catch(error => this.alertify.error(error.response.data.message))
    },
    methods: {
    onSave(){
        this.$validator.validateAll().then(valid => {
            if(!valid) return;
            const A = this.form
            if(A.sw_xxl == 0 && A.sw_xl == 0 && A.sw_l == 0 && A.sw_m == 0 && A.sw_s == 0 && 
                A.sw_mix == 0 && A.sw_drying == 0 && A.sw_juice == 0) return this.alertify.warning('ยังไม่ได้ทำรายการ')
            console.log(this.form)
            axios.post(`/api/selling/weigthWhole`, this.form).then(response => {
                    this.onReset();
                    this.jquery("#selling-amount").modal("hide");
                    window.location.reload();
                }).catch(err => this.alertify.error(err.response.data.message));
        })
    },
    onReset(){
        this.$validator.reset();
        this.form = {
            sw_sale_id: "",
            sw_sale_name: "",
            sw_xxl: "",
            sw_xl: "",
            sw_l: "",
            sw_m: "",
            sw_s: "",
            sw_mix: "",
        }
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