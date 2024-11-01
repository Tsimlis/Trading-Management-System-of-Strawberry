<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="retail-dialog">
        <div class="modal-dialog" role="document">
            <form class="modal-content" @submit.prevent="onSubmit()" >
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-ticket"></i> สั่งสตรอว์เบอร์รี</h5>
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
                                    <div class="row">
                                        <div class="col pr-0 ">
                                            <input type="number" class="form-control" name="cw_xxl" :placeholder=" `เหลือ ${remain.sw_xxl}`"
                                                v-model.trim="form.cw_xxl" :disabled="remain.sw_xxl == 0 || show.w_price_xxl == 0">
                                        </div>
                                        <div class="col-2 p-0 text-right"><label >x</label></div>
                                    </div>
                                </div>
                                <div class="col">
                                    <label for="">ราคา (บาท)</label>
                                    <div class="row">
                                        <div class="col pr-0 ">
                                            <input type="number" class="form-control" name="w_price_xxl"
                                                v-model.trim="show.w_price_xxl" disabled>
                                        </div>
                                        <div class="col-2 p-0 text-right"><label >=</label></div>
                                    </div>
                                </div>
                                <div class="col">
                                    <label for="">รวม (บาท)</label>
                                    <input type="number" class="form-control" name="total_xxl" 
                                        v-model.trim="total.xxl " disabled>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ ขนาด XL</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">น้ำหนัก (กก.)</label>
                                    <div class="row">
                                        <div class="col pr-0 ">
                                            <input type="number" class="form-control" name="cw_xl" :placeholder=" `เหลือ ${remain.sw_xl}`"
                                                v-model.trim="form.cw_xl" :disabled="remain.sw_xl == 0 || show.w_price_xl == 0">
                                        </div>
                                        <div class="col-2 p-0 text-right"><label >x</label></div>
                                    </div>
                                </div>
                                <div class="col">
                                    <label for="">ราคา (บาท)</label>
                                    <div class="row">
                                        <div class="col pr-0 ">
                                            <input type="number" class="form-control" name="w_price_xxl"
                                                v-model.trim="show.w_price_xl" disabled>
                                        </div>
                                        <div class="col-2 p-0 text-right"><label >=</label></div>
                                    </div>
                                </div>
                                <div class="col">
                                    <label for="">รวม (บาท)</label>
                                    <input type="number" class="form-control" name="total_xl" 
                                        v-model.trim="total.xl" disabled>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ ขนาด L</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">น้ำหนัก (กก.)</label>
                                    <div class="row">
                                        <div class="col pr-0 ">
                                            <input type="number" class="form-control" name="cw_l" :placeholder=" `เหลือ ${remain.sw_l}`"
                                                v-model.trim="form.cw_l" :disabled="remain.sw_l == 0 || show.w_price_l == 0">
                                        </div>
                                        <div class="col-2 p-0 text-right"><label >x</label></div>
                                    </div>
                                </div>
                                <div class="col">
                                    <label for="">ราคา (บาท)</label>
                                    <div class="row">
                                        <div class="col pr-0 ">
                                            <input type="number" class="form-control" name="w_price_l" 
                                                v-model.trim="show.w_price_l" disabled>
                                        </div>
                                        <div class="col-2 p-0 text-right"><label for="">=</label></div>
                                    </div>
                                </div>
                                <div class="col">
                                    <label for="">รวม (บาท)</label>
                                    <input type="number" class="form-control" name="total_l" 
                                        v-model.trim="total.l" disabled>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ ขนาด M</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">น้ำหนัก (กก.)</label>
                                    <div class="row">
                                        <div class="col pr-0 ">
                                            <input type="number" class="form-control" name="cw_m" :placeholder=" `เหลือ ${remain.sw_m}`"
                                                v-model.trim="form.cw_m" :disabled="remain.sw_m == 0 || show.w_price_m == 0">
                                        </div>
                                        <div class="col-2 p-0 text-right"><label >x</label></div>
                                    </div>
                                </div>
                                <div class="col">
                                    <label for="">ราคา (บาท)</label>
                                    <div class="row">
                                        <div class="col pr-0 ">
                                            <input type="number" class="form-control" name="w_price_m" 
                                                v-model.trim="show.w_price_m" disabled>
                                        </div>
                                        <div class="col-2 p-0 text-right"><label >=</label></div>
                                    </div>
                                </div>
                                <div class="col">
                                    <label for="">รวม (บาท)</label>
                                    <input type="number" class="form-control" name="total_m" 
                                        v-model.trim="total.m" disabled>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ ขนาด S</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">น้ำหนัก (กก.)</label>
                                    <div class="row">
                                        <div class="col pr-0 ">
                                            <input type="number" class="form-control" name="cw_s" :placeholder=" `เหลือ ${remain.sw_s}`"
                                                v-model.trim="form.cw_s" :disabled="remain.sw_s == 0 || show.w_price_s == 0">
                                        </div>
                                        <div class="col-2 p-0 text-right"><label  >x</label></div>
                                    </div>
                                </div>
                                <div class="col">
                                    <label for="">ราคา (บาท)</label>
                                    <div class="row">
                                        <div class="col pr-0 ">
                                            <input type="number" class="form-control" name="w_price_s" 
                                                v-model.trim="show.w_price_s" disabled>
                                        </div>
                                        <div class="col-2 p-0 text-right"><label >=</label></div>
                                    </div>
                                </div>
                                <div class="col">
                                    <label for="">รวม (บาท)</label>
                                    <input type="number" class="form-control" name="total_s" 
                                        v-model.trim="total.s" disabled>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่ คละขนาด</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">น้ำหนัก (กก.)</label>
                                    <div class="row">
                                        <div class="col pr-0 ">
                                            <input type="number" class="form-control" name="cw_mix" :placeholder=" `เหลือ ${remain.sw_mix}`"
                                                v-model.trim="form.cw_mix" :disabled="remain.sw_mix == 0 || show.w_price_mix == 0">
                                        </div>
                                        <div class="col-2 p-0 text-right"><label  >x</label></div>
                                    </div>
                                </div>
                                <div class="col">
                                    <label for="">ราคา (บาท)</label>
                                    <div class="row">
                                        <div class="col pr-0 ">
                                            <input type="number" class="form-control" name="w_price_mix" 
                                                v-model.trim="show.w_price_mix" disabled>
                                        </div>
                                        <div class="col-2 p-0 text-right"><label >=</label></div>
                                    </div>
                                </div>
                                <div class="col">
                                    <label for="">รวม (บาท)</label>
                                    <input type="number" class="form-control" name="total_mix" 
                                        v-model.trim="total.mix" disabled>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>สตรอว์เบอร์รี่อบแห้ง</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">น้ำหนัก (กก.)</label>
                                    <div class="row">
                                        <div class="col pr-0 ">
                                            <input type="number" class="form-control" name="cw_drying" :placeholder=" `เหลือ ${remain.sw_drying}`"
                                                v-model.trim="form.cw_drying" :disabled="remain.sw_drying == 0 || show.w_price_drying == 0">
                                        </div>
                                        <div class="col-2 p-0 text-right"><label  >x</label></div>
                                    </div>
                                </div>
                                <div class="col">
                                    <label for="">ราคา (บาท)</label>
                                    <div class="row">
                                        <div class="col pr-0 ">
                                            <input type="number" class="form-control" name="w_price_drying" 
                                                v-model.trim="show.w_price_drying" disabled>
                                        </div>
                                        <div class="col-2 p-0 text-right"><label >=</label></div>
                                    </div>
                                </div>
                                <div class="col">
                                    <label for="">รวม (บาท)</label>
                                    <input type="number" class="form-control" name="total_drying" 
                                        v-model.trim="total.drying" disabled>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h6>น้ำสตรอว์เบอร์รี่</h6>
                            <div class="row">
                                <div class="col ml-3">
                                    <label for="">จำนวน (ขวด)</label>
                                    <div class="row">
                                        <div class="col pr-0 ">
                                            <input type="number" class="form-control" name="cw_juice" :placeholder=" `เหลือ ${remain.sw_juice}`"
                                                v-model.trim="form.cw_juice" :disabled="remain.sw_juice == 0 || show.w_price_juice == 0">
                                        </div>
                                        <div class="col-2 p-0 text-right"><label  >x</label></div>
                                    </div>
                                </div>
                                <div class="col">
                                    <label for="">ราคา (บาท)</label>
                                    <div class="row">
                                        <div class="col pr-0 ">
                                            <input type="number" class="form-control" name="w_price_juice" 
                                                v-model.trim="show.w_price_juice" disabled>
                                        </div>
                                        <div class="col-2 p-0 text-right"><label >=</label></div>
                                    </div>
                                </div>
                                <div class="col">
                                    <label for="">รวม (บาท)</label>
                                    <input type="number" class="form-control" name="total_juice" placeholder=""
                                        v-model.trim="total.juice" disabled>
                                </div>
                            </div>
                        </div>

                        <!-- <div class="form-group mt-4">
                            <h6><u>*ค่าจัดส่ง {{show.w_free}}</u></h6>
                        </div> -->

                        <div class="form-group mt-5">
                            <div class="row">
                                <div class="col"><label class="float-right"><b>เป็นเงินทั้งสิ้น </b></label></div>
                                <div class="col-4 ml-2"><input class="form-control w-100" type="number" v-model.trim="form.cw_total" disabled></div>
                            </div>
                            
                        </div>
                        
                    </div>
                </div> 

                <div class="modal-footer">
                    <button @click.prevent="onBasket()" class="btn btn-secondary btn-block mt-2 mb-4">เก็บใส่ตะกร้า</button>
                    <button type="submit" class="btn btn-info btn-block mt-2 mb-4">สั่งสตรอว์เบอร์รี</button>
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
    data(){
        return{
            show: {},
            remain: {},
            wholeShop: {},
            form: {
                cw_xxl: '',
                cw_xl: '',
                cw_l: '',
                cw_m: '',
                cw_s: '',
                cw_mix: '',
                cw_drying: '',
                cw_juice: '',
                cw_total: '',
            },
            total: {
                xxl: '',
                xl: '',
                l: '',
                m: '',
                s: '',
                mix: '',
                drying: '',
                juice: '',
                free: ''
            }
        }
    },
    watch: {
        store(value){
            if(!value) return
            this.jquery("#retail-dialog").modal();
            // ดึงข้อมูลน้ำหนักที่เหลือล่าสุดของร้านมาแสดง
            axios.get(`/api/selling/weigthWhole/${value.w_sale_id | value.bas_sale_id}`)
                .then(res => this.remain = res.data ).catch(error => this.alertify.error(error.response.data.message));
            //ถ่ายข้อมูล
            if(value.w_id) this.show = value // มาจากหน้าขายส่ง
            else this.Edit(value);  // มาจากหน้าตะกร้า
        },
        form: {
            handler(value) {
                // ฟังกชันรวมราคา
                this.onTotal(value);

                // ฟังกชันตรวจสอบน้ำหนัก
                this.checkWeigth()
            },
            deep: true // ใช้ deep เพื่อดูการเปลี่ยนแปลงในวัตถุภายใน
        }
    },
    computed: {
        ...mapState({ userId: state => state.user })   
    },
    mounted() {
        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#retail-dialog").on("hide.bs.modal", event => {
            this.$emit('onClose', event)
            this.onReset();
        })
    },
    methods: {
        onSubmit(){
            if (this.form.cw_xxl == 0 && this.form.cw_xl == 0 && this.form.cw_l == 0 && this.form.cw_m == 0 
                && this.form.cw_s == 0 && this.form.cw_mix == 0 && this.form.cw_drying == 0 && this.form.cw_juice == 0 ) return this.alertify.warning('ยังไม่ทำรายการ');
            
            this.sync();

            // เปลี่ยนค่าให้เหมือนในตารางตะกร้า
            this.wholeShop.bas_whole = JSON.stringify(this.wholeShop.bas_whole)

            localStorage.setItem('file', JSON.stringify([this.wholeShop])); // ใส่ข้อมูลใหม่
            this.$router.push({name: 'order'})
            this.jquery("#retail-dialog").modal('hide');
            this.onReset();
        },
        onBasket(){
            if (this.form.cw_xxl == 0 && this.form.cw_xl == 0 && this.form.cw_l == 0 && this.form.cw_m == 0 
                && this.form.cw_s == 0 && this.form.cw_mix == 0 && this.form.cw_drying == 0 && this.form.cw_juice == 0 ) return this.alertify.warning('ยังไม่ทำรายการ');

            this.sync();
            
            if(this.show.bas_id) {
                // แก้ไขรายการในตะกร้า
                axios.put(`/api/customer/basket/${this.show.bas_id}`, this.wholeShop).then(res => {
                    this.$router.push( { name: 'basket' }).catch(err => { if (err.name !== 'NavigationDuplicated') throw err; })
                    this.jquery("#retail-dialog").modal('hide');
                    this.onReset();
                }).catch(error => this.alertify.error(error.response.data.message))
            } else {
                // บันทึกรายการใหม่
                axios.post(`/api/customer/basket`, this.wholeShop).then(res => {
                    // this.$router.push({ name: 'basket' })
                    // this.jquery("#retail-dialog").modal('hide');
                    this.onReset();
                }).catch(error => this.alertify.error(error.respose.data.message))
            }
            window.location.reload();
        },
        onTotal(value){
            this.total.xxl = value.cw_xxl * this.show.w_price_xxl
            this.total.xl = value.cw_xl * this.show.w_price_xl
            this.total.l = value.cw_l * this.show.w_price_l
            this.total.m = value.cw_m * this.show.w_price_m
            this.total.s = value.cw_s * this.show.w_price_s
            this.total.mix = value.cw_mix * this.show.w_price_mix
            this.total.drying = value.cw_drying * this.show.w_price_drying
            this.total.juice = value.cw_juice * this.show.w_price_juice

            this.form.cw_total = Object.values(this.total).reduce((accumulator, item) => {return accumulator + item }, 0);
        },
        sync(){
            this.wholeShop = {
                bas_customer_id: this.userId.u_id,
                bas_customer_name: this.userId.u_fullname,
                bas_sale_id: this.show.w_sale_id,
                bas_sale_name: this.show.w_sale_name,
                bas_free: this.show.w_free,
                bas_whole: {
                    image: this.show.w_image,
                    detail: this.show.w_detail,
                    xxl: {weigth: this.form.cw_xxl, price: this.show.w_price_xxl},
                    xl: {weigth: this.form.cw_xl, price: this.show.w_price_xl},
                    l: {weigth: this.form.cw_l, price: this.show.w_price_l},
                    m: {weigth: this.form.cw_m, price: this.show.w_price_m},
                    s: {weigth: this.form.cw_s, price: this.show.w_price_s},
                    mix: {weigth: this.form.cw_mix, price: this.show.w_price_mix},
                    drying: {weigth: this.form.cw_drying, price: this.show.w_price_drying},
                    juice: {weigth: this.form.cw_juice, price: this.show.w_price_juice},
                    total: this.form.cw_total
                }
                
            }
        },
        Edit(value){
            const A = JSON.parse(value.bas_whole)

            this.show.bas_id = value.bas_id
            this.show.w_sale_id = value.bas_sale_id
            this.show.w_sale_name = value.bas_sale_name
            this.show.w_free = value.bas_free

            this.show.w_detail = A.detail
            this.show.w_image = A.image

            this.show.w_price_xxl = A.xxl.price
            this.show.w_price_xl = A.xl.price
            this.show.w_price_l = A.l.price
            this.show.w_price_m = A.m.price
            this.show.w_price_s = A.s.price
            this.show.w_price_mix = A.mix.price
            this.show.w_price_drying = A.drying.price
            this.show.w_price_juice = A.juice.price

            this.form.cw_xxl = A.xxl.weigth
            this.form.cw_xl = A.xl.weigth
            this.form.cw_l = A.l.weigth
            this.form.cw_m = A.m.weigth
            this.form.cw_s = A.s.weigth
            this.form.cw_mix = A.mix.weigth
            this.form.cw_drying = A.drying.weigth
            this.form.cw_juice = A.juice.weigth

            this.form.cw_total = A.total
        },
        checkWeigth(){
            const A = this.form
            const B = this.remain
            A.cw_xxl > B.sw_xxl ? A.cw_xxl = B.sw_xxl : '';
            A.cw_xl > B.sw_xl ? A.cw_xl = B.sw_xl : '';
            A.cw_l > B.sw_l ? A.cw_l = B.sw_l : '';
            A.cw_m > B.sw_m ? A.cw_m = B.sw_m : '';
            A.cw_s > B.sw_s ? A.cw_s = B.sw_s : '';
            A.cw_mix > B.sw_mix ? A.cw_mix = B.sw_mix : '';
            A.cw_drying > B.sw_drying ? A.cw_drying = B.sw_drying : '';
            A.cw_juice > B.sw_juice ? A.cw_juice = B.sw_juice : '';
        },
        onReset(){
            this.$validator.reset();
            this.form = {
                cw_xxl: '',
                cw_xl: '',
                cw_l: '',
                cw_m: '',
                cw_s: '',
                cw_mix: '',
                cw_drying: '',
                cw_juice: '',
                cw_total: '',
            }
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
</style>