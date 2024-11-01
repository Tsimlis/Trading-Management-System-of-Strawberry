<template>
  <div>
    <div class="modal fade" tabindex="-1" role="dialog" ref="modal" >
      <div class="modal-dialog" role="document" >
        <div class="modal-content" >
            <div class="modal-header">
                <h5 class="modal-title"><i class="fa fa-qrcode" aria-hidden="true"></i> QR Code</h5>
                <button type="button" class="close" aria-label="Close" @click="closeModal" >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                <div class="form-group col" v-show="qrImage.svg">
                    <div v-html="qrImage.svg"></div>
                    
                    <div class="row text-center">
                        <div class="col-6"><label>ชื่อร้าน : {{code.sale_name}}</label></div>
                        <div class="col-6"><label>จำนวนเงิน : {{code.sale_pay}}</label></div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="btn btn-secondary btn-block">
                        <i class="fa fa-upload "></i> ยืนยันใบเสร็จ
                        <input type="file" class="d-none" @change="onChangeFile($event.target)">
                    </label>

                    <img class="img-fluid w-100" :src="Image || '/img/no-image.png'" alt="image example" v-if="Image">
                </div>

                <!-- <p>{{ code }}</p> -->
                <!-- <img :src="generateQRCodeUrl(code.sale_name)" alt="QR Code" /> -->
            </div>

            <div class="modal-footer">
                <button type="button" @click="onSubmit()" class="btn btn-info btn-block mt-2 mb-4 " id="countdown" v-show="timeLeftDisplay == 'ยืนยันคำสั่งซื้อ'">ยืนยันคำสั่งซื้อ</button>
                <button type="button" class="btn btn-info btn-block mt-2 mb-4 " id="countdown" v-show="timeLeftDisplay != 'ยืนยันคำสั่งซื้อ'" :disabled="timeLeftDisplay != 'ยืนยันคำสั่งซื้อ'">ชำระภายในเวลา {{ minutes }}:{{ seconds }}</button>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    props: ['code'],
    // props:{
    //     code: {
    //         required: true
    //     }
    // },
    data(){
        return{
            store: [],
            Image: "",
            qrImage: [],
            timeLeft: 180,
            countingDown: false,
            countdownInterval: null,
        }
    },
    watch: {
        Image(value){
            // หยุดการนับถอยหลัง
            this.stopTime();
            // เพิ่มรูปเพื่อการบันทึกหลักฐานการชำระ
            Object.assign(this.code, {imagePay: value})
        }
    },
    computed: {
        timeLeftDisplay() { // เปลี่ยนการแสดงผลเป็นข้อความ "ยืนยันคำสั่งซื้อ" เมื่อการนับถอยหลังเสร็จสิ้น
            let time = '';
            this.timeLeft > 0 ? time = `${this.timeLeft}` : this.closeModal();
            this.Image != '' ? time = 'ยืนยันคำสั่งซื้อ' : '';
            return time
        },
        minutes() {
        // คำนวณจำนวนนาที
        return Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
        },
        seconds() {
        // คำนวณจำนวนวินาทีที่เหลือ
        return (this.timeLeft % 60).toString().padStart(2, '0');
        }
    },
    mounted() {
        this.jquery(this.$refs.modal).modal('show');
        // เรียกข้อมูลผู้ใช้งานแล้ว genQRcode
        this.genQRcode();
        // ฟังกชันนับถอยหลัง
        this.startCountdown();

        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        // this.jquery(this.$refs.modal).on("hide.bs.modal", event => {
        //     this.stopTime();
        //     window.location.reload();
        // })
    },
    methods: {
        closeModal() {
            this.$emit('onClose', this.code, '');
            this.jquery(this.$refs.modal).modal('hide');
            this.stopTime();
            // this.$router.back();
        },
        // generateQRCodeUrl(code) แปลงตัวอักษร ตัวเลข ข้อความทั่วไป{
        // // Replace with your QR code generation logic
        // return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(code)}&size=150x150`;
        // },

        onSubmit(){
            this.$emit('onClose', null, this.code)
            this.stopTime();
            this.jquery(this.$refs.modal).modal('hide');
            this.$router.push({ name: 'your-product'});
        },
        startCountdown() {
            if (!this.countingDown) {
                this.countingDown = true;
                this.countdownInterval = setInterval(() => {
                    this.timeLeft--;
                    if (this.timeLeft <= 0) {
                        this.stopTime();
                        this.alertify.error(`หมดเวลาการชำระ`);
                    }
                }, 1000);
            }
        },
        stopTime(){
            clearInterval(this.countdownInterval);
            this.countingDown = false;
            this.qrImage = []
        },
        // เปลี่ยนไฟล์อัพโหลดเป็น Base64 string
        onChangeFile(input) {
            this.Image = "";
            if (input.files && input.files.length > 0) {
                const file = input.files[0];
                if (file.type.indexOf("image/") >= 0) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.addEventListener("load", () => {
                        this.Image = reader.result;
                    });
                return;
                }
            }
            this.alertify.warning("กรุณาเลือกภาพที่จะอัพโหลด !");
        },
        genQRcode(){
            axios.get(`/api/userinfo/${this.code.sale_id}`).then(res => {
                axios.post(`/api/qrcode/store/${this.code.sale_pay}`, res.data)
                    .then(res => this.qrImage = res.data ).catch(error => this.alertify.error(error.response.data.message))
            }).catch(error => this.alertify.error(error.response.data.message))
        }
    }
};
</script>