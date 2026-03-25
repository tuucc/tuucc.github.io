<script setup lang="ts">
import { computed } from "vue";
import { useData, useRoute } from "vitepress";
import Giscus from "@giscus/vue";

const route = useRoute();
const { isDark } = useData();

const enabled = computed(() => {
  const p = route.path;
  return p.startsWith("/aboutme") || p.startsWith("/blog/");
});

// Make the discussion thread deterministic per page, and force reload on SPA navigation.
const term = computed(() => route.path);
const giscusKey = computed(() => `giscus:${route.path}`);

const theme = computed(() => (isDark.value ? "dark" : "light"));
</script>

<template>
  <div v-if="enabled" style="margin-top: 32px">
    <Giscus
      :key="giscusKey"
      repo="tuucc/tuucc.github.io"
      repo-id="R_kgDOOTOe7w"
      category="General"
      category-id="DIC_kwDOOTOe784C5I-B"
      mapping="specific"
      :term="term"
      strict="0"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="top"
      :theme="theme"
      lang="zh-CN"
      loading="lazy"
    />
  </div>
</template>
