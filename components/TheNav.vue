<script setup>
import { ref, computed } from "vue";

const starsCount = ref(0);
const starsText = ref("stars");
const stars = computed(() => `${starsCount.value} ${starsText.value}`);

onMounted(async () => {
  try {
    const { data } = await useFetch("https://api.github.com/repos/koirodev/prismium");
    if (data.value) {
      starsCount.value = data.value.stargazers_count;
    }
  } catch (error) {
    console.error("Failed to fetch GitHub stars:", error);
  }
});
</script>

<template>
  <nav class="nav">
    <ul class="nav__list">
      <li class="nav__item">
        <span class="nav__link text">Docs</span>
        <ul class="nav__list">
          <li class="nav__item nav__item_border">
            <NuxtLink class="nav__link" to="/get-stated">Getting Started</NuxtLink>
          </li>
          <hr>
          <li class="nav__item">
            <NuxtLink class="nav__link" to="/prismium-api">Prismium Core / Api</NuxtLink>
          </li>
          <li class="nav__item">
            <NuxtLink class="nav__link" to="/prismium-react">Prismium React</NuxtLink>
          </li>
          <li class="nav__item">
            <NuxtLink class="nav__link" to="/prismium-vue">Prismium Vue</NuxtLink>
          </li>
          <hr>
          <li class="nav__item nav__item_border">
            <NuxtLink class="nav__link" to="/changelog">Changelog</NuxtLink>
          </li>
        </ul>
      </li>
      <li class="nav__item">
        <a class="nav__link nav__link_github" href="https://github.com/koirodev/prismium/" target="_blank">
          <SvgGithub class="nav__icon" :fontControlled="false" filled />
          <span class="text">{{ stars }}</span>
        </a>
      </li>
    </ul>
  </nav>
</template>
