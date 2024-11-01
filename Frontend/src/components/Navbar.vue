<template>
    <nav class="navbar navbar-light shadow-sm">
        <a class="navbar-brand pl-5" href="/" >
            <div style="display:flex;">
              <img src="/img/strawLOGO.ico" alt="straw" class="w-25 zoomingBox" >
              <img src="/img/logo.svg" alt="Logo" >
            </div>
        </a>
        <!-- <i class="fa fa-home text-info " style="font-size: xx-large;"></i> -->
        

        <a class="username no-wrap d-none d-sm-table-cell ml-auto">
          <i class="fa fa-user-circle text-info mr-3" aria-hidden="true"></i>
          <label class="mr-4" >รหัสผู้ใช้ : {{this.User.u_id}}</label>
          <label class="mr-4" >ชื่อผู้ใช้ : {{ this.User.u_fullname}}</label>
        </a>

        <a @click="onLogout()" class="btn-logout" data-toggle="tooltip" data-placement="bottom" title="LogOut">
            <i class="fa fa-sign-out " aria-hidden="true"></i>
        </a>
    </nav>
</template>

<script>
import axios from "axios";
export default {
  name: "navbar",
  data() {
    return {
      User: {}
    }
  },
  created(){
    // แสดงข้อมูล user
    this.User = this.$store.state.user
  },
  methods: {
    onLogout() {
      axios.post("/api/account/logout").then(() => {
          this.$store.commit("set_user", null);
          this.$router.push({ name: "login" });
          window.location.reload();
        }).catch(error => alert(error.response.data.message));
    }
  }
};
</script>


<style scoped>
.navbar {
  background-color: #ffffff;
  height: 60px;
  border-bottom: solid 1px #17a2b8;
  padding-right: 0;
  flex-wrap: unset;
}
.navbar-brand img {
  /* width: 262px; */
  height: 45px;
}
.btn-logout {
  width: 80px;
  height: 60px;
  background-color: darkcyan;
  /* background-color: #17a2b8; */
  font-size: 24px;
  text-align: center;
  line-height: 60px;
  cursor: pointer;
}
.btn-logout i {
  color: #ffffff;
}
.username label{
  width: auto;
  height: auto;
  /* color: #17a2b8; */
  color: darkcyan;
  font-size: 16px;

}


@media (max-width: 575.98px) { 
  .navbar-brand img {
    width: 200px;
  }
}
</style>

