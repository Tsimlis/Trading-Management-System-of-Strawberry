<template>
    
    <div class="layout">
        <nav class="navbar navbar-light shadow-sm">
            <a class="navbar-brand" href="/other/home" >
                <div class="" style="display:flex;">
                  <img src="/img/strawLOGO.ico" alt="straw" class="img-logo w-25 zoomingBox">
                  <img src="/img/logo.svg" alt="Logo" class="img-logo w-100">
                </div>
            </a>
            

            
            <a class="username no-wrap d-none d-sm-table-cell ml-auto">
                <MARQUEE    direction="ทิศทางการวิ่ง" width="ความกว้าง"   height="ความสูง"
                            scrollamount=ความเร็วในการวิ่ง  scrolldelay="เวลาหน่วง">
                            <router-link class="sidebar-link float-left " :to="{ name: 'login' }"><u>ลงทะเบียนเพื่อซื้อผลผลิต</u></router-link>
                </MARQUEE>
            </a>

            <a @click="onLogout()" class="btn-logout" data-toggle="tooltip" data-placement="bottom" title="LogOut">
                <i class="fa fa-sign-out " aria-hidden="true"></i>
            </a>
        </nav>
        <div class="container" style="max-width: 1800px;">
            <slot name="buttons"></slot>
            <div class="row">

                <!-- before :left, after :right -->
                <div class="col-lg-3">
                  <div class="sidebar">
                      <section class="card">
                          <header class="card-header text-center">
                              <h5 class="m-0" >ร้านค้าสตรอว์เบอร์รี</h5>
                          </header>
                          <div class="card-body modal_news">
                              <router-link class="sidebar-link" :to="{ name: 'other-retail' }"><i class="fa fa-chevron-circle-right"></i> ขายปลีก</router-link>
                              <router-link class="sidebar-link" :to="{ name: 'other-wholesale' }"><i class="fa fa-chevron-circle-right"></i> ขายส่ง</router-link>
                          </div>
                      </section>
                  </div>
                </div>
                <div class="col-lg-9">
                     <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/*  */
.sidebar-link {
    display: block;
    padding: 0.5rem 1.5rem;
    margin-bottom: 2px;
    color: #525b62;
    font-weight: 400;
    text-decoration: none;
}
.sidebar{
  margin-bottom: 0px;
}
/*  */
h5 {
  font-size: 1rem;
}
.card {
  background: none;
  border: none;
}
.card-body {
  padding: 0.5rem 0;
}
.sidebar-link {
  display: block;
  padding: 0.5rem 1.5rem;
  margin-bottom: 2px;
  color: #525b62;
  font-weight: 400;
  text-decoration: none;
}
/*  */
.navbar {
  background-color: #ffffff;
  height: 60px;
  border-bottom: solid 1px #17a2b8;
  padding-right: 0;
  flex-wrap: unset;
}
.navbar-brand img {
  width: 262px;
  height: 45px;
}
.btn-logout {
  width: 80px;
  height: 60px;
  background-color: darkcyan;
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
  color: darkcyan;
  font-size: 16px;
}


.modal_news {
  /* margin: 23px;
  max-width: 50%; */
  /* padding: 1rem 2rem; */
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.4); 
  border-radius: 0.25rem;
}
</style>