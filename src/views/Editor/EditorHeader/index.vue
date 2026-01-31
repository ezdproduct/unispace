<template>
  <div class="editor-header">
    <div class="left">
      <div class="header-item home-btn" @click="goLink('/')">
        <span class="logo-text">UNISPACE</span>
      </div>

      <Popover trigger="click" placement="bottom-start" v-model:value="mainMenuVisible">
        <template #content>
          <div class="main-menu">
            <div class="ai-menu" @click="openAIPPTDialog(); mainMenuVisible = false">
              <div class="icon"><IconClick theme="two-tone" :fill="['#ffc158', '#fff']" /></div>
              <div class="aippt-content">
                <div class="aippt"><span>Magic Studio</span></div>
                <div class="aippt-subtitle">{{ $t('header.aipptSubtitle') }}</div>
              </div>
            </div>
          </div>
          <Divider :margin="10" />
          <div class="import-section">
            <div class="import-label">{{ $t('header.importFile') }}</div>
            <div class="import-grid">
              <FileInput class="import-block" accept="application/vnd.openxmlformats-officedocument.presentationml.presentation" @change="files => {
                importPPTXFile(files)
                mainMenuVisible = false
              }">
                <span class="icon"><IconFilePdf theme="multi-color" :fill="['#333', '#d14424', '#fff']" /></span>
                <span class="label">PPTX</span>
              </FileInput>
              <FileInput class="import-block" accept=".pptist" @change="files => {
                importSpecificFile(files)
                mainMenuVisible = false
              }">
                <span class="icon"><IconNotes theme="multi-color" :fill="['#333', '#d14424', '#fff']" /></span>
                <span class="label">PPTIST</span>
              </FileInput>
            </div>
          </div>
          <Divider :margin="10" />
          <PopoverMenuItem class="popover-menu-item" @click="setDialogForExport('pptx')"><IconDownload class="icon" /> {{ $t('header.exportFile') }}</PopoverMenuItem>
          <Divider :margin="10" />
          <PopoverMenuItem class="popover-menu-item" @click="resetSlides(); mainMenuVisible = false"><IconRefresh class="icon" /> {{ $t('header.resetSlides') }}</PopoverMenuItem>
          <PopoverMenuItem class="popover-menu-item" @click="openMarkupPanel(); mainMenuVisible = false"><IconMark class="icon" /> {{ $t('header.slideLabel') }}</PopoverMenuItem>
        </template>
        <div class="header-item"><span>File</span></div>
      </Popover>

      <div class="header-item">
        <IconDiamond class="icon" style="color: #ffc158;" /> <span>Resize</span>
      </div>

      <div class="header-actions">
        <IconBack class="action-icon" :class="{ 'disable': !canUndo }" @click="undo()" />
        <IconNext class="action-icon" :class="{ 'disable': !canRedo }" @click="redo()" />
      </div>
      
      <div class="save-status">
        <IconCloudCheck v-if="true" />
        <span>All changes saved</span>
      </div>
    </div>

    <div class="center">
      <!-- Title section removed as per user request -->
    </div>

    <div class="right">


      <div class="contact-btn-modern">
        <span>Liên hệ</span>
      </div>
    </div>

    <Drawer
      :width="320"
      v-model:visible="hotkeyDrawerVisible"
      placement="right"
    >
      <HotkeyDoc />
      <template v-slot:title>{{ $t('header.hotkeys') }}</template>
    </Drawer>

    <FullscreenSpin :loading="exporting" :tip="$t('header.importing')" />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, useTemplateRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore, useSnapshotStore } from '@/store'
import useScreening from '@/hooks/useScreening'
import useImport from '@/hooks/useImport'
import useSlideHandler from '@/hooks/useSlideHandler'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import type { DialogForExportTypes } from '@/types/export'

import HotkeyDoc from './HotkeyDoc.vue'
import FileInput from '@/components/FileInput.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import Drawer from '@/components/Drawer.vue'
import Input from '@/components/Input.vue'
import Popover from '@/components/Popover.vue'
import PopoverMenuItem from '@/components/PopoverMenuItem.vue'
import Divider from '@/components/Divider.vue'

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { title } = storeToRefs(slidesStore)
const { canUndo, canRedo } = storeToRefs(useSnapshotStore())
const { importSpecificFile, importPPTXFile, importJSON, exporting } = useImport()
const { resetSlides } = useSlideHandler()
const { undo, redo } = useHistorySnapshot()
const { enterScreening, enterScreeningFromStart } = useScreening()

