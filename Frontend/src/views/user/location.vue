<template>
    <Layout>
        <div  class="form-group">
            <router-link class="btn btn-menu" :to="{ name:'your-product' }">สินค้าของคุณ</router-link>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <header>
                  <div class="row">
                    <div class="col-sm-6"><h5><i class="fa fa-gift"></i>  ติดตามพัสดุ</h5></div>
                  </div>
                </header>
                <hr>
                
                <div class="row">
                  <div class="col-4">
                    <div class="list-group pl-4 border-left-0 " id="list-tab" role="tablist">
                      <a class="list-group-item list-group-item-action active text-center" >บริษัทขนส่ง</a>
                      <a class="list-group-item list-group-item-action" href="https://track.thailandpost.co.th/" target="_blank">Thai Post</a>
                      <a class="list-group-item list-group-item-action" href="https://th.kerryexpress.com/th/track/" target="_blank">kerry-express</a>
                      <a class="list-group-item list-group-item-action" href="https://flashexpress.com/th/tools/tracking-min/" target="_blank" >flash-express</a>
                      <a class="list-group-item list-group-item-action" href="https://spx.co.th/m/" target="_blank" >shopee-express</a>
                      <a class="list-group-item list-group-item-action" href="https://www.scgexpress.co.th/tracking/" target="_blank" >scg-express</a>
                      <a class="list-group-item list-group-item-action" href="https://www.jtexpress.co.th/service/track" target="_blank" >j&t-express</a>
                      <a class="list-group-item list-group-item-action" href="https://www.best-inc.co.th/" target="_blank" >best-express</a>
                      <a class="list-group-item list-group-item-action" href="https://speed-d.allspeedy.co.th/" target="_blank" >speed-d</a>
                      <a class="list-group-item list-group-item-action" href="https://www.ninjavan.co/th-th/tracking" target="_blank" >ninja-van</a>
                      <a class="list-group-item list-group-item-action" href="https://www.nimexpress.com/web/p/tracking" target="_blank" >nim-express</a>
                      <a class="list-group-item list-group-item-action" href="https://iel.co.th/tracking/" target="_blank" >inter-express</a>
                      <a class="list-group-item list-group-item-action" href="https://www.shippop.com/tracking" target="_blank" >shippop</a>
                      <a class="list-group-item list-group-item-action" href="https://www.business-idea.co.th/tracking" target="_blank" >business-idea</a>
                      <a class="list-group-item list-group-item-action" href="https://www.dhl.com/th-th/home/tracking.html" target="_blank" >dhl-ecommerce</a>
                      <a class="list-group-item list-group-item-action" href="https://teleport.delivery/track?tracking_number=" target="_blank" >teleport</a>
                    </div>
                  </div>
                  <div class="col-8">
                    <div class="row mt-5 form-group">
                      <div class="col">บริษัทที่จัดส่ง : <br> <input type="text" class="form-control w-75" :value="item.or_courier" disabled></div>
                      <div class="col">หมายเลขพัสดุ : <br> <input type="text" class="form-control w-75" :value="item.or_tracking" disabled></div>
                    </div>
                    <div class="form-group mt-5">
                      <div class="btn btn-warning " @click="onCheck(item), scraping(item), (Api = true)">ติดตามพัสดุ</div>
                      <div class="col mt-4" v-if="Api">
                        <!-- สถานะ -->
                        <div><h5>สถานะปัจจุบัน :</h5><label> {{track.currentStatus}}</label></div>
                        <div><label><b>การจัดส่ง :</b> {{status}}</label></div>
                        <div>
                          <label><b>รายละเอียดพัสดุ :</b> กำหนดส่งไม่เกิน {{track.detail.dueDate}}, น้ำหนัก {{track.detail.weight}}, 
                                  ส่งประเภท {{track.detail.deliveryType}}, จ่ายเงินปลายทาง {{track.detail.isPayCashOnDelivery}} จำนวนเงิน {{track.detail.cashOnDelivery}}</label>
                        </div>
                        <!-- ผู้รับ -->
                        <div><label><b>ผู้รับ :</b> {{track.detail.recipient}}, เบอร์โทร {{track.detail.recipientPhoneNumber}}</label></div>
                        <div>
                          <label><b>ที่อยู่ :</b> อ. {{track.detail.destinationCity}}, จ. {{track.detail.destinationProvince}}, 
                                  รหัสไปรษณีย์ {{track.detail.destinationPostcode}}</label>
                        </div>
                        <div><label><b>ผู้เซ็นรับ :</b> {{track.detail.signer}}</label></div>
                        <div class="img-container"><img :src="track.detail.signerImageURL" alt="image"></div>
                        <!-- ผู้ส่ง -->
                        <div><label><b>ผู้ส่ง :</b> {{track.detail.sender}}, เบอร์โทร {{track.detail.senderPhoneNumber}}</label></div>
                        <div><label><b>ที่อยู่ :</b> อ. {{track.detail.originCity}}, จ. {{track.detail.originProvince}}, รหัสไปรษณีย์ {{track.detail.originPostcode}}</label></div>
                        <!--  -->
                        <div><label><b>เจ้าหน้าที่จัดส่ง :</b> {{track.detail.deliveryStaffName}}, เบอร์โทร {{track.detail.deliveryStaffPhoneNumber}}</label></div>
                        <br>
                        <!-- ส่งถึง -->
                        <div><h5>สถานที่ : </h5></div>
                        <div v-for="(item, index) in track.timelines" :key="index">
                          <div><label><b>วันที่ {{item.date}}</b></label></div>
                          <div v-for="body in Object(item.details)" :key="body">
                            <label><b> => </b> {{body.description}}</label>
                          </div><br>
                        </div>

                      </div>
                      
                    </div>
                  </div>
                </div>
                    
                

            </div>
        </div>
    </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import axios from "axios";

