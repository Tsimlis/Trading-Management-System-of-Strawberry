<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="buy-detail-dialog">
        <div class="modal-dialog" role="document">
            <form class="modal-content" >
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-money"></i> เกษตรกร</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div> 
                <!-- {{this.farmer.fp_price_xxl}} -->
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-3 form-group">ชื่อ</div>
                        <div class="col-sm-9 form-group">: {{farmer.fp_name}}</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-3 form-group">วันที่เสนอ</div>
                        <div class="col-sm-9 form-group">: {{farmer.fp_created | formatDate}}</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-3 form-group">ไซส์ XXL</div>
                        <div class="col-sm-5 form-group">กิโลกรัมละ : {{farmer.fp_price_xxl.price}} บาท</div>
                        <div class="col-sm-4 form-group">มีจำนวน : {{farmer.fp_price_xxl.weigth}} กก.</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-3 form-group">ไซส์ XL</div>
                        <div class="col-sm-5 form-group">กิโลกรัมละ : {{farmer.fp_price_xl.price}} บาท</div>
                        <div class="col-sm-4 form-group">มีจำนวน : {{farmer.fp_price_xl.weigth}} กก.</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-3 form-group">ไซส์ L</div>
                        <div class="col-sm-5 form-group">กิโลกรัมละ : {{farmer.fp_price_l.price}} บาท</div>
                        <div class="col-sm-4 form-group">มีจำนวน : {{farmer.fp_price_l.weigth}} กก.</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-3 form-group">รัไซส์ M</div>
                        <div class="col-sm-5 form-group">กิโลกรัมละ : {{farmer.fp_price_m.price}} บาท</div>
                        <div class="col-sm-4 form-group">มีจำนวน : {{farmer.fp_price_m.weigth}} กก.</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-3 form-group">ไซส์ S</div>
                        <div class="col-sm-5 form-group">กิโลกรัมละ : {{farmer.fp_price_s.price}} บาท</div>
                        <div class="col-sm-4 form-group">มีจำนวน : {{farmer.fp_price_s.weigth}} กก.</div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button @click.once="onPresent(buying.fp_id)" class="btn btn-info btn-block mt-2 mb-4">เสนอซื้อ</button>
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
        buying: {
            required: true
        }
    },
    watch: {
        buying(value){
            if(!value) return
            // this.farmer = value
            this.farmer.fp_name = value.fp_name
            this.farmer.fp_created = value.fp_created
            this.farmer.fp_price_xxl = JSON.parse(value.fp_price_xxl);
            this.farmer.fp_price_xl = JSON.parse(value.fp_price_xl);
            this.farmer.fp_price_l = JSON.parse(value.fp_price_l);
            this.farmer.fp_price_m = JSON.parse(value.fp_price_m);
            this.farmer.fp_price_s = JSON.parse(value.fp_price_s);
            
            // เปิดหน้า modal แสดงเมื่อมีข้อมูลเข้า
            this.jquery("#buy-detail-dialog").modal();
        }
    },
    data(){
        return{
            farmer: {
                fp_name: '',
                fp_created: '',
                fp_price_xxl: {},
                fp_price_xl: {},
                fp_price_l: {},
                fp_price_m: {},
                fp_price_s: {}
            }
        }
    },
    computed:{
        ...mapState({ userId: state => state.user })
    },
    mounted() {
        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#buy-detail-dialog").on("hide.bs.modal", event => {
            this.$emit('onClose', event)
        })
    },
    methods: {
        onPresent(id){
            const user = { fp_buy_id: this.userId.u_id, fp_buy_name: this.userId.u_fullname }
            
            axios.put(`/api/buying/farmer/${id}`, user).then(res => {
                this.alertify.warning('ยืนยันการทำรายการ');
                this.jquery("#buy-detail-dialog").modal('hide');
            }).catch(error => this.alertify.error(error.response.data.message))
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