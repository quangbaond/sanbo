<script setup>
// import axios from '@/common/axios';
// import { useStore } from 'vuex';
import Layout from '@/layouts/Home.vue';
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
import { socket } from '@/socket';
import { useToast } from 'vue-toast-notification';
import audioTransaction from '@/assets/audio/transaction.wav';

const toast = useToast();

onMounted(() => {
  socket.on('admin-transaction', (transaction) => {
    console.log(transaction);
    const audio = new Audio(audioTransaction);
    audio.play();
    toast.success('Có giao dịch mới');
  });
});
</script>

<template>
  <!-- <Layout :selectedKeys="selectedKeys"/> -->
  <router-view />
</template>
