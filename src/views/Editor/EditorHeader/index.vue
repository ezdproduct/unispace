<template>
  <div class="editor-header">
    <div class="left">
      <Popover trigger="click" placement="bottom-start" v-model:value="mainMenuVisible">
        <template #content>
          <div class="main-menu">
            <div class="ai-menu" @click="openAIPPTDialog(); mainMenuVisible = false">
              <div class="icon"><IconClick theme="two-tone" :fill="['#ffc158', '#fff']" /></div>
              <div class="aippt-content">
                <div class="aippt"><span>AIPPT</span></div>
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
                <span class="sub-label">（{{ $t('header.forTestOnly') }}）</span>
              </FileInput>
              <FileInput class="import-block" accept=".json" @change="files => {
                importJSON(files)
                mainMenuVisible = false
              }">
                <span class="icon"><IconFileJpg theme="multi-color" :fill="['#333', '#d14424', '#fff']" /></span>
                <span class="label">JSON</span>
                <span class="sub-label">（{{ $t('header.forTestOnly') }}）</span>
              </FileInput>
              <FileInput class="import-block" accept=".pptist" @change="files => {
                importSpecificFile(files)
                mainMenuVisible = false
              }">
                <span class="icon"><IconNotes theme="multi-color" :fill="['#333', '#d14424', '#fff']" /></span>
                <span class="label">PPTIST</span>
                <span class="sub-label">（{{ $t('header.proprietaryFormat') }}）</span>
              </FileInput>
            </div>
          </div>
          <Divider :margin="10" />
          <PopoverMenuItem class="popover-menu-item" @click="setDialogForExport('pptx')"><IconDownload class="icon" /> {{ $t('header.exportFile') }}</PopoverMenuItem>
          <Divider :margin="10" />
          <PopoverMenuItem class="popover-menu-item" @click="resetSlides(); mainMenuVisible = false"><IconRefresh class="icon" /> {{ $t('header.resetSlides') }}</PopoverMenuItem>
          <PopoverMenuItem class="popover-menu-item" @click="openMarkupPanel(); mainMenuVisible = false"><IconMark class="icon" /> {{ $t('header.slideLabel') }}</PopoverMenuItem>
          <PopoverMenuItem class="popover-menu-item" @click="mainMenuVisible = false; hotkeyDrawerVisible = true"><IconCommand class="icon" /> {{ $t('header.hotkeys') }}</PopoverMenuItem>

          <Divider :margin="10" />
          <div class="statement">{{ $t('header.statement') }}</div>
        </template>
        <div class="menu-item"><IconHamburgerButton class="icon" /></div>
      </Popover>



      <div class="title">
        <Input 
          class="title-input" 
          ref="titleInputRef"
          v-model:value="titleValue" 
          @blur="handleUpdateTitle()" 
          v-if="editingTitle" 
        ></Input>
        <div 
          class="title-text"
          @click="startEditTitle()"
          :title="title"
          v-else
        >{{ title || $t('header.untitledSubject') }}</div>
      </div>
    </div>

    <div class="right">
      <div class="save-indicator">
        <IconCloud /> <span>Đã lưu</span>
      </div>
      
      <div class="menu-item share-btn">
        <IconShare /> <span>Share</span>
      </div>

      <div class="present-group">
        <div class="present-btn" @click="enterScreening()">
          <IconPlay class="icon" /> <span>Present</span>
        </div>
        <Popover trigger="click" center>
          <template #content>
            <PopoverMenuItem class="popover-menu-item" @click="enterScreeningFromStart()"><IconSlideTwo class="icon" /> {{ $t('header.startFromStart') }}</PopoverMenuItem>
            <PopoverMenuItem class="popover-menu-item" @click="enterScreening()"><IconPpt class="icon" /> {{ $t('header.startFromCurrent') }}</PopoverMenuItem>
          </template>
          <div class="arrow-btn"><IconDown class="arrow" /></div>
        </Popover>
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
  background-color: $headerBg;
  user-select: none;
  border-bottom: 1px solid $borderColor;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  color: $textColor;
  font-family: $uiFont;
}
.left, .right {
  display: flex;
  align-items: center;
}

.left {
  gap: 24px;
}

.menu-item {
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding: 0 8px;
  border-radius: $borderRadius;
  cursor: pointer;
  transition: all $transitionDelay;
  color: $textColor;

  &.icon-only {
    width: 32px;
    padding: 0;
  }

  &.disable {
    opacity: .3;
    cursor: default;
  }

  .icon {
    font-size: 20px;
  }

  &:not(.disable):hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.title {
  height: 36px;
  font-size: 16px;
  font-weight: 600;

  .title-input {
    width: 240px;
    height: 100%;
    
    ::v-deep(input) {
      background-color: rgba(0, 0, 0, 0.03);
      border: 1px solid $borderColor;
      color: $textColor;
      font-family: $uiFont;
    }
  }
  .title-text {
    min-width: 20px;
    max-width: 400px;
    line-height: 36px;
    padding: 0 12px;
    border-radius: $borderRadius;
    cursor: pointer;
    font-family: $uiFont;

    @include ellipsis-oneline();

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
}

.right {
  gap: 12px;
}

.save-indicator {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: $textColorSecondary;
  gap: 6px;
  margin-right: 8px;
}

.share-btn {
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: transparent;
  padding: 0 16px;
  font-weight: 500;
  border-radius: $borderRadius;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    border-color: $themeColor;
  }

  span {
    margin-left: 8px;
  }
}

.present-group {
  display: flex;
  align-items: center;
  background-color: $themeColor;
  border-radius: $borderRadiusPill;
  transition: all $transitionDelay;
  overflow: hidden;

  &:hover {
    filter: brightness(0.95);
    box-shadow: 0 4px 12px rgba(116, 141, 174, 0.2);
  }

  .present-btn {
    height: 36px;
    display: flex;
    align-items: center;
    padding: 0 18px 0 20px;
    cursor: pointer;
    font-weight: 700;
    color: #fff;

    .icon {
      font-size: 18px;
      margin-right: 8px;
    }
  }

  .arrow-btn {
    height: 36px;
    width: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: 1px solid rgba(255, 255, 255, 0.3);
    cursor: pointer;
    color: #fff;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .arrow {
      font-size: 10px;
    }
  }
}
</style>