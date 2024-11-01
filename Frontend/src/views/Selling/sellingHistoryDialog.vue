<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="history-dialog">
        <div class="modal-dialog" role="document">

            <form class="modal-content" v-show="type == true">
                <div class="modal-header">
                    <div class="row">
                        <div class="col form-group"><h5 class="modal-title"><i class="fa fa-ticket"></i> ประวัติการขาย</h5></div>
                    </div>

                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                
                <div class="modal-body" >
                    <div class="card mb-3">
                        <div class="card-body">
                            <header class="mb-4">
                            <h5><i class="fa fa-list-alt"></i> รายการขาย</h5>
                            <label>*แสดงเฉพาะสถานะที่กำลังส่งและส่งสำเร็จ</label>
                            </header>

                            <div class="table-responsive">
                            <table class="table text-center text-nowrap">
                                <thead>
                                    <tr>
                                        <th>รายการ</th>
                                        <th>ชื่อ</th>
                                        <th>วัน-เวลา (ส่ง/รับ)</th>
                                        <th>เป็นเงิน</th>
                                        <th>สถานะ</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody> 
                                <tr v-for="item in order" :key="item.or_id">
                                    <td >
                                    <tr v-for="(child, index) in JSON.parse(item.or_list)" :key="item[index]"> 
                                        <td class="text-left w-100" style="border-top: 0; ">
                                        
                                        <div v-show="JSON.parse(child).look">
                                            <tr><b>{{index + 1}}.</b> สตรอว์เบอร์รี {{JSON.parse(child).look}} </tr>
                                            <tr>ราคา {{JSON.parse(child).price}} จำนวน x{{JSON.parse(child).multiply}}</tr>
                                            <tr>ค่าขนส่ง {{item.or_free}}</tr>
                                            <tr>{{item.or_created | formatDate}}</tr>
                                        </div>

                                        <div v-show="JSON.parse(child).xxl">
                                            <b>{{index + 1}}.</b> ผลผลิตราคาส่ง
                                            <tr v-show="Object(JSON.parse(child).xxl).weigth">
                                            ไซซ์ยักษ์ XXL : {{Object(JSON.parse(child).xxl).weigth}} * {{Object(JSON.parse(child).xxl).price}} บาท
                                            </tr>
                                            <tr v-show="Object(JSON.parse(child).xl).weigth">
                                            ไซซ์ยักษ์ XL : {{Object(JSON.parse(child).xl).weigth}} * {{Object(JSON.parse(child).xl).price}} บาท
                                            </tr>
                                            <tr v-show="Object(JSON.parse(child).l).weigth">
                                            ไซซ์ยักษ์ L : {{Object(JSON.parse(child).l).weigth}} * {{Object(JSON.parse(child).l).price}} บาท
                                            </tr>
                                            <tr v-show="Object(JSON.parse(child).m).weigth">
                                            ไซซ์ยักษ์ M : {{Object(JSON.parse(child).m).weigth}} * {{Object(JSON.parse(child).m).price}} บาท
                                            </tr>
                                            <tr v-show="Object(JSON.parse(child).s).weigth">
                                            ไซซ์ยักษ์ S : {{Object(JSON.parse(child).s).weigth}} * {{Object(JSON.parse(child).s).price}} บาท
                                            </tr>
                                            <tr v-show="Object(JSON.parse(child).mix).weigth">
                                            ไซซ์คละ : {{Object(JSON.parse(child).mix).weigth}} * {{Object(JSON.parse(child).mix).price}} บาท
                                            </tr>
                                            <tr v-show="Object(JSON.parse(child).drying).weigth">
                                            อบแห้ง : {{Object(JSON.parse(child).drying).weigth}} * {{Object(JSON.parse(child).drying).price}} บาท
                                            </tr>
                                            <tr v-show="Object(JSON.parse(child).juice).weigth">
                                            น้ำผลไม้ : {{Object(JSON.parse(child).juice).weigth}} * {{Object(JSON.parse(child).juice).price}} บาท
                                            </tr>
                                            <tr>ค่าขนส่ง {{item.or_free}}</tr>
                                            <tr>{{item.or_created | formatDate}}</tr>
                                        </div>

                                        <tr><b>จำนวนเงิน {{item.or_pay}} บาท</b></tr>
                                        </td>
                                    </tr>
                                    </td>
                                    <td>{{ item.or_customer_name}}</td>
                                    <td>{{ item.or_receive || item.or_created | formatDate}}</td>
                                    <td>{{ item.or_pay}}</td>
                                    <td >
                                    <div class="col" v-if="item.or_status == 'order'" >
                                        <button class="btn btn-sm btn-danger " @click="onUpdateStatus('failed', item)"  >
                                        <i class="fa fa-times-circle"></i> ล้มเหลว
                                        </button><br>
                                    
                                        <button class="btn btn-sm btn-info mt-2" @click="onUpdateStatus('send', item)"  >
                                        <i class="fa fa-check"></i> ส่งแล้ว
                                        </button>
                                    </div>

                                    <div v-if="item.or_status == 'failed'" >
                                        <button class="btn btn-sm btn-info" @click="onUpdateStatus('send', item)" >
                                        <i class="fa fa-repeat"></i> ส่งใหม่แล้ว
                                        </button><br>

                                        <button class="btn btn-sm btn-warning mt-2" @click="onRepay(item)" >
                                        <i class="fa fa-money"></i> ชำระคืน
                                        </button>
                                    </div>

                                    <div class="text-info" v-if="item.or_status == 'send'" >
                                        <i class="fa fa-check-circle"></i> อยู่กับขนส่ง
                                    </div>
                                    <div class="text-success" v-if="item.or_status == 'success'" >
                                        <i class="fa fa-motorcycle"></i> รับพัสดุแล้ว
                                    </div>

                                    <div class="text-danger" v-if="item.or_status == 'cancer'" >
                                        <i class="fa fa-times-circle"></i> ยกเลิกแล้ว
                                    </div>
                                        
                                    </td>
                                    <td class="text-center">
                                        <i @click="onChat(item)" class=" fa fa-comments text-success pointer"></i>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            </div> 
                        </div>
                    </div>
                </div>
                <br>
                <br>
            </form>

        </div>
    </div>
</template>

<script>
import axios from 'axios';
import {mapState} from 'vuex'

export default {
    props:{
        history: {
            required: true
        }
    },
    data(){
        return {
            order: {},
            type: true
        }
    },
    watch: {
        history(value){
            if(!value) return
            this.jquery("#history-dialog").modal();

            // ดึงรายการสั่งซื้อผลผลิตของร้าน
            axios.get(`/api/selling/successAll/${value.u_id}`)
                .then(res => this.order = res.data ).catch(error => this.alertify.error(error.response.data.message))
        },
    },
    mounted() {
        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#history-dialog").on("hide.bs.modal", event => {
            this.$emit('onClose', event)
        }) 
    },
    methods: {
        select(){
            this.type = !this.type
        }
    }
}
</script>

<style scoped>
/* กำหนดขนาดความสูงของตาราง แล้วเลื่อนขึ้น-ลง */
.table-responsive {
  max-height: 600px; /* กำหนดความสูงของตารางเพื่อให้สามารถเลื่อนขึ้นลงได้ */
  overflow-y: auto;
}
.table th:nth-child(n+12), .table td:nth-child(n+12) {
  display: none; /* ซ่อนคอลัมน์ที่เกินจำนวนที่ต้องการ */
}

.modal{
    color: #525662;
}
.modal-dialog{
    max-width: 1000px;
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