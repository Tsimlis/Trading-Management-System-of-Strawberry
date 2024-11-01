<template>
    <section class="card ">
        <header class="card-header text-center">
            <h5 class="m-0" v-html="item.header"></h5>
        </header>
        <div class="card-body modal_news">
            <router-link v-show="item.role === userLogin.u_role || userLogin.u_role === 'admin' || item.role == true"
              v-for="(item, index) in item.navs" 
              :key="index" 
              :to="item.link || '#'"
              class="sidebar-link">
                <i class="fa fa-chevron-circle-right"></i> {{ item.name }}
            </router-link>
        </div>
    </section>
</template>

<script>
import {mapState} from 'vuex'

export default {
  props: ["item"],
  computed: {
    ...mapState({
      userLogin: state => state.user 
    })
  }
};
</script>


<style scoped>

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
.fa-chevron-circle-right {
  color: #17a2b8;
  margin-right: 4px;
}
.sidebar-link:hover,
.sidebar-link.router-link-active {
  background-color: #dee2e6;
}
.sidebar-link.router-link-active,
.sidebar-link.router-link-active .fa-chevron-circle-right,
.sidebar-link:hover,
.sidebar-link:hover .fa-chevron-circle-right {
  color: #212529;
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
