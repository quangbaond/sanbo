<script setup>

import Layout from '@/layouts/Home.vue';
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { socket } from '@/socket';


</script>

<template>
  <!-- <Layout :selectedKeys="selectedKeys"/> -->
  <router-view />
</template>
