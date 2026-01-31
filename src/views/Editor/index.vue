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
          <div class="pages-strip">
            <Thumbnails :vertical="false" />
          </div>
          <div class="bottom-tools">
            <div class="notes-btn"><IconNotes /> Notes</div>
            <div class="status-info">
              <span class="slide-number">{{ $t('thumbnails.slideNumber', { index: slideIndex + 1, total: slides.length }) }}</span>
            </div>
            <div class="zoom-controls">
              <!-- Reuse CanvasTool zoom part if needed -->
            </div>
          </div>
        </div>
      </div>
      <Toolbar class="layout-content-right" />
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
  background-color: #FFFFFF;
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
  background-color: $lightGray;
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
  height: 120px;
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
}
.layout-content-right {
  width: 280px;
  height: 100%;
  background-color: #FFFFFF;
  border-left: 1px solid $borderColor;
}
</style>