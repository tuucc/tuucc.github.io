<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import GiscusComments from "./components/GiscusComments.vue";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #doc-after>
      <GiscusComments />
    </template>
  </Layout>
</template>
