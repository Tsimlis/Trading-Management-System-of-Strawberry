<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="retail-detail-dialog">
        <div class="modal-dialog" role="document">
            <form class="modal-content" >
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-money"></i> ราคารับซื้อ</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                
                <div class="modal-body">

                    <div class="row">
                        <div class="col-sm-3 form-group">ชื่อร้าน</div>
                        <div class="col-sm-9 form-group">: {{show.w_sale_name}}</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-3 form-group pr-0">วันที่ลงสินค้า</div>
                        <div class="col-sm-9 form-group">: {{show.w_created | formatDate}}</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-4 form-group">ไซส์ XXL</div>
                        <div class="col-sm-4 form-group">คงเหลือ : {{weigth.sw_xxl}} กก.</div>
                        <div class="col-sm-4 form-group">: {{show.w_price_xxl}} บาท</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-4 form-group">ไซส์ XL</div>
                        <div class="col-sm-4 form-group">คงเหลือ : {{weigth.sw_xl}} กก.</div>
                        <div class="col-sm-4 form-group">: {{show.w_price_xl}} บาท</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-4 form-group">ไซส์ L</div>
                        <div class="col-sm-4 form-group">คงเหลือ : {{weigth.sw_l}} กก.</div>
                        <div class="col-sm-4 form-group">: {{show.w_price_l}} บาท</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-4 form-group">รัไซส์ M</div>
                        <div class="col-sm-4 form-group">คงเหลือ : {{weigth.sw_m}} กก.</div>
                        <div class="col-sm-4 form-group">: {{show.w_price_m}} บาท</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-4 form-group">ไซส์ S</div>
                        <div class="col-sm-4 form-group">คงเหลือ : {{weigth.sw_s}} กก.</div>
                        <div class="col-sm-4 form-group">: {{show.w_price_s}} บาท</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-4 form-group">ไซซ์รวม</div>
                        <div class="col-sm-4 form-group">คงเหลือ : {{weigth.sw_mix}} กก.</div>
                        <div class="col-sm-4 form-group">: {{show.w_price_mix}} บาท</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-4 form-group">สตรอว์เบอร์รีอบแห้ง</div>
                        <div class="col-sm-4 form-group">คงเหลือ : {{weigth.sw_drying}} กก.</div>
                        <div class="col-sm-4 form-group">: {{show.w_price_drying}} บาท</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-4 form-group">น้ำสตรอว์เบอร์รี</div>
                        <div class="col-sm-4 form-group">คงเหลือ : {{weigth.sw_juice}} ขวด</div>
                        <div class="col-sm-4 form-group">: {{show.w_price_juice}} บาท</div>
                    </div>

                </div>

                <div class="modal-footer">
                    <button @click.prevent="onDialog()" class="btn btn-info btn-block mt-2 mb-4">สั่งสตรอว์เบอร์รี</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props:{
        store: {
            required: true
        }
    },
    data(){
        return{
            show: {},
            weigth: {}
        }
    },
    watch: {
        store(value){
            if(!value) return
            this.jquery("#retail-detail-dialog").modal();
            
            this.show = value
            
            // ดึงข้อมูลน้ำหนักที่เหลือของร้านมาแสดง
            axios.get(`/api/selling/weigthWhole/${value.w_sale_id}`)
                .then(res => this.weigth = res.data ).catch(error => this.alertify.error(error.response.data.message))
            }
    },
    mounted() {
        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#retail-detail-dialog").on("hide.bs.modal", event => {
            this.$emit('onClose', event)
        })
        
        
    },
    methods: {
        onDialog(){
            this.jquery("#retail-detail-dialog").modal('hide');
            const store = {...this.store};
            setTimeout(() => {
                this.$emit('onDialog', store)
            }, 500)
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
.img-fluid{
    border: solid 1px #6C757D;
}
.black{
    color: #212529;
}

</style>