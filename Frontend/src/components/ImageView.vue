<template>
    <div class="modal fade" tabindex="-1" role="dialog"  id="Image">
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
            this.jquery("#Image").modal();
        }
    },
    mounted() {
        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#Image").on("hide.bs.modal", event => {
            this.$emit('onClose', event)
        })
    },
}

</script>