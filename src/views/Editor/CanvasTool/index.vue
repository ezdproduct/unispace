<template>
  <div class="canvas-tool">
    <div class="left-handler">
      <div class="more">
        <Popover class="more-icon" trigger="click" v-model:value="moreVisible" :offset="10">
          <template #content>
            <PopoverMenuItem class="popover-menu-item" center @click="toggleNotesPanel(); moreVisible = false"><IconComment class="icon" />{{ $t('canvasTool.notes') }}</PopoverMenuItem>
            <PopoverMenuItem class="popover-menu-item" center @click="toggleSelectPanel(); moreVisible = false"><IconMoveOne class="icon" />{{ $t('canvasTool.select') }}</PopoverMenuItem>
            <PopoverMenuItem class="popover-menu-item" center @click="toggleSraechPanel(); moreVisible = false"><IconSearch class="icon" />{{ $t('canvasTool.search') }}</PopoverMenuItem>
          </template>
          <IconMore class="handler-item" />
        </Popover>
      </div>
    </div>

    <div class="right-handler">
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import useScaleCanvas from '@/hooks/useScaleCanvas'

import Popover from '@/components/Popover.vue'
import PopoverMenuItem from '@/components/PopoverMenuItem.vue'
import Slider from '@/components/Slider.vue'

const { t } = useI18n()
const mainStore = useMainStore()
const { showSelectPanel, showSearchPanel, showNotesPanel } = storeToRefs(mainStore)

const {
  scaleCanvas,
  setCanvasScalePercentage,
  resetCanvas,
  canvasScaleNum,
} = useScaleCanvas()

const canvasScalePresetList = [200, 150, 125, 100, 75, 50]
const canvasScaleVisible = ref(false)

const applyCanvasPresetScale = (value: number) => {
  setCanvasScalePercentage(value)
  canvasScaleVisible.value = false
}

const moreVisible = ref(false)

// 打开选择面板
const toggleSelectPanel = () => {
  mainStore.setSelectPanelState(!showSelectPanel.value)
}

// 打开搜索替换面板
const toggleSraechPanel = () => {
  mainStore.setSearchPanelState(!showSearchPanel.value)
}

// 打开批注面板
const toggleNotesPanel = () => {
  mainStore.setNotesPanelState(!showNotesPanel.value)
}
</script>

<style lang="scss" scoped>
.canvas-tool {
  position: relative;
  border-bottom: 1px solid $borderColor;
  background-color: $headerBg;
  display: flex;
  justify-content: space-between;
  padding: 0 40px;
  height: 60px;
  user-select: none;
  color: $textColor;
  align-items: center;
  background-color: $headerBg;
  border-bottom: 1px solid $borderColor;
}
.left-handler {
  display: flex;
  align-items: center;
  flex: 1;
}
.more, .right-handler {
  display: flex;
  align-items: center;
}
.right-handler {
  flex: 1;
  justify-content: flex-end;
}

.divider {
  width: 1px;
  height: 20px;
  background-color: $borderColor;
  margin: 0 20px;
}

.popover-menu-item {
  display: flex;
  padding: 8px 12px;

  &.center {
    justify-content: center;
  }

  .icon {
    font-size: 18px;
    margin-right: 10px;
  }
}

.add-element-handler {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  gap: 8px;

  .insert-handler-item {
    height: 38px;
    min-width: 38px;
    padding: 0 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: $borderRadius;
    cursor: pointer;
    transition: all $transitionDelayFast;
    color: #FFFFFF; // White icons for visibility

    .icon {
      font-size: 20px;
    }

    .text {
      display: none; // Hide text labels as requested
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
      color: $themeColor;
    }

    &.active {
      background-color: rgba(124, 58, 237, 0.15); // Violet active
      color: $themeColor;
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
    }

    &.group-btn {
      padding: 0;
      gap: 0;

      .group-btn-main {
        height: 100%;
        padding: 0 4px 0 8px;
        display: flex;
        align-items: center;
        border-radius: $borderRadius 0 0 $borderRadius;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
      }

      .arrow {
        height: 100%;
        width: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 10px;
        border-radius: 0 $borderRadius $borderRadius 0;

        &:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
      }
    }
  }
}

.handler-item {
  height: 38px;
  width: 38px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all $transitionDelayFast;
  color: #FFFFFF; // White for undo/redo and zoom icons

  &.disable {
    opacity: .2;
    cursor: not-allowed;
  }

  &:not(.disable):hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: $themeColor;
  }
  
  &.active {
    color: $themeColor;
    background-color: rgba(124, 58, 237, 0.1);
  }
}

.right-handler {
  gap: 2px; // Minimal gap
  flex: 1;
  justify-content: flex-end;
  padding-right: 110px; // Increased further to prevent overlap with "Thiết kế" tab

  .viewport-size-adaptation {
    font-size: 18px;
  }
}

.scale-text {
  font-size: 11px;
  min-width: 32px; // Even more compact
  text-align: center;
  color: #FFFFFF;
  margin: 0;
  user-select: none;
}

.zoom-slider-container {
  padding: 0;
  width: 150px; // Increased width for better control
  margin: 0 12px;
  
  ::v-deep(.slider-line) {
    height: 2px !important;
  }
  
  ::v-deep(.slider-dot) {
    width: 12px !important;
    height: 12px !important;
    background-color: $themeColor !important;
    border: none !important;
    top: -5px !important;
  }
}
</style>