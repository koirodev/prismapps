import { ref } from 'vue'

export default defineNuxtPlugin(() => {
  const pages = ref([
    { id: 1, name: "Хостинг", path: "/" },
    { id: 2, name: "Виртуальная атс", path: "/virtualnaya-ats" },
    { id: 3, name: "Подобрать домен", path: "/proverka-domena" },
  ]);

  return {
    provide: {
      pages
    }
  };
});
