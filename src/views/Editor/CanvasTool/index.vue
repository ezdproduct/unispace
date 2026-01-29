<template>
  <div class="canvas-tool">
    <div class="left-handler">
      <IconBack class="handler-item" :class="{ 'disable': !canUndo }" v-tooltip="$t('canvasTool.undo')" @click="undo()" />
      <IconNext class="handler-item" :class="{ 'disable': !canRedo }" v-tooltip="$t('canvasTool.redo')" @click="redo()" />
      <div class="more">
        <Divider type="vertical" style="height: 20px;" />
        <Popover class="more-icon" trigger="click" v-model:value="moreVisible" :offset="10">
          <template #content>
            <PopoverMenuItem class="popover-menu-item" center @click="toggleNotesPanel(); moreVisible = false"><IconComment class="icon" />{{ $t('canvasTool.notes') }}</PopoverMenuItem>
            <PopoverMenuItem class="popover-menu-item" center @click="toggleSelectPanel(); moreVisible = false"><IconMoveOne class="icon" />{{ $t('canvasTool.select') }}</PopoverMenuItem>
            <PopoverMenuItem class="popover-menu-item" center @click="toggleSraechPanel(); moreVisible = false"><IconSearch class="icon" />{{ $t('canvasTool.search') }}</PopoverMenuItem>
          </template>
          <IconMore class="handler-item" />
        </Popover>
        <IconComment class="handler-item" :class="{ 'active': showNotesPanel }" v-tooltip="$t('canvasTool.notes')" @click="toggleNotesPanel()" />
        <IconMoveOne class="handler-item" :class="{ 'active': showSelectPanel }" v-tooltip="$t('canvasTool.select')" @click="toggleSelectPanel()" />
        <IconSearch class="handler-item" :class="{ 'active': showSearchPanel }" v-tooltip="$t('canvasTool.search')" @click="toggleSraechPanel()" />
      </div>
    </div>

    <div class="add-element-handler">
      <div class="insert-handler-item group-btn" :class="{ 'active': creatingElement?.type === 'text' }" v-tooltip="$t('canvasTool.insertText')">
        <div class="group-btn-main" @click="drawText()"><IconFontSize class="icon" /> <span class="text">{{ $t('canvasTool.text') }}</span></div>
        
        <Popover trigger="click" v-model:value="textTypeSelectVisible" style="height: 100%;" :offset="10">
          <template #content>
            <PopoverMenuItem center @click="() => { drawText(); textTypeSelectVisible = false }"><IconTextRotationNone class="icon" /> {{ $t('canvasTool.horizontalText') }}</PopoverMenuItem>
            <PopoverMenuItem center @click="() => { drawText(true); textTypeSelectVisible = false }"><IconTextRotationDown class="icon" /> {{ $t('canvasTool.verticalText') }}</PopoverMenuItem>
          </template>
          <IconDown class="arrow" />
        </Popover>
      </div>
      <div class="insert-handler-item group-btn" :class="{ 'active': creatingCustomShape || creatingElement?.type === 'shape' }" v-tooltip="$t('canvasTool.insertShape')" :offset="10">
        <Popover trigger="click" style="height: 100%;" v-model:value="shapePoolVisible" :offset="10">
          <template #content>
            <ShapePool @select="shape => drawShape(shape)" />
          </template>
          <div class="group-btn-main"><IconGraphicDesign class="icon" /> <span class="text">{{ $t('canvasTool.shape') }}</span></div>
        </Popover>
        
        <Popover trigger="click" v-model:value="shapeMenuVisible" style="height: 100%;" :offset="10">
          <template #content>
            <PopoverMenuItem center @click="shapeMenuVisible = false; shapePoolVisible = true"><IconGraphicDesign class="icon" />{{ $t('canvasTool.presetShape') }}</PopoverMenuItem>
            <PopoverMenuItem center @click="() => { drawCustomShape(); shapeMenuVisible = false }"><IconWritingFluently class="icon" />{{ $t('canvasTool.customShape') }}</PopoverMenuItem>
          </template>
          <IconDown class="arrow" />
        </Popover>
      </div>
      <div class="insert-handler-item group-btn" v-tooltip="$t('canvasTool.insertImage')">
        <FileInput style="height: 100%;" @change="files => insertImageElement(files)">
          <div class="group-btn-main"><IconPicture class="icon" /> <span class="text">{{ $t('canvasTool.image') }}</span></div>
        </FileInput>
        
        <Popover trigger="click" v-model:value="imageMenuVisible" style="height: 100%;" :offset="10">
          <template #content>
            <FileInput @change="files => { insertImageElement(files); imageMenuVisible = false }">
              <PopoverMenuItem center><IconUpload class="icon" /> {{ $t('canvasTool.uploadImage') }}</PopoverMenuItem>
            </FileInput>
            <PopoverMenuItem center @click="openImageLibPanel(); imageMenuVisible = false"><IconPicture class="icon" /> {{ $t('canvasTool.onlineImage') }}</PopoverMenuItem>
          </template>
          <IconDown class="arrow" />
        </Popover>
      </div>
      <Popover trigger="click" v-model:value="linePoolVisible" :offset="10">
        <template #content>
          <LinePool @select="line => drawLine(line)" />
        </template>
        <div class="insert-handler-item" :class="{ 'active': creatingElement?.type === 'line' }" v-tooltip="$t('canvasTool.insertLine')">
          <IconConnection class="icon" /> <span class="text">{{ $t('canvasTool.line') }}</span>
        </div>
      </Popover>
      <Popover trigger="click" v-model:value="chartPoolVisible" :offset="10">
        <template #content>
          <ChartPool @select="chart => { createChartElement(chart); chartPoolVisible = false }" />
        </template>
        <div class="insert-handler-item" v-tooltip="$t('canvasTool.insertChart')">
          <IconChartProportion class="icon" /> <span class="text">{{ $t('canvasTool.chart') }}</span>
        </div>
      </Popover>
      <Popover trigger="click" v-model:value="tableGeneratorVisible" :offset="10">
        <template #content>
          <TableGenerator
            @close="tableGeneratorVisible = false"
            @insert="({ row, col }) => { createTableElement(row, col); tableGeneratorVisible = false }"
          />
        </template>
        <div class="insert-handler-item" v-tooltip="$t('canvasTool.insertTable')">
          <IconInsertTable class="icon" /> <span class="text">{{ $t('canvasTool.table') }}</span>
        </div>
      </Popover>
      <div class="insert-handler-item" v-tooltip="$t('canvasTool.insertLatex')" @click="latexEditorVisible = true">
        <IconFormula class="icon" /> <span class="text">{{ $t('canvasTool.latex') }}</span>
      </div>
      <Popover trigger="click" v-model:value="mediaInputVisible" :offset="10">
        <template #content>
          <MediaInput 
            @close="mediaInputVisible = false"
            @insertVideo="({ src, ext }) => { createVideoElement(src, ext); mediaInputVisible = false }"
            @insertAudio="({ src, ext }) => { createAudioElement(src, ext); mediaInputVisible = false }"
          />
        </template>
        <div class="insert-handler-item" v-tooltip="$t('canvasTool.insertMedia')">
          <IconVideoTwo class="icon" /> <span class="text">{{ $t('canvasTool.media') }}</span>
        </div>
      </Popover>
      <div class="insert-handler-item" :class="{ 'active': showSymbolPanel }" v-tooltip="$t('canvasTool.insertSymbol')" @click="toggleSymbolPanel()">
        <IconSymbol class="icon" /> <span class="text">{{ $t('canvasTool.symbol') }}</span>
      </div>
    </div>

    <div class="right-handler">
      <IconMinus class="handler-item viewport-size" v-tooltip="$t('canvasTool.canvasZoomOut')" @click="scaleCanvas('-')" />
      <Popover trigger="click" v-model:value="canvasScaleVisible">
        <template #content>
          <PopoverMenuItem
            center
            v-for="item in canvasScalePresetList" 
            :key="item" 
            @click="applyCanvasPresetScale(item)"
          >{{item}}%</PopoverMenuItem>
          <PopoverMenuItem center @click="resetCanvas(); canvasScaleVisible = false">{{ $t('canvasTool.adaptScreen') }}</PopoverMenuItem>
        </template>
        <div style="padding: 10px; width: 200px">
          <Slider 
            :value="canvasScalePercentage" 
            :min="10" 
            :max="500" 
            :step="5" 
            @update:value="value => applyCanvasPresetScale(value as number)" 
          />
        </div>
      </Popover>
      <IconPlus class="handler-item viewport-size" v-tooltip="$t('canvasTool.canvasZoomIn')" @click="scaleCanvas('+')" />
      <IconFullScreen class="handler-item viewport-size-adaptation" v-tooltip="$t('canvasTool.adaptScreen')" @click="resetCanvas()" />
    </div>

    <Modal
      v-model:visible="latexEditorVisible" 
      :width="880"
    >
      <LaTeXEditor 
        @close="latexEditorVisible = false"
        @update="data => { createLatexElement(data); latexEditorVisible = false }"
      />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useMainStore, useSnapshotStore } from '@/store'
