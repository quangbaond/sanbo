<script setup>
import Header from '@/components/common/Header.vue';
import Footer from '@/components/common/Footer.vue';
import 'vue3-carousel/dist/carousel.css';
import banner1 from '@/assets/img/banner.png';
import banner2 from '@/assets/img/banner1.png';
import banner3 from '@/assets/img/banner.png';

const slider = [
  { image: banner1 },
  { image: banner2 },
  { image: banner3 },
];
</script>
<template>
  <a-layout class="layout">
    <Header />
    <a-layout-content>
      <div :style="{ background: '#fff', padding: '0 0px', minHeight: '280px' }">
        <div id="banner">
          <div class="caption">
            <h3>Nền tảng</h3>
            <h3>giao dịch</h3>
            <h3 style="font-weight: 700;">Tiền điện tử</h3>
            <h3>Hàng đầu</h3>
          </div>
        </div>
        <div class="couter-section">
          <a-row :gutter="10" justify="center">
            <a-col :span="24" :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="counter-item">
              <a-row>
                <a-col :span="24">
                  <img src="@/assets/img/counter01.png" alt="counter" />
                </a-col>
                <a-col :span="24" xs="24" sm="24" md="12" lg="12" xl="12">
                  <div id="couter-text">
                    <h2>36.9M</h2>
                    <p>Khách hàng</p>
                  </div>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="24" :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="counter-item">
              <a-row>
                <a-col :span="24">
                  <img src="@/assets/img/counter01.png" alt="counter" />
                </a-col>
                <a-col :span="24" xs="24" sm="24" md="12" lg="12" xl="12">
                  <div id="couter-text">
                    <h2>36.9M</h2>
                    <p>Khách hàng</p>
                  </div>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="24" :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="counter-item">
              <a-row>
                <a-col :span="24">
                  <img src="@/assets/img/counter01.png" alt="counter" />
                </a-col>
                <a-col :span="24" xs="24" sm="24" md="12" lg="12" xl="12">
                  <div id="couter-text">
                    <h2>36.9M</h2>
                    <p>Khách hàng</p>
                  </div>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-layout-content>
    <Footer />
  </a-layout>
</template>

<style>
.counter-section {
  padding: 20px;
}
.counter-item {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
#banner {
  width: 100%;
  height: 400px;
  background-image: url('@/assets/img/banner.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.caption {
  position: absolute;
  top: 15%;
  left: 60%;
  width: 40%;
  text-align: left;
}
.caption h3 {
  /* color: #000; */
  font-size: 30px;
  font-weight: 600;
}
@media (max-width: 768px) {
  #banner {
    height: 200px;
    background-size: contain;
  }
}
.site-layout-content {
  min-height: 280px;
  padding: 24px;
  background: #fff;
}
.ant-layout-content {
  padding: 0 0px !important;
}

#components-layout-demo-top .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

[data-theme='dark'] .site-layout-content {
  background: #141414;
}
.ant-layout-header {
  /* background: #fff !important; */
  padding-inline: 10px !important;
}
</style>
