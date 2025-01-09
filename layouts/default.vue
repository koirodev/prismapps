<script setup></script>

<template>
  <Html class="page">
    <Body class="page__body">
      <main class="main">
        <TheHeader />

        <div class="wrapper">
          <div class="wrapper__content">
            <slot></slot>

            <TheFooter />
          </div>
        </div>
      </main>
    </Body>
  </Html>
</template>

<style></style>