import { getImageDataURL } from '@/utils/image'
import type { ShapePoolItem } from '@/configs/shapes'
import type { LinePoolItem } from '@/configs/lines'
import useScaleCanvas from '@/hooks/useScaleCanvas'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useCreateElement from '@/hooks/useCreateElement'

import ShapePool from './ShapePool.vue'
import LinePool from './LinePool.vue'
import ChartPool from './ChartPool.vue'
import TableGenerator from './TableGenerator.vue'
import MediaInput from './MediaInput.vue'
import LaTeXEditor from '@/components/LaTeXEditor/index.vue'
import FileInput from '@/components/FileInput.vue'
import Modal from '@/components/Modal.vue'
import Divider from '@/components/Divider.vue'
import Popover from '@/components/Popover.vue'
import PopoverMenuItem from '@/components/PopoverMenuItem.vue'
import Slider from '@/components/Slider.vue'

const { t } = useI18n()
const mainStore = useMainStore()
const { creatingElement, creatingCustomShape, showSelectPanel, showSearchPanel, showNotesPanel, showSymbolPanel } = storeToRefs(mainStore)
const { canUndo, canRedo } = storeToRefs(useSnapshotStore())

const { redo, undo } = useHistorySnapshot()

const {
  scaleCanvas,
  setCanvasScalePercentage,
  resetCanvas,
  canvasScalePercentage,
} = useScaleCanvas()

