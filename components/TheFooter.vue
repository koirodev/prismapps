<script setup></script>

<template>
  <footer class="footer">
    <div class="container">
      <span class="text">© prismium {{ new Date().getFullYear() }}</span>
    </div>
  </footer>
</template>

<style lang="scss">
.footer {
  position: relative;

  padding: rem(20) 0;

  border-top: 1px solid var(--stroke-light);

  & .container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & .text {
    width: fit-content;

    font: 500 rem(16) / 1.4 var(--font-secondary);
  }
}
</style>
