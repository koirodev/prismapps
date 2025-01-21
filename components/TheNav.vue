<script setup>
import { ref, computed } from 'vue';
import gsap from 'gsap';
import { animation, gsapEase } from '@/config';

const starsCount = ref(3);
const starsText = ref('stars');
const props = defineProps({
  burgerMenu: {
    type: Boolean,
    required: false,
    default: false
  }
});

const stars = computed(() => `${starsCount.value} ${starsText.value}`);

const nav = ref(null);

const resetNavForLargeScreen = () => {
  if (window.innerWidth > 700) {
    gsap.set(nav.value, {
      visibility: 'visible',
      pointerEvents: 'auto',
      opacity: 1,
      scale: 1
    });
  } else {
    gsap.set(nav.value, {
      visibility: props.burgerMenu ? 'visible' : 'hidden',
      pointerEvents: props.burgerMenu ? 'auto' : 'none',
      opacity: props.burgerMenu ? 1 : 0,
      scale: props.burgerMenu ? 1 : 0
    });
  }
};

watch(() => props.burgerMenu, (newValue) => {
  if (window.innerWidth <= 700) {
    gsap.set(nav.value, {
      visibility: newValue ? 'visible' : 'hidden',
      pointerEvents: newValue ? 'auto' : 'none'
    });

    gsap.to(nav.value, {
      opacity: newValue ? 1 : 0,
      duration: animation.DEFAULT
    });

    gsap.to(nav.value, {
      scale: newValue ? 1 : 0,
      duration: animation.LONG,
      ease: gsapEase.BOUNCE
    });
  }
});

onMounted(() => {
  resetNavForLargeScreen();
  window.addEventListener('resize', resetNavForLargeScreen);
});

onUnmounted(() => {
  window.removeEventListener('resize', resetNavForLargeScreen);
});

onMounted(async () => {
  try {
    const { data } = await useFetch('https://api.github.com/repos/koirodev/prismium');
    if (data.value) {
      starsCount.value = data.value.stargazers_count;
    }
  } catch (error) {
    console.error('Failed to fetch GitHub stars:', error);
  }
});
</script>

<template>
  <nav :class="{ 'nav': true, 'nav_show': burgerMenu }" ref="nav">
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
      <hr>
      <li class="nav__item">
        <span class="nav__link text">Demos</span>
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

<style lang="scss" scoped></style>
