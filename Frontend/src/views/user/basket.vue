<template>
    <Layout>

        <div class="card mb-3">
            <div class="card-body">
                <header class="mb-5">
                  <div class="col">
                    <div class="row">
                      <div class="col"><h5><i class="fa fa-shopping-basket"></i> ตะกร้าผลผลิตเกษตรกร </h5></div>
                      <div class="col">
                        <div class="row">
                          <div class="col text-right">
                            จำนวนที่เลือก : {{ selectedItems.length }} <div class="btn btn-warning ml-4" @click="Buy(selectedItems)">สั่งซื้อผลผลิต</div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </header>

                <div class="table-responsive text-center ">
                  <table class="table">
                    <thead class=" text-nowrap">
                        <tr>
                            <th>#</th>
                            <th>ชื่อร้าน</th>
                            <th>เพิ่มรายการล่าสุด</th>
                            <th>รายละเอียด</th>
                            <th>เลือก</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody >
                        <tr v-for="(item, index) in show" :key="item.bas_id" :class="{ 'disabled-row': false }">
                            <td>{{ index + 1}}</td>
                            <td>{{ item.bas_sale_name }}</td>
                            <td>{{ item.bas_updated | formatDate}}</td>

                            <td class="text-left pointer" @click="onDetail(item, retailStock[index])" v-if="item.bas_retail"  >
                              <div >#{{conv(item.bas_retail).id}} ประเภท/ขนาด : {{conv(item.bas_retail).look}} </div>
                              <div >{{conv(item.bas_retail).weigth}} กก. {{conv(item.bas_retail).price}} บาท . [{{ retailStock[index] }}]</div>
                              <div >จำนวนสั่งซื้อ : x{{conv(item.bas_retail).multiply}}</div>
                              <div ><b>รวมเป็นเงิน : {{conv(item.bas_retail).total}}</b></div>
                            </td>

                            <td class="text-left pointer" @click="onUpdate(item)" v-if="item.bas_whole">
                              <div v-if="Object(conv(item.bas_whole).xxl).weigth">ยักษ์ XXL : {{Object(conv(item.bas_whole).xxl).weigth}} กก. {{Object(conv(item.bas_whole).xxl).price}} บาท </div>
                              <div v-if="Object(conv(item.bas_whole).xl).weigth">จัมโบ้ XL : {{Object(conv(item.bas_whole).xl).weigth}} กก. {{Object(conv(item.bas_whole).xl).price}} บาท </div>
                              <div v-if="Object(conv(item.bas_whole).l).weigth">ใหญ่ L : {{Object(conv(item.bas_whole).l).weigth}} กก. {{Object(conv(item.bas_whole).l).price}} บาท </div>
                              <div v-if="Object(conv(item.bas_whole).m).weigth">กลาง M : {{Object(conv(item.bas_whole).m).weigth}} กก. {{Object(conv(item.bas_whole).m).price}} บาท </div>
                              <div v-if="Object(conv(item.bas_whole).s).weigth">เล็ก S : {{Object(conv(item.bas_whole).s).weigth}} กก. {{Object(conv(item.bas_whole).s).price}} บาท </div>
                              <div v-if="Object(conv(item.bas_whole).mix).weigth">คละ : {{Object(conv(item.bas_whole).mix).weigth}} กก. {{Object(conv(item.bas_whole).mix).price}} บาท </div>
                              <div v-if="Object(conv(item.bas_whole).drying).weigth">อบแห้ง : {{Object(conv(item.bas_whole).drying).weigth}} กก. {{Object(conv(item.bas_whole).drying).price}} บาท </div>
                              <div v-if="Object(conv(item.bas_whole).juice).weigth">น้ำผลไม้ : {{Object(conv(item.bas_whole).juice).weigth}} กก. {{Object(conv(item.bas_whole).juice).price}} บาท </div>
                              <div ><b>รวมเป็นเงิน : {{conv(item.bas_whole).total}}</b></div>
                            </td>

                            <td>{{item.bas_status}}
                              <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" :id="`checkbox-${index}`" :value="item"  v-model="selectedItems" 
                                      :disabled=" Items[index] " >
                                <label class="form-check-label" :for="`checkbox-${index}`">เลือก</label>
                              </div>
                            </td>
                            <td class="text-right no-wrap">
                                <i @click="onUpdate(item, retailStock[index])" class="pointer fa fa-edit text-info mr-3"></i>
                                <i @click="onDelete(item)" class="pointer fa fa-trash text-danger"></i>
                            </td>
                        </tr>
                    </tbody>
                  </table>
                </div>
                <Pagination :data="basket" :page="page" @onPage="onPage($event)" />
            </div>
        </div>

      
      <WholeDialog :store="wholeItem" @onClose="wholeItem = null" />
      <RetailDialog :store="retailItem" @onClose="retailItem = null" />
    </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import Pagination from "@/components/Pagination";
