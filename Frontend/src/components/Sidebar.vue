<template>
    <div class="sidebar no-wrap">

      <SidebarNav v-if="userLogin.u_role === 'admin'" :item="admin" class="sidebar-nav" />
      <SidebarNav v-if="userLogin.u_role === 'farmer' ||
                        userLogin.u_role === 'buying'" :item="storeIn" class="sidebar-nav" />
      <SidebarNav v-if="userLogin.u_role === 'user' ||
                        userLogin.u_role === 'selling' " :item="storeOut" class="sidebar-nav" />
      <SidebarNav  :item="setting" class="sidebar-nav" />

    </div>
</template>

<script>
import SidebarNav from "./SidebarNav";
import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState({
      userLogin: state => state.user 
    })
  },
  data() {
    return {
      admin: {
        header: "<i class='fa fa-unlock mr-2'></i> ส่วนของผู้ดูแลระบบ",
        navs: [
          { name: "แจ้งราคาและข่าวสาร", link: { name: "news-list"} },
          { name: "ข้อมูลสมาชิกระบบ", link: { name: "user-info" } },
          { name: "ปฏิทิน", link: { name: "calendar" } },
          { name: "ข้อความ", link: { name: "message" } }
        ]
      },
      storeIn: {
        header: "<i class='fa fa-home mr-2'></i> ร้านรับซื้อผลผลิต",
        navs: [
          { name: "สรุปยอดซื้อ", link: { name: "total-buy" }, role: 'buying' },
          { name: "ร้านรับซื้อ", link: { name: "buy-list" }, role: 'buying' },
          { name: "เกษตรกร", link: { name: "farmer-present"}, role: 'farmer'}
        ]
      },
      storeOut: {
        header: "<i class='fa fa-home mr-2'></i> ร้านขายผลผลิต",
        navs: [
          { name: "สรุปยอดขาย", link: { name: "total-selling"}, role: 'selling' },
          { name: "ร้านค้า", link: { name: "selling-list"}, role: 'selling' },
          { name: "ขายปลีก", link: { name: "retail"}, role: 'user'},
          { name: "ขายส่ง", link: { name: "wholesale"}, role: 'user'},
          { name: "ตะกร้าสินค้า", link: { name: "basket"}, role: 'user'},
          { name: "สินค้าของคุณ", link: { name: "your-product"}, role: 'user'}
        ]
      },
      setting: {
        header: "<i class='fa fa-cog mr-2'></i> ตั้งค่าอื่น ๆ",
        navs: [
          { name: "ตั้งค่าข้อมูลส่วนตัว" , link: { name: "setting"}, role: true }
        ]
      },
    };
  },
  components: {
    SidebarNav
  }
};
</script>

<style scoped>
.sidebar-nav {
  margin-bottom: 0px;
}


</style>


