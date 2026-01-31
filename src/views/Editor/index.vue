<template>
  <div class="pptist-editor">
    <EditorHeader class="layout-header" />
    <div class="layout-content">
      <SideBar class="layout-side-bar" />
      
      <div class="layout-side-panel" v-if="sidebarState">
        <SidePanel />
      </div>

      <div class="layout-content-center">
        <CanvasTool class="center-top" />
        <div class="canvas-wrapper">
          <Canvas class="center-body" />
        </div>
        <div class="bottom-bar">
          <div class="bottom-tools">
            <div class="notes-btn"><IconNotes /> Notes</div>
            <div class="status-info">
              <span class="slide-number">{{ $t('thumbnails.slideNumber', { index: slideIndex + 1, total: slides.length }) }}</span>
            </div>
            <div class="zoom-controls">
              <IconMinus class="zoom-icon" @click="scaleCanvas('-')" />
              <div class="zoom-slider">
                <Slider 
                  :value="canvasScaleNum" 
                  :min="10" 
                  :max="200" 
                  @update:value="value => setCanvasScalePercentage(value as number)" 
                />
              </div>
              <IconPlus class="zoom-icon" @click="scaleCanvas('+')" />
              <span class="zoom-text">{{ canvasScaleNum }}%</span>
              <IconFullScreen class="zoom-icon-reset" @click="resetCanvas()" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <SelectPanel v-if="showSelectPanel" />
  <SearchPanel v-if="showSearchPanel" />
  <NotesPanel v-if="showNotesPanel" />
  <MarkupPanel v-if="showMarkupPanel" />
  <SymbolPanel v-if="showSymbolPanel" />
  <ImageLibPanel v-if="showImageLibPanel" />

  <Modal
    :visible="!!dialogForExport" 
    :width="680"
    @closed="closeExportDialog()"
  >
    <ExportDialog />
  </Modal>

  <Modal
    :visible="!!showAIPPTDialog" 
    :width="720"
    :closeOnClickMask="false"
    :closeOnEsc="false"
    closeButton
    :wrapStyle="{ opacity: showAIPPTDialog === 'running' ? 0 : 1 }"
    @closed="closeAIPPTDialog()"
  >
    <AIPPTDialog />
  </Modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { useI18n } from 'vue-i18n'
import useGlobalHotkey from '@/hooks/useGlobalHotkey'
import usePasteEvent from '@/hooks/usePasteEvent'
import useScaleCanvas from '@/hooks/useScaleCanvas'

import {
  Notes as IconNotes,
  Minus as IconMinus,
  Plus as IconPlus,
  FullScreen as IconFullScreen,
} from '@icon-park/vue-next'

import EditorHeader from './EditorHeader/index.vue'
import SideBar from './SideBar.vue'
import SidePanel from './SidePanel.vue'
import Canvas from './Canvas/index.vue'
import CanvasTool from './CanvasTool/index.vue'
import Thumbnails from './Thumbnails/index.vue'
import Toolbar from './Toolbar/index.vue'
import Remark from './Remark/index.vue'
import ExportDialog from './ExportDialog/index.vue'
import SelectPanel from './SelectPanel.vue'
import SearchPanel from './SearchPanel.vue'
import NotesPanel from './NotesPanel.vue'
import SymbolPanel from './SymbolPanel.vue'
import MarkupPanel from './MarkupPanel.vue'
import ImageLibPanel from './ImageLibPanel.vue'
import AIPPTDialog from './AIPPTDialog.vue'
import Modal from '@/components/Modal.vue'
import Slider from '@/components/Slider.vue'

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { t } = useI18n()
const {
  dialogForExport,
  showSelectPanel,
  showSearchPanel,
  showNotesPanel,
  showSymbolPanel,
  showMarkupPanel,
  showImageLibPanel,
  showAIPPTDialog,
  sidebarState,
} = storeToRefs(mainStore)
const { slides, slideIndex } = storeToRefs(slidesStore)

const closeExportDialog = () => mainStore.setDialogForExport('')
const closeAIPPTDialog = () => mainStore.setAIPPTDialogState(false)

const remarkHeight = ref(40)

const {
  scaleCanvas,
  setCanvasScalePercentage,
  resetCanvas,
  canvasScaleNum,
} = useScaleCanvas()

useGlobalHotkey()
usePasteEvent()
</script>

<style lang="scss" scoped>
.pptist-editor {
  height: 100%;
}
.layout-header {
  height: 56px;
}
.layout-content {
  height: calc(100% - 56px);
  display: flex;
}
.layout-side-bar {
  flex-shrink: 0;
}
.layout-side-panel {
  width: 320px;
  height: 100%;
  background-color: #FAF9F6;
  border-right: 1px solid $borderColor;
  flex-shrink: 0;
  z-index: 5;
  box-shadow: 4px 0 16px rgba(0,0,0,0.05);

  .panel-content {
    padding: 24px;
    h3 {
      font-size: 18px;
      margin-bottom: 20px;
      color: $textColor;
    }
  }
}
.layout-content-center {
  flex: 1;
  background-color: #F2EEE4;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .center-top {
    height: 48px;
    background-color: #FFFFFF;
    border-bottom: 1px solid $borderColor;
  }
  
  .canvas-wrapper {
    flex: 1;
    position: relative;
    overflow: hidden;
  }
}
.bottom-bar {
  height: 32px;
  background-color: #FFFFFF;
  border-top: 1px solid $borderColor;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  .pages-strip {
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 8px;
  }

  .bottom-tools {
    height: 32px;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid $borderColor;
    background-color: $lightGray;
    font-size: 11px;
    color: $textColorSecondary;
  }

  .notes-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    &:hover { color: $themeColor; }
  }

  .zoom-controls {
    display: flex;
    align-items: center;
    gap: 12px;

    .zoom-icon, .zoom-icon-reset {
      cursor: pointer;
      font-size: 16px;
      transition: color 0.2s;
      &:hover { color: $themeColor; }
    }

    .zoom-slider {
      width: 120px;
    }

    .zoom-text {
      font-size: 12px;
      min-width: 40px;
      text-align: center;
      font-weight: 500;
    }
  }
}

</style>