const mainMenuVisible = ref(false)
const hotkeyDrawerVisible = ref(false)
const editingTitle = ref(false)
const titleValue = ref('')
const titleInputRef = useTemplateRef<InstanceType<typeof Input>>('titleInputRef')

const startEditTitle = () => {
  titleValue.value = title.value
  editingTitle.value = true
  nextTick(() => titleInputRef.value?.focus())
}

const handleUpdateTitle = () => {
  slidesStore.setTitle(titleValue.value)
  editingTitle.value = false
}

const goLink = (url: string) => {
  window.open(url)
  mainMenuVisible.value = false
}

const setDialogForExport = (type: DialogForExportTypes) => {
  mainStore.setDialogForExport(type)
  mainMenuVisible.value = false
}

const openMarkupPanel = () => {
  mainStore.setMarkupPanelState(true)
}

const openAIPPTDialog = () => {
  mainStore.setAIPPTDialogState(true)
}
</script>

<style lang="scss" scoped>
.editor-header {
  height: 56px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  color: #333;
  font-family: $uiFont;
  z-index: 100;
}

.left, .right, .center {
  display: flex;
  align-items: center;
  height: 100%;
}

.left {
  gap: 8px;
}

.header-item {
  height: 36px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-radius: $borderRadius;
  cursor: pointer;
  transition: background-color $transitionDelayFast;
  font-size: 14px;
  font-weight: 500;
  gap: 6px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .icon {
    font-size: 18px;
  }
}

.header-actions {
  display: flex;
  gap: 4px;
  margin-left: 8px;
  padding-left: 12px;
  border-left: 1px solid rgba(0, 0, 0, 0.1);

  .action-icon {
    font-size: 18px;
    padding: 6px;
    border-radius: $borderRadius;
    cursor: pointer;
    transition: all $transitionDelayFast;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    &.disable {
      opacity: 0.3;
      cursor: default;
      &:hover { background: none; }
    }
  }
}

.save-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  opacity: 0.8;
  margin-left: 8px;
}

.center {
  flex: 1;
  justify-content: center;
}

.title {
  max-width: 400px;
  
  .title-input {
    width: 240px;
    ::v-deep(input) {
      background-color: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #FFFFFF;
      text-align: center;
      &:focus {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }

  .title-text {
    padding: 4px 12px;
    border-radius: $borderRadius;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    background-color: rgba(255, 255, 255, 0.1);

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
}

.right {
  gap: 12px;
}

.contact-btn-modern {
  background-color: #FAF9F6;
  color: #0A2B45;
  padding: 0 20px;
  height: 36px;
  display: flex;
  align-items: center;
  border-radius: $borderRadius;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all $transitionDelayFast;

  &:hover {
    transform: translateY(-1px);
    background-color: #FFFFFF;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
}



.popover-menu-item {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color .2s;

  &:hover {
    background-color: #F8F9FA;
    color: $themeColor;
  }
}

.import-section {
  padding: 10px 16px;
  .import-label {
    font-size: 12px;
    color: $textColorSecondary;
    margin-bottom: 8px;
  }
  .import-grid {
    display: flex;
    gap: 12px;
  }
  .import-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    .icon { font-size: 24px; }
    .label { font-size: 11px; }
  }
}

.ai-menu {
  display: flex;
  padding: 12px 16px;
  gap: 12px;
  cursor: pointer;
  background: linear-gradient(135deg, rgba($themeColor, 0.05), rgba($accentSecondary, 0.05));
  border-radius: $borderRadius;
  margin: 4px;

  &:hover {
    background: linear-gradient(135deg, rgba($themeColor, 0.1), rgba($accentSecondary, 0.1));
  }

  .icon { font-size: 24px; }
  .aippt { font-weight: 800; color: $themeColor; }
  .aippt-subtitle { font-size: 12px; color: $textColorSecondary; }
}

.statement {
  padding: 8px 16px;
  font-size: 11px;
  color: $textColorSecondary;
  font-style: italic;
}
.logo-text {
  font-weight: 900;
  font-size: 20px;
  letter-spacing: 1px;
  color: $themeColor;
}
</style>