import RetailDialog from "./retailDialog.vue"
import WholeDialog from './wholeDialog.vue'
import Search from "@/components/Search";
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {
      basket: [],
      retailItem: null,
      wholeItem: null,
      check: "",
      selectedItems: [],
      show: {},
      page: 0,
      search: {},
      search_types: [
      //   {name: "ชื่อ", value: "bas_sale_name"},/
      ],
      showItem: [],
      showsale: [],
      retailStock: [],
      stock: [],
      Items: [],
      stockWhole: [],
      wholeItem: [],
      arr: []
    };
  },
  components: {
    Layout,
    Pagination,
    Search,
    RetailDialog,
    WholeDialog
  },
  computed:{
    ...mapState({ userId: state => state.user })
  },
  watch: {
      basket(value){
          Object.assign(this.basket, { limit: 5 ,rows: value.length});  // จำนวนการแสดงในตาราง
          this.page = 1 //เมื่อข้อมุูลเข้าให้เป็นหน้าที่ 1

          // ฟังกชันหา id สินค้าเพื่อดึงน้ำหนักคงเหลือมาจำกัด
          value.forEach((item, index) => {
            const retail = item.bas_retail

            this.showItem[index] = Object(JSON.parse(retail)).id
            this.showItem[index] == null ? this.showsale[index] = item.bas_sale_id : this.showsale[index] = null
          })

          // ฟังกชันเช็คคลังสินค้า
          this.getStock();
          setInterval(() => { this.getStock(); }, 5000);

      },
      //  การแบ่งหน้า
      page(num){
          const end = num * this.basket.limit
          const start = end - this.basket.limit
          this.show = this.basket.slice(start, end)
      },
      stock(val){
        this.retailStock = []
        // เทียบว่าตัวไหนสินค้าหมดก็ให้ปิดการเลือก
        val.forEach((item, index) => {
          item == null ? this.retailStock.push(0) : this.retailStock.push(Object(item).r_stock) ; // แสดงค่าน้ำหนักคงเหลือของร้านขายปลีก

          const subRe = Object(JSON.parse(this.show[index].bas_retail))
          // จัดการเทียบขายปลีก
          const sum = Object(subRe).weigth * Object(subRe).multiply
          if(item == null) this.Items[index] = false // ค่าเริ่มต้อนของการเปลี่ยนแปลง ถ้าไม่มีการใส่เกินน้ำหนักล่าสุดจะไม่ปิดการเลือก แต่ถ้ามีตัวใดมากว่าก็จะไม่สามารถทำการเลือกซื้อได้
          else sum > item.r_stock ? this.Items[index] = true : this.Items[index] = false ;

          //ตรวจสอบรายการขายปลีกตัวที่ถูกลบแล้ว
          if (this.showItem[index] != null ) item == null ? this.Items[index] = true : '';
        })
        
        // จัดการเปรียบเทียบขายส่ง
        this.stockWhole.forEach((item, index) => {
        const subWh = Object(JSON.parse(this.show[index].bas_whole))
        
        if(item != null) {
            item.sw_xxl - subWh.xxl.weigth < 0 ? this.Items[index] = true : '';
            item.sw_xl - subWh.xl.weigth < 0 ? this.Items[index] = true : '';
            item.sw_l - subWh.l.weigth < 0 ? this.Items[index] = true : '';
            item.sw_m - subWh.m.weigth < 0 ? this.Items[index] = true : '';
            item.sw_s - subWh.s.weigth < 0 ? this.Items[index] = true : '';
            item.sw_mix - subWh.mix.weigth < 0 ? this.Items[index] = true : '';
            item.sw_drying - subWh.drying.weigth < 0 ? this.Items[index] = true : '';
            item.sw_juice - subWh.juice.weigth < 0 ? this.Items[index] = true : '';
          }
        })
      },
  },
  mounted() {
    // แสดงรายการที่บันทึกในตะกร้า
    axios.get(`/api/customer/basket/${this.userId.u_id}`)
      .then(res => this.basket = res.data ).catch(error => this.alertify.error(error.response.data.message));
  },
  methods: {
    onDetail(item, stock){
      Object.assign(item, {bas_stock: stock}) // แทนค่าน้ำหนักคงเหลือ ไม่ให้มีการกรอกเกิน
      this.retailItem = item
    },
    onUpdate(item, stock) {
      if(item.bas_retail != null) return this.onDetail(item, stock);
      this.wholeItem = item
    },
    Buy(item){
      if(item == '') return this.alertify.warning('เลือกรายการที่ต้องการสั่งซื้อ')
      localStorage.setItem('file', JSON.stringify(item));
      this.$router.push({ name: 'order' })
    },
    conv(value){
      return JSON.parse(value)
    },
    onPage(page){
        this.page = page;
    },
    onSearch(word){
        this.search = word;
        //  this.$store.dispatch("set_booking_manage", { page: 1, ...this.search });
    },
    onDelete(item){
      this.alertify.confirm('คุณต้องการลบใช่หรือไม่', () => {
        axios.delete(`/api/customer/basket/${item.bas_id}`).then(response => {
          window.location.reload();
        }).catch(err => this.alertify.error(err.response.data.message))
      })
    },
    getStock(){
      // แสดงน้ำหนักคงเหลือ แบบขายปลีกของร้าน (ข้ามไปทำงานต่อที่ stock)
      axios.post(`/api/customer/checkWeigth`, this.showItem)
        .then(res => this.stock = res.data ).catch(error => this.alertify.error(error.response.data.message))
      // แสดงน้ำหนักคงเหลือ แบบขายส่งของร้าน (ข้ามไปทำงานต่อที่ stockWhole)
      axios.post(`/api/customer/checkSale`, this.showsale)
        .then( res => this.stockWhole = res.data).catch(error => this.alertify.error(error.response.data.message))
    }
  }
};
</script>

<style  scoped>
/* ปิดแถวที่หมดแล้ว */
.disabled-row {
  pointer-events: none;
  opacity: 0.5;
}

.present{
  float: right;
}
.btn-menu {
  color: #ffffff;
  background-color: #ced4da;
  margin-right: 7px;
  min-width: 130px;
}
.btns{
  width: 200px;
  text-align: right;
}
.btns .btn {
  width: 82px;
}
tr.allowed td {
  color: #28a745;
}
tr.not.allowed td {
  color: #dc2545;
}


@media (max-width: 575.98px) { 
  button {
    width: 100%;
  }

}
</style>

