<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="store-detail-dialog">
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
                        <div class="col-sm-9 form-group">: {{form.b_name}}</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-3 form-group">วันที่แก้ไข</div>
                        <div class="col-sm-9 form-group">: {{form.b_updated | formatDate}}</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-1 form-group">*</div>
                        <div class="col-sm-11 form-group">{{form.b_detail}}</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-4 form-group">ไซส์ XXL</div>
                        <div class="col-sm-4 form-group">จำนวน : 1 กก.</div>
                        <div class="col-sm-4 form-group">: {{form.b_price_xxl}} บาท</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-4 form-group">ไซส์ XL</div>
                        <div class="col-sm-4 form-group">จำนวน : 1 กก.</div>
                        <div class="col-sm-4 form-group">: {{form.b_price_xl}} บาท</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-4 form-group">ไซส์ L</div>
                        <div class="col-sm-4 form-group">จำนวน : 1 กก.</div>
                        <div class="col-sm-4 form-group">: {{form.b_price_l}} บาท</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-4 form-group">รัไซส์ M</div>
                        <div class="col-sm-4 form-group">จำนวน : 1 กก.</div>
                        <div class="col-sm-4 form-group">: {{form.b_price_m}} บาท</div>
                    </div>

                    <div class="row">
                        <div class="col-sm-4 form-group">ไซส์ S</div>
                        <div class="col-sm-4 form-group">จำนวน : 1 กก.</div>
                        <div class="col-sm-4 form-group">: {{form.b_price_s}} บาท</div>
                    </div>
                </div>

                <div class="modal-footer">
                    <!-- <button @click.prevent="onDialog()" class="btn btn-info btn-block mt-2 mb-4">เสนอขาย</button> -->
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
    watch: {
        store(value){
            if(!value) return
            this.form = value
            //ส่งข้อมูลร้านเพื่อทำการค้นหามาแสดง
            // axios.get(`/api/buying/${value.b_user_id}`).then(response => {
                    this.jquery("#store-detail-dialog").modal();
                    // this.roomItem = response.data
                // }).catch(err => { this.alertify.error(err.response.data.message)})
        }
    },
    data(){
        return{
            form: ""
        }
    },
    mounted() {
        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#store-detail-dialog").on("hide.bs.modal", event => {
            this.$emit('onClose', event)
        })
    },
    methods: {
        // onDialog(){
        //     this.jquery("#store-detail-dialog").modal('hide');
        //     const store = {...this.store};
        //     setTimeout(() => { this.$emit('onDialog', store) }, 500)
        // }
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