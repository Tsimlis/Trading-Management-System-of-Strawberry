<template>
  <div>
    <div class="modal fade" tabindex="-1" role="dialog" ref="modal" >
      <div class="modal-dialog" role="document" >
        <div class="modal-content" >
            <div class="modal-header">
                <h5 class="modal-title"><i class="fa fa-university" aria-hidden="true"></i>BANK </h5>
                <button type="button" class="close" aria-label="Close" @click="closeModal" >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                <div class="form-group col">
                    <div >
                        <h5>ธนาคาร {{ bank.u_bank_name }}</h5>
                        <input type="text" class="form-control w-75" :value="bank.u_bank_acc" disabled>
                    </div>
                    
                    <div class="row mt-3">
                        <div class="col-7"><label>ชื่อร้าน : {{code.sale_name}}</label></div>
                        <div class="col-5"><label>จำนวนเงิน : {{code.sale_pay}}</label></div>
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
                <button type="button" @click="onSubmit()" class="btn btn-info btn-block mt-2 mb-4 " :disabled="Image == ''">ยืนยันคำสั่งซื้อ</button>
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

    data(){
        return{
            store: [],
            Image: "",
            bank: {}
        }
    },
    watch: {
        Image(value){
            // เพิ่มรูปเพื่อการบันทึกหลักฐานการชำระ
            Object.assign(this.code, {imagePay: value})
        }
    },
    computed: {

    },
    mounted() {
        this.jquery(this.$refs.modal).modal('show');
        
        axios.get(`/api/userinfo/${this.code.sale_id}`).then(res => this.bank = res.data ).catch(error => this.alertify.error(error.response.data.message))
    },
    methods: {
        closeModal() {
            this.$emit('onClose', this.code, '');
            this.jquery(this.$refs.modal).modal('hide');
        },

        onSubmit(){
            this.$emit('onClose', null, this.code)
            this.jquery(this.$refs.modal).modal('hide');
            
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
    }
};
</script>