<script setup>
import { ref, computed } from "vue";

const versionPrefix = ref("v");
const versionValue = ref("0.0.0");
const version = computed(() => versionPrefix.value + versionValue.value);

onMounted(async () => {
  try {
    const { data } = await useFetch("https://registry.npmjs.org/prismium/latest");
    if (data.value) {
      versionValue.value = data.value.version;
    }
  } catch (error) {
    console.error("Failed to fetch package version:", error);
  }
});
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="logo">
        <NuxtLink class="logo__image" to="/">
          <SvgLogoLight class="logo__icon" :fontControlled="false" filled />
        </NuxtLink>
        <span class="logo__text text text_rs">prismium</span>
        <a class="logo__version text" href="https://www.npmjs.com/package/prismium" target="_blank">
          {{ version }}
        </a>
      </div>

      <TheNav />
      <button class="burger-menu"></button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.nav {
  margin-left: auto;
}

.logo {
  position: relative;
  bottom: 7px;
}
</style>
