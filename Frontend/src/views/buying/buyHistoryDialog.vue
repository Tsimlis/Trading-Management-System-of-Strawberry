<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="history-dialog">
        <div class="modal-dialog" role="document">

            <form class="modal-content" v-show="type == true">
                <div class="modal-header">
                    <div class="row">
                        <div class="col form-group"><h5 class="modal-title"><i class="fa fa-ticket"></i> รายการรับซื้อ</h5></div>
                        <div class="col form-group"><div class="btn btn-info ml-5" @click="select()" v-show="type == true">รายการรับซื้อเพิ่มเติม</div></div>
                    </div>

                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                
                <div class="modal-body" >
                    <div class="table-responsive text-nowrap" >
                        <table class="table content text-center">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>ชื่อเกษตรกร</th>
                                    <th>XXL<br>(กก./บาท)</th>
                                    <th>XL<br>(กก./บาท)</th>
                                    <th>L<br>(กก./บาท)</th>
                                    <th>M<br>(กก./บาท)</th>
                                    <th>S<br>(กก./บาท)</th>
                                    <th>การชำระ</th>
                                    <th>เวลาทำรายการ</th>
                                    <th>เวลาแก้ไขล่าสุด</th>
                                    <th>สถานะ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in show" :key="item.f_id" > 
                                    <td>{{ item.f_id }}</td>
                                    <td>{{ item.f_name }}</td>
                                    <td>{{ item.f_weigth_xxl}} * {{item.f_price_xxl}}</td>
                                    <td>{{ item.f_weigth_xl}} * {{item.f_price_xl}}</td>
                                    <td>{{ item.f_weigth_l}} * {{item.f_price_l}}</td>
                                    <td>{{ item.f_weigth_m}} * {{item.f_price_m}}</td>
                                    <td>{{ item.f_weigth_s}} * {{item.f_price_s}}</td>
                                    <td>{{ item.f_pay }}</td>
                                    <td>{{ item.f_created | formatDate}}</td>
                                    <td>{{ item.f_updated | formatDate}}</td>
                                    <td class="text-left">
                                        <label class="badge badge-success"  >
                                            <i class="fa fa-check-square-o"></i> ชำระแล้ว
                                        </label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <br>
                <br>
            </form>

            <!-- ตารางรับซื้อเพิ่มเติม -->
            <form class="modal-content" v-show="type == false">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-ticket"></i> รายการรับซื้อเพิ่มเติม</h5>

                    <div class="btn btn-info ml-5" @click="select()" v-show="type == false">รายการรับซื้อ</div>

                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                
                <div class="modal-body" >
                    <div class="table-responsive text-nowrap" >
                        <table class="table content text-center">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>ชื่อเกษตรกร</th>
                                    <th>XXL<br>(กก./บาท)</th>
                                    <th>XL<br>(กก./บาท)</th>
                                    <th>L<br>(กก./บาท)</th>
                                    <th>M<br>(กก./บาท)</th>
                                    <th>S<br>(กก./บาท)</th>
                                    <th>การชำระ</th>
                                    <th>เวลาทำรายการ</th>
                                    <th>เวลาแก้ไข</th>
                                    <th>สถานะ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in present" :key="item.fp_id" > 
                                    <td>{{ item.fp_id }}</td>
                                    <td>{{ item.fp_name }}</td>
                                    <td>{{ convert(item.fp_price_xxl).price}} * {{ convert(item.fp_price_xxl).weigth}}</td>
                                    <td>{{ convert(item.fp_price_xl).price}} * {{ convert(item.fp_price_xl).weigth}}</td>
                                    <td>{{ convert(item.fp_price_l).price}} * {{ convert(item.fp_price_l).weigth}}</td>
                                    <td>{{ convert(item.fp_price_m).price}} * {{ convert(item.fp_price_m).weigth}}</td>
                                    <td>{{ convert(item.fp_price_s).price}} * {{ convert(item.fp_price_s).weigth}}</td>
                                    <td>{{ item.fp_pay }}</td>
                                    <td>{{ item.fp_created | formatDate}}</td>
                                    <td>{{ item.fp_updated | formatDate}}</td>
                                    <td class="text-left">
                                        <label class="badge badge-success"  >
                                            <i class="fa fa-check-square-o"></i> ชำระแล้ว
                                        </label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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
            show: {},
            present: {},
            type: true
        }
    },
    watch: {
        history(value){
            if(!value) return
            this.jquery("#history-dialog").modal();
        },
    },
    computed:{
        ...mapState({ userId: state => state.user })
    },
    mounted() {
        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#history-dialog").on("hide.bs.modal", event => {
            this.$emit('onClose', event)
        })

        // แสดงข้อมูลการซื้อทั้งหมด
        axios.get(`/api/buying/successAll/${this.userId.u_id}`)
            .then(res => this.show = res.data ).catch(error => this.alertify.error(error.response.data.message))
        // แสดงข้อมูลการซื้อทั้งหมด
        axios.get(`/api/buying/postAll/${this.userId.u_id}`)
            .then(res => this.present = res.data).catch(error => this.alertify.error(error.response.data.message))
    },
    methods: {
        convert(item) {
        return JSON.parse(item);
        },
        select(){
            this.type = !this.type
        }
    }
}
</script>

<style scoped>
/* กำหนดขนาดความสูงของตาราง แล้วเลื่อนขึ้น-ลง */
.table-responsive {
  max-height: 400px; /* กำหนดความสูงของตารางเพื่อให้สามารถเลื่อนขึ้นลงได้ */
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