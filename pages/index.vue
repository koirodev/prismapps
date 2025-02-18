<script setup>
import { EffectsModule } from 'prismium/modules';
import { Prismium, PrismiumCurrent, PrismiumContent } from 'prismium/vue';

import 'prismium/css'

const prismiumModules = [EffectsModule];
const prismiumSettings = {
  effect: "line-by-line",
};
</script>

<template>
  <div>

    <Prismium :options="prismiumSettings" :modules="prismiumModules">
      <PrismiumCurrent>
        ОТкрыть
      </PrismiumCurrent>
      <PrismiumContent>
        test
      </PrismiumContent>
    </Prismium>

  </div>
</template>
