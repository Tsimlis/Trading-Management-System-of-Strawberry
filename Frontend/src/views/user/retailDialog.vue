<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="whole-dialog">
        <div class="modal-dialog" role="document">
            <form class="modal-content" @submit.prevent="onSubmit()" >
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-ticket"></i> สั่งสินค้า</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="col" >
                      <div class="form-group">
                          <img :src="`/api/uploads/${form.r_image}`" :alt="form.r_sale_name" class="figure-img img-fluid rounded">
                      </div>

                      <div class="form-group">
                          <h6 >{{form.r_detail}}</h6>
                          <h6 ><label class="m-0">สตรอว์เบอร์รีไซส์ {{form.r_look}}</label></h6>

                          <h6 v-if="form.r_look != 'juice'"><label class="m-0">{{form.r_weigth}} กก. ราคา {{form.r_price}} บาท</label></h6>
                          <h6 v-if="form.r_look == 'juice'"><label class="m-0">{{form.r_weigth}} ขวด ราคา {{form.r_price}} บาท</label></h6>

                          <h6 ><label class="m-0 ">คงเหลือ {{form.r_stock}}</label></h6>
                          <h6 ><label class="m-0 ">ค่าจัดส่ง {{form.r_free}}</label></h6>
                          <div class="row">
                            <div class="col ml-3">
                                <label for="">จำนวน</label>
                                <div class="row">
                                    <div class="col pr-0 ">
                                        <input type="number" class="form-control" name="multiply" 
                                            v-model.trim="multiply"
                                            required>
                                    </div>
                                    <div class="col-2 p-0 text-right"><label for="">x</label></div>
                                </div>
                            </div>
                            <div class="col">
                                <label for="">ราคา (บาท)</label>
                                <div class="row">
                                    <div class="col pr-0 ">
                                        <input type="number" class="form-control" name="price" 
                                            v-model.trim="form.r_price" disabled>
                                    </div>
                                    <div class="col-2 p-0 text-right"><label for="">=</label></div>
                                </div>
                            </div>
                            <div class="col">
                                <label for="">รวม (บาท)</label>
                                <input type="number" class="form-control" name="total" 
                                    v-model.trim="total" disabled>
                            </div>
                          </div>
                      </div>

                    </div>
                </div> 

                <div class="modal-footer">
                    <button @click.prevent="onBasket()" class="btn btn-secondary btn-block mt-2 mb-4">ใส่ลงตะกร้า</button>
                    <button type="submit" class="btn btn-info btn-block mt-2 mb-4">สั่งสตรอว์เบอร์รี</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex"
import axios from "axios"

export default {
    props:{
        store: {
            required: true
        }
    },
    data(){
        return{
            form: { },
            multiply: '',
            total: '',
            retailShop: {},
            test: {}
        }
    },
    watch: {
        store(value){
            if(!value) return
            this.jquery("#whole-dialog").modal();
            // แยกข้อมูล
            if(value.r_id) { this.form = value } //มาจากหน้าขายปลีก
            else this.basket(value); // มาจากหน้าตะกร้า
        },
        multiply(value){
            // parseInt(value)
            this.total = this.form.r_price * value
            // ถ่ายข้อมูล
            this.sync(value);
            // เช็คน้ำหนักไม่ให้เกินคงคลัง
            if ( (value * this.form.r_weigth) > this.form.r_stock ) {
                this.multiply = (this.form.r_stock / this.form.r_weigth);
            }
        }
    },
    computed:{
        ...mapState ({ userId: state => state.user })
    },
    mounted() {
        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#whole-dialog").on("hide.bs.modal", event => {
            this.$emit('onClose', event)
            this.multiply = {}
        })
    },
    methods: {
    onSubmit(){
        if(this.multiply == 0 || this.multiply == '') return this.alertify.warning('ใส่จำนวน / ผลผลิตหมด');
        // แปลงข้อมูลให้เป็นเหมือนในตารางตะกร้า
        this.retailShop.bas_retail = JSON.stringify(this.retailShop.bas_retail)
        
        localStorage.setItem('file', JSON.stringify([this.retailShop])); // ใส่ข้อมูลใหม่
        this.$router.push({ name: 'order' })
        this.jquery("#whole-dialog").modal('hide');
        this.form = {}
    },
    onBasket(){
        if(this.multiply == 0 || this.multiply == '') return this.alertify.warning('ใส่จำนวนที่ต้องการซื้อ');
            
        if(this.form.bas_id) {
            // ทำการแก้ไขรายการขายปลีกในตะกร้า หรือสั่งจำนวนเพิ่ม-ลด
            axios.put(`/api/customer/basket/${this.form.bas_id}`, this.retailShop).then(res => {
                this.$router.push({ name: 'basket' });
                this.jquery("#whole-dialog").modal('hide');
                this.form = {} // reset
            }).catch(error => this.alertify.error(error.response.data.message))
        } else {
            // // บันทึกลงตารางตะกร้า
            axios.post(`/api/customer/basket`, this.retailShop).then(res => {
                // this.$router.push({ name: 'basket' });
                // this.jquery("#whole-dialog").modal('hide');
                this.form = {} // reset
            } ).catch(error => this.alertify.error(error.response.data.message))
        }
        window.location.reload();
    },
    onReset(){
        this.$validator.reset();
        this.form = { }
    },
    sync(value){
        this.retailShop = {
            bas_customer_id: this.userId.u_id,
            bas_customer_name: this.userId.u_fullname,
            bas_sale_id: this.form.r_sale_id,
            bas_sale_name: this.form.r_sale_name,
            bas_free: this.form.r_free,
            bas_retail: {
                id: this.form.r_id,
                image: this.form.r_image,
                detail: this.form.r_detail,
                look: this.form.r_look,
                weigth: this.form.r_weigth,
                price: this.form.r_price,
                multiply: value,
                total: this.total
            }
        }
    },
    // แทนค่าเข้า form
    basket(value){
        this.form.bas_id = value.bas_id
        this.form.r_sale_id = value.bas_sale_id
        this.form.r_sale_name = value.bas_sale_name
        this.form.r_free = value.bas_free
        this.form.r_stock = value.bas_stock

        this.form.r_id = JSON.parse(value.bas_retail).id
        this.form.r_look = JSON.parse(value.bas_retail).look
        this.form.r_image = JSON.parse(value.bas_retail).image
        this.form.r_detail = JSON.parse(value.bas_retail).detail
        this.form.r_weigth = JSON.parse(value.bas_retail).weigth
        this.form.r_price = JSON.parse(value.bas_retail).price
        this.multiply = JSON.parse(value.bas_retail).multiply
        this.total = JSON.parse(value.bas_retail).total
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
</style>