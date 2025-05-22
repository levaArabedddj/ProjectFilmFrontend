<template><div>Увійти…</div></template>
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const auth = useAuthStore()

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  if (token) {
    auth.setToken(token)
    router.replace('/main-page-director') // або куди треба
  } else {
    router.replace('/signin')
  }
})
</script>
