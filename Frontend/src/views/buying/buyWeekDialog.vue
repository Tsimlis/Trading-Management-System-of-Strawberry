<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="week-dialog">
        <div class="modal-dialog" role="document">
            <form class="modal-content" >
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-ticket"></i> รายการรับซื้อเพิ่มเติม</h5>
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
                                    <th>XXL</th>
                                    <th>XL</th>
                                    <th>L</th>
                                    <th>M</th>
                                    <th>S</th>
                                    <th>ยอดรวม</th>
                                    <th>การชำระ</th>
                                    <th>เวลาบันทึก</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in total" :key="item.t_id" > 
                                    <td>{{ item.t_id }}</td>
                                    <td>{{ item.t_buy_name }}</td>
                                    <td class="text-left">
                                        <b>ปกติ</b><br>
                                        น้ำหนัก : {{ convert(item.t_xxl).normal.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_xxl).normal.price}} บาท<br>
                                        <b>เพิ่มเติม</b><br>
                                        น้ำหนัก : {{ convert(item.t_xxl).adjunct.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_xxl).adjunct.price}} บาท<br>
                                    </td>
                                    <td class="text-left">
                                        <b>ปกติ</b><br>
                                        น้ำหนัก : {{ convert(item.t_xl).normal.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_xl).normal.price}} บาท<br>
                                        <b>เพิ่มเติม</b><br>
                                        น้ำหนัก : {{ convert(item.t_xl).adjunct.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_xl).adjunct.price}} บาท<br>
                                    </td>
                                    <td class="text-left">
                                        <b>ปกติ</b><br>
                                        น้ำหนัก : {{ convert(item.t_l).normal.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_l).normal.price}} บาท<br>
                                        <b>เพิ่มเติม</b><br>
                                        น้ำหนัก : {{ convert(item.t_l).adjunct.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_l).adjunct.price}} บาท<br>
                                    </td>
                                    <td class="text-left">
                                        <b>ปกติ</b><br>
                                        น้ำหนัก : {{ convert(item.t_m).normal.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_m).normal.price}} บาท<br>
                                        <b>เพิ่มเติม</b><br>
                                        น้ำหนัก : {{ convert(item.t_m).adjunct.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_m).adjunct.price}} บาท<br>
                                    </td>
                                    <td class="text-left">
                                        <b>ปกติ</b><br>
                                        น้ำหนัก : {{ convert(item.t_s).normal.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_s).normal.price}} บาท<br>
                                        <b>เพิ่มเติม</b><br>
                                        น้ำหนัก : {{ convert(item.t_s).adjunct.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_s).adjunct.price}} บาท<br>
                                    </td>
                                    <td class="text-left">
                                        <b>ปกติ</b><br>
                                        น้ำหนัก : {{ convert(item.t_total).normal.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_total).normal.price}} บาท<br>
                                        <b>เพิ่มเติม</b><br>
                                        น้ำหนัก : {{ convert(item.t_total).adjunct.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_total).adjunct.price}} บาท<br>
                                    </td>
                                    <td class="text-left">
                                        <b>ปกติ</b><br>
                                        รวมทั้งสิ้น : {{ convert(item.t_pay).normal.price}} บาท<br>
                                        <b>เพิ่มเติม</b><br>
                                        รวมทั้งสิ้น : {{ convert(item.t_pay).adjunct.price}} บาท<br>
                                    </td>
                                    <td>{{ item.t_created | formatDate}}</td>
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
        week: {
            required: true
        }
    },
    data(){
        return {
            total: {}
        }
    },
    watch: {
        week(value){
            if(!value) return
            this.jquery("#week-dialog").modal();
            
            // แสดงข้อมูลรวมยอดทั้งหมด
            axios.get(`/api/buying/weekTotal/${value.u_id}`)
                .then(res => this.total = res.data ).catch(error => this.alertify.error(error.response.data.message))
        },
    },
    mounted() {
        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#week-dialog").on("hide.bs.modal", event => {
            this.$emit('onClose', event)
        }) 
    },
    methods: {
        convert(item) {
        return JSON.parse(item);
        },
        
    }
}
</script>

<style scoped>
/* กำหนดขนาดความสูงของตาราง แล้วเลื่อนขึ้น-ลง */
.table-responsive {
  max-height: 600px; /* กำหนดความสูงของตารางเพื่อให้สามารถเลื่อนขึ้นลงได้ */
  overflow-y: auto;
}
.table th:nth-child(n+11), .table td:nth-child(n+11) {
  display: none; /* ซ่อนคอลัมน์ที่เกินจำนวนที่ต้องการ */
}

.modal{
    color: #525662;
}
.modal-dialog{
    max-width: 900px;
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