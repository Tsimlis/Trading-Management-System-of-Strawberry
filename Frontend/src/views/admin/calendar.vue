<template>
    <Layout>
        <div class="card mb-3">
            <div class="card-body">
                <header class="mb-4">
                    <form @submit.prevent="onSearch()" class="search-form form-inline">
                        <select class="form-control " v-model="roomId" >
                            <option value="">เลือก</option>
                            <option :value="item.r_id" v-for="item in roomItems" :key="item.r_id" >{{item.r_name}}</option>
                        </select>
                        <button type="submit" class="btn btn-secondary">
                            <i class="fa fa-search"></i>
                        </button>
                    </form>

                    <h5><i class="fa fa-list-alt"></i> ปฏิทิน</h5>
                </header>

                <br>
                <div class="fullcalendar" id="calendar"></div>
            </div>
        </div>

    </Layout>
</template>

<script>
import axios from 'axios'
import Layout from "@/components/Layout"
const calendarId = "#calendar";

export default {
    components:{
        Layout
    },
    data(){
        return{
            roomId: "",
            roomItems: []
        }
    },
    mounted(){
        this.initailLoadCalendar();
        this.initailLoadSelect();
    },
    methods: {
        onSearch(){
            this.jquery('#calendar').fullCalendar("removeEvents");

            if(this.jquery.isNumeric(this.roomItem)) return this.alertify.warning('Please select data room');
            axios.get(`/api/booking/calendar/room/${this.roomId}`).then(response => {
                const events = response.data.map(item => {
                    return {
                        title: item.bk_title,
                        start: new Date(item.bk_time_start),
                        end: new Date(item.bk_time_end),
                        className: item.bk_status
                    }
                })
                // กำหนด event บนปฏิทิน
                this.jquery('#calendar').fullCalendar("renderEvents", events);
                
            }).catch(err => this.alertify.warning(err.response.data.message))
        },
        initailLoadSelect(){
            axios.get('/api/booking/rooms/select').then(response => {
                        // this.roomItems = response.data
                    }).catch(err => this.alertify.warning(err.response.data.message))
        },
        initailLoadCalendar(){
            this.jquery("#calendar").fullCalendar({
                locale: 'th',
                header:{
                    left: "prev,next today",
                    center: "title",
                    right: "month,agendaWeek,agendaDay"
                },
                buttonText:{
                    today: "วันนี้",
                    month: "เดือน",
                    week: "สัปดาห์",
                    day: "วัน"
                }
            })
        }
    }
}
</script>

<style scoped>
.search-form{
    float: right;
    margin-bottom: 1rem;
}
.form-control{
    margin-right: 5px;
}
.form-control:first-child {
    width: 270px;
}
#calendar{
    padding-left: 20px;
    padding-right: 40px;
    /* padding-bottom: 60px; */
}


@media (max-width: 575.98px) { 
  .form-control{
        margin-right: 1px;
    }
    .form-control:first-child {
        width: 80%;
    }
    .btn-secondary {
        width: 19%;
    }
    #calendar{
        padding-left: 0px;
        padding-right: 0px;
        /* padding-bottom: 60px; */
    }

}
</style>