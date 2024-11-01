<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="selling-retail">
        <div class="modal-dialog" role="document" style="max-width: 700px;">
            <form class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-ticket"></i> ทำรายการขายปลีก</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="col" >

                        <div class="form-group">
                            <label class="btn btn-secondary btn-block">
                                <i class="fa fa-upload"></i> อัพโหลดภาพ
                                <input type="file" class="d-none" @change="onChangeFile($event.target)">
                            </label>

                            <img class="img-fluid w-100" :src="form.r_image || '/img/no-image.png'" alt="image example">
                        </div>


                        <nav>
                            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                <a class="nav-item nav-link" :class="show[0]" @click="active('XXL')" id="nav-XXL" data-toggle="tab" href="#XXL" role="tab" aria-controls="XXL" aria-selected="true">XXL</a>
                                <a class="nav-item nav-link" :class="show[1]" @click="active('XL')" id="nav-XL" data-toggle="tab" href="#XL" role="tab" aria-controls="XL" aria-selected="false">XL</a>
                                <a class="nav-item nav-link" :class="show[2]" @click="active('L')" id="nav-L" data-toggle="tab" href="#L" role="tab" aria-controls="L" aria-selected="false">L</a>
                                <a class="nav-item nav-link" :class="show[3]" @click="active('M')" id="nav-M" data-toggle="tab" href="#M" role="tab" aria-controls="M" aria-selected="false">M</a>
                                <a class="nav-item nav-link" :class="show[4]" @click="active('S')" id="nav-S" data-toggle="tab" href="#S" role="tab" aria-controls="S" aria-selected="false">S</a>
                                <a class="nav-item nav-link" :class="show[5]" @click="active('mix')" id="nav-mix" data-toggle="tab" href="#mix" role="tab" aria-controls="mix" aria-selected="false">คละ</a>
                                <a class="nav-item nav-link" :class="show[6]" @click="active('drying')" id="nav-drying" data-toggle="tab" href="#drying" role="tab" aria-controls="drying" aria-selected="false">อบแห้ง</a>
                                <a class="nav-item nav-link" :class="show[7]" @click="active('juice')" id="nav-juice" data-toggle="tab" href="#juice" role="tab" aria-controls="juice" aria-selected="false">น้ำผลไม้</a>
                            </div>
                        </nav>
                        <div class="tab-content" id="nav-tabContent">
                            <div class="tab-pane fade show" :class="show[0]" id="XXL" role="tabpanel" aria-labelledby="nav-XXL">
                                <br>
                                <div class="form-group ">
                                    <h6>สตรอว์เบอร์รี่ ขนาดยักษ์ (xxl)</h6>
                                    <div class="row form-group">
                                        <div class="col ml-3">
                                            <label >น้ำหนัก (กก.)</label>
                                            <input type="number" class="form-control" name="r_weigth_xxl" v-model.trim="form.r_weigth" >
                                        </div>
                                        <div class="col ml-3 mr-3">
                                            <label for="">ราคา (บาท)</label>
                                            <input type="number" class="form-control" name="r_price" v-model.trim="form.r_price" >
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" :class="show[1]" id="XL" role="tabpanel" aria-labelledby="nav-XL">
                                <br>
                                <div class="form-group ">
                                    <h6>สตรอว์เบอร์รี่ ขนาดจัมโบ้ (xl)</h6>
                                    <div class="row form-group">
                                        <div class="col ml-3">
                                            <label >น้ำหนัก (กก.)</label>
                                            <input type="number" class="form-control" name="r_weigth_xxl" v-model.trim="form.r_weigth" >
                                        </div>
                                        <div class="col ml-3 mr-3">
                                            <label for="">ราคา (บาท)</label>
                                            <input type="number" class="form-control" name="r_price" v-model.trim="form.r_price" >
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" :class="show[2]" id="L" role="tabpanel" aria-labelledby="nav-L">
                                <br>
                                <div class="form-group ">
                                    <h6>สตรอว์เบอร์รี่ ขนาดใหญ่ (l)</h6>
                                    <div class="row form-group">
                                        <div class="col ml-3">
                                            <label >น้ำหนัก (กก.)</label>
                                            <input type="number" class="form-control" name="r_weigth_l" v-model.trim="form.r_weigth" >
                                        </div>
                                        <div class="col ml-3 mr-3">
                                            <label for="">ราคา (บาท)</label>
                                            <input type="number" class="form-control" name="r_price" v-model.trim="form.r_price" >
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" :class="show[3]" id="M" role="tabpanel" aria-labelledby="nav-M">
                                <br>
                                <div class="form-group ">
                                    <h6>สตรอว์เบอร์รี่ ขนาดกลาง (m)</h6>
                                    <div class="row form-group">
                                        <div class="col ml-3">
                                            <label >น้ำหนัก (กก.)</label>
                                            <input type="number" class="form-control" name="r_weigth_m" v-model.trim="form.r_weigth" >
                                        </div>
                                        <div class="col ml-3 mr-3">
                                            <label for="">ราคา (บาท)</label>
                                            <input type="number" class="form-control" name="r_price" v-model.trim="form.r_price" >
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" :class="show[4]" id="S" role="tabpanel" aria-labelledby="nav-S">
                                <br>
                                <div class="form-group ">
                                    <h6>สตรอว์เบอร์รี่ ขนาดเล็ก (s)</h6>
                                    <div class="row form-group">
                                        <div class="col ml-3">
                                            <label >น้ำหนัก (กก.)</label>
                                            <input type="number" class="form-control" name="r_weigth_s" v-model.trim="form.r_weigth" >
                                        </div>
                                        <div class="col ml-3 mr-3">
                                            <label for="">ราคา (บาท)</label>
                                            <input type="number" class="form-control" name="r_price" v-model.trim="form.r_price" >
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" :class="show[5]" id="mix" role="tabpanel" aria-labelledby="nav-mix">
                                <br>
                                <div class="form-group ">
                                    <h6>สตรอว์เบอร์รี่ คละขนาด (mix)</h6>
                                    <div class="row form-group">
                                        <div class="col ml-3">
                                            <label >น้ำหนัก (กก.)</label>
                                            <input type="number" class="form-control" name="r_weigth_mix" v-model.trim="form.r_weigth" >
                                        </div>
                                        <div class="col ml-3 mr-3">
                                            <label for="">ราคา (บาท)</label>
                                            <input type="number" class="form-control" name="r_price" v-model.trim="form.r_price" >
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" :class="show[6]" id="drying" role="tabpanel" aria-labelledby="nav-drying">
                                <br>
                                <div class="form-group ">
                                    <h6>สตรอว์เบอร์รี่อบแห้ง </h6>
                                    <div class="row form-group">
                                        <div class="col ml-3">
                                            <label >น้ำหนัก (กก.)</label>
                                            <input type="number" class="form-control" name="r_weigth_drying" v-model.trim="form.r_weigth" >
                                        </div>
                                        <div class="col ml-3 mr-3">
                                            <label for="">ราคา (บาท)</label>
                                            <input type="number" class="form-control" name="r_price" v-model.trim="form.r_price" >
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" :class="show[7]" id="juice" role="tabpanel" aria-labelledby="nav-juice">
                                <br>
                                <div class="form-group ">
                                    <h6>น้ำสตรอว์เบอร์รี่</h6>
                                    <div class="row form-group">
                                        <div class="col ml-3">
                                            <label >จำนวน (ขวด)</label>
                                            <input type="number" class="form-control" name="r_weigth_juice" v-model.trim="form.r_weigth" >
                                        </div>
                                        <div class="col ml-3 mr-3">
                                            <label for="">ราคา (บาท)</label>
                                            <input type="number" class="form-control" name="r_price" v-model.trim="form.r_price" >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <!-- <div class="form-group">
                            <div class="row form-group">
                                <div class="col ml-3">
                                    <div class="row ml-1 ">
                                        <label >ค่าขนส่งให้ลูกค้า</label>
                                        <div class="form-check ml-4" >
                                            <input class="form-check-input" type="checkbox"  id="free" v-model="free">
                                            <label class="form-check-label" for="free">
                                                ฟรีค่าจัดส่ง
                                            </label>
                                        </div>
                                    </div>
                                    <input type="number" class="form-control w-50" name="w_price_xxl" v-model.trim="form.r_free" 
                                            :disabled="free == true">
                                </div>
                                <div class="col"></div>
                            </div>
                        </div> -->

                        <div class="form-group ">
                            <h6>น้ำหนักคงเหลือในร้าน</h6>
                            <div class="row form-group">
                                <div class="col ml-3">
                                    <label >จำนวน (กก./ขวด)</label>
                                    <input type="number" class="form-control " name="r_stock" v-model.trim="form.r_stock" >
                                </div>
                                <div class="col ml-3">
                                    <label >ค่าขนส่งให้ลูกค้า</label>
                                    <div class="form-check ml-4b float-right" >
                                        <input class="form-check-input" type="checkbox"  id="free" v-model="free">
                                        <label class="form-check-label " for="free">
                                            ฟรีค่าจัดส่ง
                                        </label>
                                    </div>
                                    <input type="number" class="form-control w-50" name="w_price_xxl" v-model.trim="form.r_free" :disabled="free == true">
                                </div>
                            </div>
                        </div>


                        <div class="form-group">
                            <div class="col">
                                <label >ข้อความเพิ่มเติม</label>
                                <textarea class="form-control" name="r_detail" rows="3" v-model.trim="form.r_detail"></textarea>
                            </div>
                        </div>
                      
                    </div>
                </div> 

                <div class="modal-footer">
                    <button class="btn btn-info btn-block mt-2 mb-4" @click.prevent="post()" >นำเสนอผลผลิต</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props:{
        retail: {
            required: true
        }
    },
    data(){
        return {
            form: {
                r_sale_id: "",
                r_sale_name: "",
                r_image: "",
                r_detail: "",
                r_look: "",
                r_weigth: '0',
                r_price: '0',
                r_free: "",
                r_stock: ""
            },
            free: false,
            show: []
            
        }
    },
    watch: {
        retail(value){
            if(!value) return
            this.jquery("#selling-retail").modal();

            if(isNaN(value)){
                this.form.r_sale_id = value.u_id
                this.form.r_sale_name = value.u_fullname
                this.form.r_look = "XXL"
                this.show.push('active')
            } else {
                this.updateItem(value);
            }
        },
        free(value){
            if(value) this.form.r_free = '0'
            else this.form.r_free = ''           
        },
    },
    mounted() {
        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#selling-retail").on("hide.bs.modal", event => {
            this.$emit('onClose', event)
            window.location.reload()
        })
    },
    methods: {
        post(){
            if ((this.form.r_weigth == 0 && this.form.r_price == 0) || this.form.r_weigth == 0 || this.form.r_price == 0) return this.alertify.warning('ยังไม่ได้ทำรายการ');
            if (this.form.r_free == '' || this.form.r_stock == '') return this.alertify.warning('กรอกข้อมูลค่าขนส่งและสต็อก');

            const way = isNaN(this.retail) ? axios.post('/api/selling/retail', this.form) : axios.put(`/api/selling/retail/${this.retail}`, this.form)
            way.then(response => {
                    this.onReset();
                    this.jquery("#selling-retail").modal("hide");
                    window.location.reload();
                }).catch(err => {this.alertify.error(err.response.data.message) });
        },
        // เปลี่ยนไฟล์อัพโหลดเป็น Base64 string
        onChangeFile(input) {
            this.form.r_image = "";
            if (input.files && input.files.length > 0) {
                const file = input.files[0];
                if (file.type.indexOf("image/") >= 0) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.addEventListener("load", () => {
                    this.form.r_image = reader.result;
                });
                return;
                }
            }
            this.alertify.warning("กรุณาเลือกภาพที่จะอัพโหลด !");
        },
        active(look){
            this.form.r_look = look,
            this.form.r_weigth = '0',
            this.form.r_price = '0'
        },
        updateItem(id){
            axios.get(`/api/selling/retailItem/${id}`).then(res => {
                const data = res.data
                this.form.r_sale_id =  data.r_sale_id,
                this.form.r_sale_name =  data.r_sale_name,
                this.form.r_image =  data.r_image,
                this.form.r_detail =  data.r_detail,
                this.form.r_look =  data.r_look,
                this.form.r_weigth =  data.r_weigth,
                this.form.r_price =  data.r_price,
                this.form.r_free =  data.r_free
                //  ทำให้หน้า html มีการเปลี่ยนตามด้วย
                const check = ['XXL', 'XL', 'L', 'M', 'S', 'mix', 'drying', 'juice']
                check.forEach((item, index) => {
                    data.r_look == item ? this.show[index] = 'active show' : this.show[index] = ''
                });
            }).catch(error => this.alertify.error(error.response.data.message))
        },
        onReset(){
            this.form = {
                r_sale_id: "",
                r_sale_name: "",
                r_image: "",
                r_detail: "",
                r_look: "",
                r_weigth: "",
                r_price: "",
                r_free: ""
            }
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
a{
    color: grey;
}
.nav-tabs .nav-link.active{
    color: blue;
}
form img {
  border: solid 1px #6c757d;
}

</style>