const canvasScalePresetList = [200, 150, 125, 100, 75, 50]
const canvasScaleVisible = ref(false)

const applyCanvasPresetScale = (value: number) => {
  setCanvasScalePercentage(value)
  canvasScaleVisible.value = false
}

const {
  createImageElement,
  createChartElement,
  createTableElement,
  createLatexElement,
  createVideoElement,
  createAudioElement,
} = useCreateElement()

const insertImageElement = (files: FileList) => {
  const imageFile = files[0]
  if (!imageFile) return
  getImageDataURL(imageFile).then(dataURL => createImageElement(dataURL))
}

const shapePoolVisible = ref(false)
const linePoolVisible = ref(false)
const chartPoolVisible = ref(false)
const tableGeneratorVisible = ref(false)
const mediaInputVisible = ref(false)
const latexEditorVisible = ref(false)
const textTypeSelectVisible = ref(false)
const shapeMenuVisible = ref(false)
const imageMenuVisible = ref(false)
const moreVisible = ref(false)

// 绘制文字范围
const drawText = (vertical = false) => {
  mainStore.setCreatingElement({
    type: 'text',
    vertical,
  })
}

// 绘制形状范围
const drawShape = (shape: ShapePoolItem) => {
  mainStore.setCreatingElement({
    type: 'shape',
    data: shape,
  })
  shapePoolVisible.value = false
}
// 绘制自定义任意多边形
const drawCustomShape = () => {
  mainStore.setCreatingCustomShapeState(true)
  shapePoolVisible.value = false
}

// 绘制线条路径
const drawLine = (line: LinePoolItem) => {
  mainStore.setCreatingElement({
    type: 'line',
    data: line,
  })
  linePoolVisible.value = false
}

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

// 打开符号面板
const toggleSymbolPanel = () => {
  mainStore.setSymbolPanelState(!showSymbolPanel.value)
}

// 打开图库面板
const openImageLibPanel = () => {
  mainStore.setImageLibPanelState(true)
}
</script>

<style lang="scss" scoped>
.canvas-tool {
  position: relative;
  border-bottom: 1px solid $borderColor;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  font-size: 13px;
  user-select: none;
}
.left-handler, .more {
  display: flex;
  align-items: center;
}
.more-icon {
  display: none;
}
.popover-menu-item {
  display: flex;
  padding: 8px 10px;

  &.center {
    justify-content: center;
  }

  .icon {
    font-size: 18px;
    margin-right: 8px;
  }
}
.add-element-handler {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;

  & > div {
    flex-shrink: 0;
  }

  .insert-handler-item {
    height: 30px;
    font-size: 14px;
    margin: 0 2px;
    padding: 0 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: $borderRadius;
    overflow: hidden;
    cursor: pointer;

    &:not(.group-btn):hover {
      background-color: #f1f1f1;
    }

    &.active {
      background-color: #f1f1f1;
    }

    .icon {
      margin-right: 4px;
    }

    &.group-btn {
      margin-right: 6px;
      padding: 0;

      &:hover {
        background-color: #f3f3f3;
      }

      .group-btn-main {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 5px;

        &:hover {
          background-color: #e9e9e9;
        }
      }

      .arrow {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        padding: 0 1px;
  
        &:hover {
          background-color: #e9e9e9;
        }
      }
    }
  }
}
.handler-item {
  height: 30px;
  font-size: 14px;
  margin: 0 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: $borderRadius;
  overflow: hidden;
  cursor: pointer;

  &.disable {
    opacity: .5;
  }
}
.left-handler, .right-handler {
  .handler-item {
    padding: 0 8px;

    &.active,
    &:not(.disable):hover {
      background-color: #f1f1f1;
    }
  }
}
.right-handler {
  display: flex;
  align-items: center;

  .text {
    display: inline-block;
    width: 40px;
    text-align: center;
    cursor: pointer;
  }

  .viewport-size {
    font-size: 13px;
  }
}

@media screen and (width <= 1600px) {
  .add-element-handler {
    .insert-handler-item {
      .icon {
        margin-right: 0;
      }
      .text {
        display: none;
      }
    }
  }
}
@media screen and (width <= 1366px) {
  .add-element-handler {
    .insert-handler-item {
      padding: 0 6px;
    }
  }
}
@media screen and (width <= 1200px) {
  .right-handler .text {
    display: none;
  }
  .more > .handler-item {
    display: none;
  }
  .more-icon {
    display: block;
  }
}
@media screen and (width <= 1000px) {
  .left-handler, .right-handler {
    display: none;
  }
}
</style>