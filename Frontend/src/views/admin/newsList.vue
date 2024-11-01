<template>
    <Layout>
        <Search :types="search_type" @onSearch="onSearch($event)" />
        <div class="form-group">
            <router-link class="btn btn-menu" :to="{ name:'news-list' }">ข้อมูลข่าวสาร</router-link>
            <router-link class="btn btn-menu" :to="{ name: 'news-form'}">เพิ่มข้อมูลใหม่</router-link>
        </div>

        <label >ราคาสตรอว์เบอร์รี</label>
        <div class="card mb-4" style="background-color: darkcyan;">
        <!-- ประกาศราคา -->
            <div class="row align-items-center">
                <div class="col-sm-3">
                    <h2 class="text-center" style="color: blanchedalmond;">ราคาวันนี้</h2>
                    <h5 class="text-center" style="color: blanchedalmond;">{{date }}</h5>
                    <h5 class="text-center" style="color: blanchedalmond;">{{time}}</h5>
                </div>
                <div class="col-sm-9">
                    <div class="card-body">
                        <!-- <div>ประกาศวันที่ : {{item.n_updated | formatDate}}</div> -->
                        <div class="row mb-3">
                            <div class="col">
                                <h5 style="color: blanchedalmond;" class="pl-4">ยักษ์ (XXL)</h5>
                                <input type="number" class="form-control" placeholder="ราคา" v-model="price.p_xxl">
                            </div>
                            <div class="col">
                                <h5 style="color: blanchedalmond;" class="pl-4">จัมโบ้ (XL)</h5>
                                <input type="number" class="form-control" placeholder="ราคา" v-model="price.p_xl">
                            </div>
                            <div class="col" >
                                <h5 style="color: blanchedalmond;" class="pl-4">ใหญ่ (L)</h5>
                                <input type="number" class="form-control" placeholder="ราคา" v-model="price.p_l">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <h5 style="color: blanchedalmond;" class="pl-4">กลาง (M)</h5>
                                <input type="number" class="form-control" placeholder="ราคา" v-model="price.p_m">
                            </div>
                            <div class="col">
                                <h5 style="color: blanchedalmond;" class="pl-4">เล็ก (S)</h5>
                                <input type="number" class="form-control" placeholder="ราคา" v-model="price.p_s">
                            </div>
                            <div class="col">
                                <div class="btn-news mt-4">
                                    <button @click="onSavePrice(price)" class="btn btn-warning">
                                        <i class="fa fa-ticket"></i> ประกาศราคา
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>

        <label>ข่าวสาร</label>
        <div class="card mb-3" v-for="item in show" :key="item.n_id" >

            <!-- ข่าวสาร -->
            <div class="row align-items-center" >
                <div class="col-sm-4">
                    <img :src="`/api/uploads/${item.n_image}`" :alt="item.n_id" class="img-news" >
                </div>
                <div class="col-sm-8">
                    <div class="card-body">
                        <button class="btn btn-success" v-if="item.n_profile == 'yes' "
                            style="float: right;"
                            data-toggle="tooltip" data-placement="bottom" title="ขึ้นเป็นข่าวหลัก" >
                            <i class="fa fa-picture-o" aria-hidden="true"></i>
                        </button>
                        <div>ชื่อหัวข้อ  : {{item.n_title}}</div>
                        <div>รายละเอียด : {{item.n_detail}}</div>
                        <div class="btn-news">
                            <button @click="onUpdate(item)" class="btn btn-warning">
                                <i class="fa fa-ticket"></i> แก้ไขข้อมูล
                            </button>
                            <button @click="onDelete(item)" class="btn btn-danger">
                                <i class="fa fa-trash"></i> ลบ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        <Pagination :data="news" :page="page" @onPage="onPage($event)" />

    </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import { mapState } from "vuex"
import Pagination from "@/components/Pagination";
import axios from 'axios'

export default {
    components:{
        Layout,
        Search,
        Pagination
    },
    data(){
        return {
            page: 0,
            search_type: [
            //     {name: "ชื่อหัวข้อ", value: "n_title"},
            //     {name: "ประเภทข่าว", value: "n_type"},
            //     {name: "รายละเอียด", value: "n_detail"}
            ],
            search: "",
            newsItem: null,
            newsDetailItem: null,
            show: {},
            form: {
                n_title: "",
                n_detail: "",
                n_image: "",
                n_profile: ""
            },
            price: {
                p_title: "แจ้งราคา",
                p_xxl: "",
                p_xl: "",
                p_l: "",
                p_m: "",
                p_s: ""
            },
            date: "",
            time: ""
        }
    },
    computed: {
        ...mapState(['news'])
    },
    watch: {
        news(value){
            this.$set(this.news, 'limit', 4);  // จำนวนที่แสดงใน 1 หน้า
            this.$set(this.news, 'rows', value.result.length);
            this.page = 1 //เมื่อข้อมุูลเข้าให้เป็นหน้าที่ 1
        },
        //  การแบ่งหน้า และ ถ่ายข้อมูล
        page(num){
            const end = num * this.news.limit
            const start = end - this.news.limit
            this.show = this.news.result.slice(start, end)
        },    
    },
    mounted() {
        this.$store.dispatch("set_news");
    },
    created() {
        setInterval(this.showClockRealTime, 1000);
    },
    methods: {
        onPage(page){
            this.page = page;
        },
        onSearch(word){
            this.search = word;
            // this.$store.dispatch("set_news", { page: 1, ...this.search });
        },
        onDelete(item){
            this.alertify.confirm('คุณต้องการลบใช่หรือไม่', () => {
            axios.delete(`/api/news/${item.n_id}`).then(response => {
            this.$store.dispatch('set_news');
            }).catch(err => this.alertify.error(err.response.data.message))
            })
        },
        onUpdate(item){
            this.$router.push({ name: "news-form", query: { id: item.n_id, news: 'news' } });
        },
        onSavePrice(item){
            axios.post('/api/news/price', item).then(res => this.price = "" ).catch(error => this.alertify.error(error.response.data.message))
        },
        showClockRealTime() {
            var d = new Date();
            this.date = d.toLocaleDateString()
            this.time = d.toLocaleTimeString()
        }
    }
}
</script>


<style  scoped>
input{
    width: 150px;
}
.btn-menu {
  color: #ffffff;
  background-color: #ced4da;
  margin-right: 7px;
  min-width: 130px;
}
.btn.router-link-active {
  background-color: #17a2b8;
}
.img-news{
    max-width: 100%;
    width: 500px; /* ทดสอบตั้งขนาดดู */
}
.card{
    color: #525862;
    border-right: solid 5px #17a2b8;
    /* max-width: 100%; */
    
}
.card-body{
    margin-left: 5px;
}
.btn-news .btn{
    margin-right: 10px;
    margin-top: 10px;
    width: 150px;
}


@media (max-width: 575.98px) { 
  .btn-news .btn {
        width: 100%;
    }
    .btn-menu {
        width: 100%;
        margin-bottom: 10px;
    }
    /* .card-body{
        padding-left: 0px;
    } */

}
</style>