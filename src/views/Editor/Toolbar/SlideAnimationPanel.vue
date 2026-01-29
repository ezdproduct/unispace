<template>
  <div class="slide-animation-panel">
    <div class="animation-pool">
      <div 
        class="animation-item" 
        :class="{ 'active': currentTurningMode === item.value }" 
        v-for="item in animations" 
        :key="item.label"
        @click="updateTurningMode(item.value)"
        @mouseenter="handleMouseEnter(item.value)"
        @mouseleave="handleMouseLeave()"
      >
        <div :class="['animation-block', item.value, { 'auto-play': autoPlayItem === item.value }]">P</div>
        <div class="animation-text">{{ $t(`animation.${item.value}`) }}</div>
      </div>
    </div>
    <Button style="width: 100%;" @click="applyAllSlide()"><IconCheck /> {{ $t('toolbar.applyBackgroundAll') }}</Button>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useSlidesStore, useMainStore } from '@/store'
import type { TurningMode } from '@/types/slides'
import { SLIDE_ANIMATIONS } from '@/configs/animation'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import message from '@/utils/message'
import Button from '@/components/Button.vue'

const { t } = useI18n()
const slidesStore = useSlidesStore()
const mainStore = useMainStore()
const { slides, currentSlide } = storeToRefs(slidesStore)

const currentTurningMode = computed(() => currentSlide.value.turningMode || 'slideY')

const animations = SLIDE_ANIMATIONS

const { addHistorySnapshot } = useHistorySnapshot()

// 修改播放时的切换页面方式
const updateTurningMode = (mode: TurningMode) => {
  if (mode === currentTurningMode.value) return
  slidesStore.updateSlide({ turningMode: mode })
  addHistorySnapshot()
}

// 将当前页的切换页面方式应用到全部页面
  message.success(t('toolbar.appliedAll'))
  addHistorySnapshot()
}

const autoPlayItem = ref('')

onMounted(async () => {
  for (const item of animations) {
    if (item.value === 'no' || item.value === 'random') continue
    autoPlayItem.value = item.value
    await new Promise(resolve => setTimeout(resolve, 800))
  }
  autoPlayItem.value = ''
})

const handleMouseEnter = (mode: TurningMode) => {
  if (mode === 'no' || mode === 'random') return
  mainStore.setPreviewTransition(mode)
}

const handleMouseLeave = () => {
  mainStore.setPreviewTransition('')
}
</script>

<style lang="scss" scoped>
.animation-pool {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.animation-item {
  width: 50%;
  height: 100px;
  border: solid 1px #d6d6d6;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0 15px 0;
  position: relative;
  cursor: pointer;

  &.active {
    border-color: $themeColor;
    background-color: rgba($color: $themeColor, $alpha: .05);
    z-index: 1;
  }

  &:nth-child(2n) {
    margin-left: -1px;
  }
  &:nth-child(n+3) {
    margin-top: -1px;
  }
}
.animation-block {
  width: 64px;
  height: 36px;
  background: #666;
  position: relative;
  overflow: hidden;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  @mixin elAnimation($animationType) {
    content: 'PPTist';
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: $themeColor;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: $animationType $transitionDelaySlow linear;
  }

  &.fade:hover, &.fade.auto-play {
    &::after {
      @include elAnimation(fade);
    }
  }
  &.slideX:hover, &.slideX.auto-play {
    &::after {
      @include elAnimation(slideX);
    }
  }
  &.slideY:hover, &.slideY.auto-play {
    &::after {
      @include elAnimation(slideY);
    }
  }
  &.slideX3D:hover, &.slideX3D.auto-play {
    &::after {
      @include elAnimation(slideX3D);
    }
  }
  &.slideY3D:hover, &.slideY3D.auto-play {
    &::after {
      @include elAnimation(slideY3D);
    }
  }
  &.rotate:hover, &.rotate.auto-play {
    &::after {
      transform-origin: 0 0;
      @include elAnimation(rotate);
    }
  }
  &.scaleY:hover, &.scaleY.auto-play {
    &::after {
      @include elAnimation(scaleY);
    }
  }
  &.scaleX:hover, &.scaleX.auto-play {
    &::after {
      @include elAnimation(scaleX);
    }
  }
  &.scale:hover, &.scale.auto-play {
    &::after {
      @include elAnimation(scale);
    }
  }
  &.scaleReverse:hover, &.scaleReverse.auto-play {
    &::after {
      @include elAnimation(scaleReverse);
    }
  }
}
.animation-text {
  font-size: 12px;
  color: #333;
  text-align: center;
}
</style>