export default {
  components: {
    Layout
  },
  computed: {
    item() {
      return this.$route.params;
    }
  },
  watch: {
    track(value){
      value.status == "ON_PICKED_UP" ? this.status = 'รับพัสดุเข้าระบบแล้ว': '';
      value.status == "ON_SHIPPING" ? this.status = 'ขนส่งกำลังจัดส่งพัสดุของคุณ': '';
      value.status == "ON_DELIVERED" ? this.status = 'ส่งมอบพัสดุแล้ว': '';
      value.status == "ON_UNABLE_TO_SEND" ? this.status = 'พัสดุของคุณถูกตีกลับไปยังต้นทางเรียบร้อยแล้ว': '';
      value.status == "ON_OTHER_STATUS" ? this.status = 'พัสดุของคุณอยู่ระหว่างขนส่ง': '';
    }
  },
  methods: {
    async onCheck(item){
      try {
        
        this.$set(this.trackData, 'courier', item.or_courier);
        this.$set(this.trackData, 'trackingNo', item.or_tracking);
        
        // ส่งจริง
        const response = await axios.post('/api/tracking', this.trackData).then(res => {
          this.track = res.data.data
          }).catch(error => this.alertify.error(error.response.data.message))
        
        // กรณีทดสอบด้วยตัวอย่าง data ที่มี
        // this.track = this.data_t.data

      } catch (error) { console.error('Error :', error); }
    },
    scraping(item){
      // axios.get(`/api/scraping/kerry`).then(res => console.log('scrap',res.data)).catch(err => this.alertify.error(err.response.data.message) )
    }
  },
  data() {
    return {
      Api: false,
      status: "",
      trackData: {},
      track: {},
      data_t: {
    "meta": {
        "code": 200,
        "message": "OK"
    },
    "data": {
        "trackingNo": "KERDO0133608562",
        "courier": "เคอีเอ็กซ์ เอ็กซ์เพรส",
        "courierKey": "kex-express",
        "shareLink": "https://apps.etrackings.com/tracks/kex-express?tracking-no=KERDO0133608562",
        "color": "#FB8523",
        "status": "ON_DELIVERED",
        "currentStatus": "13:00 จัดส่งพัสดุสำเร็จ, ติดต่อเบอร์: ***********************************AQG81THhEWW1HY เวลาที่รอสาย 0 วินาที คุยสนทนา 0 วินาที - เขาค้อ, เพชรบูรณ์",
        "detail": {
            "trackingNo": "",
            "product": "",
            "productImageURL": "",
            "parcelImageURL": "",
            "sender": "ไอซีอิเล็ก********",
            "recipient": "จรูญ ฤทธิ์*******",
            "qty": 0,
            "address": "",
            "originCity": "",
            "originProvince": "พัทลุง",
            "originCountry": "",
            "originPostcode": "",
            "destinationCity": "เขาค้อ",
            "destinationProvince": "เพชรบูรณ์",
            "destinationCountry": "",
            "destinationPostcode": "67270",
            "signer": "จรูญ ฤทธิ์*******",
            "signerImageURL": "data:image/jpeg;base64, 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",
            "weight": 0,
            "shippingService": "",
            "returnShippingService": "",
            "deliveryType": "Normal",
            "packaging": "",
            "senderPhoneNumber": "0810823165",
            "recipientPhoneNumber": "0821860890",
            "pickupDate": "2024-09-03",
            "sendDate": "",
            "dueDate": "2024-09-06",
            "cashOnDelivery": "0",
            "isPayCashOnDelivery": false,
            "deliveryStaffName": "สุรศักดิ์ บำรุงคีรี",
            "deliveryStaffPhoneNumber": "0649353237",
            "deliveryStaffEmail": "",
            "deliveryStaffVehicleType": "",
            "deliveryStaffVehicleRegistrationNumber": "",
            "deliveryStaffBranchPhoneNumber": "",
            "senderCompany": "",
            "senderAddress": "",
            "recipientCompany": "",
            "recipientAddress": "",
            "courierPartnerTrackingNo": "",
            "courierPartner": "",
            "courierPartnerKey": "",
            "businessPartner": "",
            "deliveryTime": 3,
            "returnTrackingNo": "",
            "returnCourier": "",
            "returnCourierKey": "",
            "freight": "0",
            "payType": "",
            "priceMethod": "",
            "referenceNumber": "FU2220083600000000000007105913197",
            "deliveryTimeSlot": "",
            "courierWebsiteURL": "https://th.kerryexpress.com/th/home",
            "courierFacebookURL": "https://www.facebook.com/kexthailand",
            "courierLineOfficialURL": "https://page.line.me/968fnnsc",
            "courierCallCenterPhoneNumber": "1217"
        },
        "timelines": [
            {
                "date": "2024-09-06",
                "details": [
                    {
                        "dateTime": "2024-09-06T13:00:21+07:00",
                        "date": "2024-09-06",
                        "time": "13:00",
                        "status": "ON_DELIVERED",
                        "description": "13:00 จัดส่งพัสดุสำเร็จ, ติดต่อเบอร์: ***********************************AQG81THhEWW1HY เวลาที่รอสาย 0 วินาที คุยสนทนา 0 วินาที - เขาค้อ, เพชรบูรณ์"
                    },
                    {
                        "dateTime": "2024-09-06T12:50:49+07:00",
                        "date": "2024-09-06",
                        "time": "12:50",
                        "status": "ON_SHIPPING",
                        "description": "12:50 พนักงานติดต่อผู้รับ, ติดต่อเบอร์: *******890 เวลาที่รอสาย 14 วินาที คุยสนทนา 13 วินาที - เขาค้อ, เพชรบูรณ์"
                    },
                    {
                        "dateTime": "2024-09-06T09:49:10+07:00",
                        "date": "2024-09-06",
                        "time": "09:49",
                        "status": "ON_SHIPPING",
                        "description": "09:49 กำลังจัดส่งพัสดุ, จัดส่งโดย: สุรศักดิ์ บำรุงคีรี เบอร์โทรพนักงาน: 0649353237 - เขาค้อ, เพชรบูรณ์"
                    },
                    {
                        "dateTime": "2024-09-06T09:43:59+07:00",
                        "date": "2024-09-06",
                        "time": "09:43",
                        "status": "ON_OTHER_STATUS",
                        "description": "09:43 พัสดุถึงคลังสินค้าปลายทาง - เขาค้อ, เพชรบูรณ์"
                    },
                    {
                        "dateTime": "2024-09-06T07:34:54+07:00",
                        "date": "2024-09-06",
                        "time": "07:34",
                        "status": "ON_OTHER_STATUS",
                        "description": "07:34 พัสดุออกจากศูนย์กระจายสินค้า - เมืองเพชรบูรณ์, เพชรบูรณ์"
                    },
                    {
                        "dateTime": "2024-09-06T07:33:53+07:00",
                        "date": "2024-09-06",
                        "time": "07:33",
                        "status": "ON_OTHER_STATUS",
                        "description": "07:33 พัสดุถึงศูนย์กระจายสินค้า - เมืองเพชรบูรณ์, เพชรบูรณ์"
                    },
                    {
                        "dateTime": "2024-09-06T01:49:24+07:00",
                        "date": "2024-09-06",
                        "time": "01:49",
                        "status": "ON_OTHER_STATUS",
                        "description": "01:49 พัสดุออกจากศูนย์กระจายสินค้า - เมืองพิษณุโลก, พิษณุโลก"
                    },
                    {
                        "dateTime": "2024-09-06T01:49:23+07:00",
                        "date": "2024-09-06",
                        "time": "01:49",
                        "status": "ON_OTHER_STATUS",
                        "description": "01:49 พัสดุถึงศูนย์กระจายสินค้า - เมืองพิษณุโลก, พิษณุโลก"
                    }
                ]
            },
            {
                "date": "2024-09-05",
                "details": [
                    {
                        "dateTime": "2024-09-05T12:50:28+07:00",
                        "date": "2024-09-05",
                        "time": "12:50",
                        "status": "ON_OTHER_STATUS",
                        "description": "12:50 พัสดุออกจากศูนย์กระจายสินค้า - วังน้อย, พระนครศรีอยุธยา"
                    },
                    {
                        "dateTime": "2024-09-05T12:50:27+07:00",
                        "date": "2024-09-05",
                        "time": "12:50",
                        "status": "ON_OTHER_STATUS",
                        "description": "12:50 พัสดุถึงศูนย์กระจายสินค้า - วังน้อย, พระนครศรีอยุธยา"
                    },
                    {
                        "dateTime": "2024-09-05T03:12:12+07:00",
                        "date": "2024-09-05",
                        "time": "03:12",
                        "status": "ON_OTHER_STATUS",
                        "description": "03:12 พัสดุออกจากศูนย์กระจายสินค้า - เมืองชุมพร, ชุมพร"
                    },
                    {
                        "dateTime": "2024-09-05T02:42:47+07:00",
                        "date": "2024-09-05",
                        "time": "02:42",
                        "status": "ON_OTHER_STATUS",
                        "description": "02:42 พัสดุถึงศูนย์กระจายสินค้า - เมืองชุมพร, ชุมพร"
                    }
                ]
            },
            {
                "date": "2024-09-04",
                "details": [
                    {
                        "dateTime": "2024-09-04T17:12:14+07:00",
                        "date": "2024-09-04",
                        "time": "17:12",
                        "status": "ON_OTHER_STATUS",
                        "description": "17:12 พัสดุออกจากศูนย์กระจายสินค้า - เมืองพัทลุง, พัทลุง"
                    },
                    {
                        "dateTime": "2024-09-04T17:10:47+07:00",
                        "date": "2024-09-04",
                        "time": "17:10",
                        "status": "ON_OTHER_STATUS",
                        "description": "17:10 พัสดุถึงศูนย์กระจายสินค้า - เมืองพัทลุง, พัทลุง"
                    },
                    {
                        "dateTime": "2024-09-04T15:51:10+07:00",
                        "date": "2024-09-04",
                        "time": "15:51",
                        "status": "ON_OTHER_STATUS",
                        "description": "15:51 พัสดุออกจากศูนย์กระจายสินค้า - ปากพะยูน, พัทลุง"
                    },
                    {
                        "dateTime": "2024-09-04T15:48:28+07:00",
                        "date": "2024-09-04",
                        "time": "15:48",
                        "status": "ON_OTHER_STATUS",
                        "description": "15:48 พัสดุถึงศูนย์กระจายสินค้า - ปากพะยูน, พัทลุง"
                    },
                    {
                        "dateTime": "2024-09-04T15:46:47+07:00",
                        "date": "2024-09-04",
                        "time": "15:46",
                        "status": "ON_PICKED_UP",
                        "description": "15:46 พนักงานเข้ารับพัสดุแล้ว - ปากพะยูน, พัทลุง"
                    }
                ]
            },
            {
                "date": "2024-09-03",
                "details": [
                    {
                        "dateTime": "2024-09-03T17:33:00+07:00",
                        "date": "2024-09-03",
                        "time": "17:33",
                        "status": "ON_OTHER_STATUS",
                        "description": "17:33 ผู้ส่งมาส่งพัสดุที่สาขา - ปากพะยูน, พัทลุง"
                    }
                ]
            }
        ]
    }
},
      
    };
  },
};
</script>

<style scoped>

.btn-menu {
  color: #ffffff;
  background-color: #ced4da;
  margin-right: 7px;
  min-width: 130px;
}
.btn.router-link-exact-active {
  background-color: #17a2b8;
}
form {
  max-width: 350px;
  margin: auto;
}
.list-group-item.active{
  background-color:#3cb8c9;
  border-color:#17a2b8;
}
.list-group-item {
  padding: 0.5rem 1rem;
  border: 0 solid;
  background-color: whitesmoke;
}


@media (max-width: 575.98px) { 
  
}
</style>