<template>
  <div class="side-bar">
    <div 
      class="tab-item" 
      v-for="tab in tabs" 
      :key="tab.value"
      :class="{ 'active': activeTab === tab.value }"
      @click="setTab(tab.value)"
    >
      <component :is="tab.icon" class="icon" />
      <div class="label">{{ tab.label }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import {
  GraphicDesign as IconGraphicDesign,
  Components as IconComponents,
  FontSize as IconFontSize,
  UploadOne as IconUpload,
  SettingConfig as IconSettingConfig,
  LayoutOne as IconLayoutOne,
  Picture as IconPicture,
  GoOn as IconGoOn,
} from '@icon-park/vue-next'
import { h } from 'vue'

const IconAi = {
  render: () => h('svg', {
    viewBox: '0 0 48 48',
    fill: 'none',
    width: '1em',
    height: '1em',
    stroke: 'currentColor',
    'stroke-width': 4,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }, [
    h('path', { d: 'M9 42L19 8L29 42' }),
    h('path', { d: 'M13 30H25' }),
    h('path', { d: 'M39 8V42' }),
  ])
}

const mainStore = useMainStore()
const { sidebarState: activeTab } = storeToRefs(mainStore)

const tabs = [
  { label: 'Mẫu', value: 'templates', icon: IconLayoutOne },
  { label: 'Thành phần', value: 'elements', icon: IconComponents },
  { label: 'Văn bản', value: 'text', icon: IconFontSize },
  { label: 'Ảnh', value: 'image', icon: IconPicture },
  { label: 'AI', value: 'ai', icon: IconAi },
]

const setTab = (value: string) => {
  mainStore.setSidebarState(value)
}
</script>

<style lang="scss" scoped>
.side-bar {
  width: 72px;
  height: 100%;
  background-color: #FAF9F6;
  display: flex;
  flex-direction: column;
  padding-top: 8px;
  z-index: 10;
  border-right: 1px solid $borderColor;
}

.tab-item {
  width: 100%;
  height: 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #6D7278;
  cursor: pointer;
  transition: all 0.2s;
  gap: 4px;

  &:hover {
    color: $textColor;
    background-color: rgba(0,0,0,0.02);
  }

  &.active {
    color: $themeColor;
    background-color: #FFFFFF;
  }

  .icon {
    font-size: 24px;
  }

  .label {
    font-size: 10px;
    font-weight: 500;
  }
}
</style>
