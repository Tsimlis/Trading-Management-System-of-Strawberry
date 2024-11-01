<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="news-dialog">
        <div class="modal-dialog" role="document">
            <form class="modal-content" @submit.prevent="onSubmit()" >
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-ticket"></i> สั่งสินค้า</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="col" >
                      <div class="form-group">
                          <img :src="`/api/uploads/${news.n_image}`" :alt="news.n_image" class="w-100">
                      </div>

                      <div class="form-group">
                        <h5>{{news.n_title}}</h5>
                        <h5><label class="word">{{news.n_detail}}</label></h5>
                        <h6><label>วันที่ {{news.n_created | formatDate}}</label></h6>
                         
                      </div>

                    </div>
                </div> 

            </form>
        </div>
    </div>
</template>

<script>

export default {
    props:{ news: { required: true } },
    watch: {
        news(value){
            if(!value) return
            console.log(value)
            this.jquery("#news-dialog").modal();
        }
    },
    mounted() {
        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#news-dialog").on("hide.bs.modal", event => {
            this.$emit('onClose', event)
        })
    },
}

</script>

<style scoped>
.word {
  width: 440px; /* กำหนดความกว้างของ textarea */
  height: auto; /* กำหนดความสูงของ textarea */
  resize: none; /* ปิดการขยายขนาด textarea */
  box-sizing: border-box; /* คำนวณความกว้างรวม padding และ border */
  white-space: normal; /* ทำให้ข้อความลงบรรทัดใหม่ */
  overflow-wrap: break-word; /* ทำให้คำยาวๆ ลงบรรทัดใหม่ */
}
</style>