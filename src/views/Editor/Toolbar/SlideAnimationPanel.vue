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
        <div :class="['animation-block', item.value]"></div>
        <div class="animation-text">{{ $t(`animation.${item.value}`) }}</div>
      </div>
    </div>
    <Button style="width: 100%;" @click="applyAllSlide()"><IconCheck /> {{ $t('toolbar.applyBackgroundAll') }}</Button>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
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

const applyAllSlide = () => {
  const newSlides = slides.value.map(slide => {
    return {
      ...slide,
      turningMode: currentSlide.value.turningMode,
    }
  })
  slidesStore.setSlides(newSlides)
  message.success(t('toolbar.appliedAll'))
  addHistorySnapshot()
}

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
  margin-bottom: 20px;
}
.animation-item {
  width: 50%;
  height: 110px;
  border: solid 1px $borderColor;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0 15px 0;
  position: relative;
  cursor: pointer;
  background-color: transparent;
  transition: all $transitionDelay;

  &.active {
    border-color: $accentTeal;
    background-color: rgba($accentTeal, 0.05);
    z-index: 1;

    .animation-text {
      color: $accentTeal;
      font-weight: 700;
    }
  }

  &:hover:not(.active) {
    background-color: rgba(255, 255, 255, 0.05);
  }

  &:nth-child(2n) {
    margin-left: -1px;
  }
  &:nth-child(n+3) {
    margin-top: -1px;
  }
}
.animation-block {
  width: 72px;
  height: 40px;
  background: #252525;
  position: relative;
  overflow: hidden;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @mixin elAnimation($animationType) {
    content: 'PPT';
    width: 102%; // Slightly larger to cover borders nicely
    height: 102%;
    position: absolute;
    left: -1%;
    top: -1%;
    background-color: $accentTeal;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 10px;
    font-weight: 700;
    animation: $animationType 2s infinite; // Changed to infinite for continuous autoplay
  }

  &.fade::after { @include elAnimation(fade); }
  &.slideX::after { @include elAnimation(slideX); }
  &.slideY::after { @include elAnimation(slideY); }
  &.slideX3D::after { @include elAnimation(slideX3D); }
  &.slideY3D::after { @include elAnimation(slideY3D); }
  &.rotate::after { 
    transform-origin: 0 0;
    @include elAnimation(rotate);
  }
  &.scaleY::after { @include elAnimation(scaleY); }
  &.scaleX::after { @include elAnimation(scaleX); }
  &.scale::after { @include elAnimation(scale); }
  &.scaleReverse::after { @include elAnimation(scaleReverse); }
}
.animation-text {
  font-size: 12px;
  color: $textColor;
  text-align: center;
}
</style>