<script setup>
import useHeaderScroll from '@/composables/useHeaderScroll';

const { isHeaderHidden } = useHeaderScroll();

const { $globalSizes } = useNuxtApp();
const versionPrefix = ref('v');
const versionValue = ref('4.0.0');
const version = computed(() => versionPrefix.value + versionValue.value);


onMounted(() => {
  $globalSizes.updateAllSizes();
});

onMounted(async () => {
  try {
    const { data } = await useFetch('https://registry.npmjs.org/prismium/latest');
    if (data.value) {
      versionValue.value = data.value.version;
    }
  } catch (error) {
    console.error('Failed to fetch package version:', error);
  }
});

const burgerMenu = ref(false);

document.addEventListener('click', (event) => {
  if (burgerMenu.value && !event.target.closest('.burger-button') && !event.target.closest('.nav')) {
    burgerMenu.value = false;
  }
});
</script>

<template>
  <header :class="{
    'header': true,
    'header_hidden': isHeaderHidden
  }">
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

      <TheNav :burgerMenu="burgerMenu" />

      <button :class="{
        'burger-button': true,
        'burger-button_active': burgerMenu
      }" type="button" title="Open menu" @click.prevent="burgerMenu = !burgerMenu;">
        <span class="burger-button__line"></span>
      </button>
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
  z-index: 0;
}
</style>
