<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="week-dialog">
        <div class="modal-dialog" role="document">
            <form class="modal-content" >
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-ticket"></i> รายการขายในสัปดาห์</h5>
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
                                    <th>ชื่อลูกค้า</th>
                                    <th>XXL</th>
                                    <th>XL</th>
                                    <th>L</th>
                                    <th>M</th>
                                    <th>S</th>
                                    <th>คละ</th>
                                    <th>อบแห้ง</th>
                                    <th>น้ำสตรอว์เบอร์รี</th>
                                    <th>ยอดรวม</th>
                                    <th>ค่าจัดส่ง</th>
                                    <th>ยอดขาย</th>
                                    <th>เวลาบันทึก</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in total" :key="item.t_id" > 
                                    <td>{{ item.t_id }}</td>
                                    <td>{{ item.t_sale_name }}</td>
                                   <td class="text-left">
                                        <b>ขายปลีก</b><br>
                                        น้ำหนัก : {{ convert(item.t_xxl).retail.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_xxl).retail.price}} บาท<br>
                                        <b>ขายส่ง</b><br>
                                        น้ำหนัก : {{ convert(item.t_xxl).whole.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_xxl).whole.price}} บาท<br>
                                    </td>
                                   <td class="text-left">
                                        <b>ขายปลีก</b><br>
                                        น้ำหนัก : {{ convert(item.t_xl).retail.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_xl).retail.price}} บาท<br>
                                        <b>ขายส่ง</b><br>
                                        น้ำหนัก : {{ convert(item.t_xl).whole.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_xl).whole.price}} บาท<br>
                                    </td>
                                   <td class="text-left">
                                        <b>ขายปลีก</b><br>
                                        น้ำหนัก : {{ convert(item.t_l).retail.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_l).retail.price}} บาท<br>
                                        <b>ขายส่ง</b><br>
                                        น้ำหนัก : {{ convert(item.t_l).whole.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_l).whole.price}} บาท<br>
                                    </td>
                                   <td class="text-left">
                                        <b>ขายปลีก</b><br>
                                        น้ำหนัก : {{ convert(item.t_m).retail.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_m).retail.price}} บาท<br>
                                        <b>ขายส่ง</b><br>
                                        น้ำหนัก : {{ convert(item.t_m).whole.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_m).whole.price}} บาท<br>
                                    </td>
                                   <td class="text-left">
                                        <b>ขายปลีก</b><br>
                                        น้ำหนัก : {{ convert(item.t_s).retail.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_s).retail.price}} บาท<br>
                                        <b>ขายส่ง</b><br>
                                        น้ำหนัก : {{ convert(item.t_s).whole.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_s).whole.price}} บาท<br>
                                    </td>
                                   <td class="text-left">
                                        <b>ขายปลีก</b><br>
                                        น้ำหนัก : {{ convert(item.t_mix).retail.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_mix).retail.price}} บาท<br>
                                        <b>ขายส่ง</b><br>
                                        น้ำหนัก : {{ convert(item.t_mix).whole.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_mix).whole.price}} บาท<br>
                                    </td>
                                   <td class="text-left">
                                        <b>ขายปลีก</b><br>
                                        น้ำหนัก : {{ convert(item.t_drying).retail.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_drying).retail.price}} บาท<br>
                                        <b>ขายส่ง</b><br>
                                        น้ำหนัก : {{ convert(item.t_drying).whole.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_drying).whole.price}} บาท<br>
                                    </td>
                                   <td class="text-left">
                                        <b>ขายปลีก</b><br>
                                        น้ำหนัก : {{ convert(item.t_juice).retail.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_juice).retail.price}} บาท<br>
                                        <b>ขายส่ง</b><br>
                                        น้ำหนัก : {{ convert(item.t_juice).whole.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_juice).whole.price}} บาท<br>
                                    </td>
                                    
                                    <td class="text-left">
                                        <b>ขายปลีก</b><br>
                                        น้ำหนัก : {{ convert(item.t_total).retail.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_total).retail.price}} บาท<br>
                                        <b>ขายส่ง</b><br>
                                        น้ำหนัก : {{ convert(item.t_total).whole.weigth}} กก.<br>
                                        จำนวน : {{ convert(item.t_total).whole.price}} บาท<br>
                                    </td>
                                    <td class="text-left">
                                        <b>รวมทั้งสิ้น</b><br>
                                        {{ convert(item.t_free)}} บาท<br>
                                    </td>
                                    <td class="text-left">
                                        <b>รวมทั้งสิ้น</b><br>
                                        {{ convert(item.t_pay).price}} บาท<br>
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
            axios.get(`/api/selling/weekTotal/${value.u_id}`)
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
.table th:nth-child(n+15), .table td:nth-child(n+15) {
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