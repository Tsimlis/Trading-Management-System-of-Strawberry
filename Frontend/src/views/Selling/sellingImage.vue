<template>
    <div class="modal fade" tabindex="-1" role="dialog"  id="sellingImage">
        <div class="modal-dialog" role="document">
            <form class="modal-content">
                <div class="modal-body">
                    <div >
                        <img class="w-100" :alt="img" :src="`/api/uploads/${img}`">
                    </div>
                </div>  
            </form>
        </div>
    </div>
</template>

<script>

export default {
    props:{
        img: { required: true }
    },
    watch: {
        img(value){
            if(!value) return
            this.jquery("#sellingImage").modal();
        }
    },
    mounted() {
        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#sellingImage").on("hide.bs.modal", event => {
            this.$emit('onClose', event)
        })
    },
}

</script>