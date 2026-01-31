<template>
  <div class="side-panel">
    <div class="panel-header" v-if="sidebarState !== 'design'">
      <div class="title">{{ panelTitle }}</div>
      <div class="close-btn" @click="closePanel()"><IconClose /></div>
    </div>

    <div class="panel-body">
      <!-- DESIGN TAB -->
      <div v-if="sidebarState === 'design'" class="design-panel">
        <Thumbnails />
      </div>

      <!-- ELEMENTS TAB -->
      <div v-else-if="sidebarState === 'elements'" class="elements-panel">
        <div class="search-box">
          <IconSearch class="icon" />
          <input type="text" placeholder="Tìm kiếm thành phần" />
        </div>

        <div class="section">
          <div class="section-header">Hình dạng</div>
          <ShapePool @select="shape => drawShape(shape)" />
        </div>

        <div class="section">
          <div class="section-header">Đường kẻ</div>
          <LinePool @select="line => drawLine(line)" />
        </div>

        <div class="section">
          <div class="section-header">Đa phương tiện & Công cụ</div>
          <div class="grid">
            <div class="grid-item" @click="chartPoolActive = true">
              <IconChartProportion class="icon" />
              <span>Biểu đồ</span>
            </div>
            <div class="grid-item" @click="tableGeneratorActive = true">
              <IconInsertTable class="icon" />
              <span>Bảng</span>
            </div>
            <div class="grid-item" @click="latexEditorActive = true">
              <IconFormula class="icon" />
              <span>Toán học</span>
            </div>
            <div class="grid-item" @click="mediaInputActive = true">
              <IconVideoTwo class="icon" />
              <span>Video</span>
            </div>
            <div class="grid-item" @click="toggleSymbolPanel()">
              <IconSymbol class="icon" />
              <span>Ký hiệu</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TEXT TAB -->
      <div v-else-if="sidebarState === 'text'" class="text-panel">
        <div class="text-presets">
          <div class="preset-item heading" @click="drawText('heading')">Thêm tiêu đề</div>
          <div class="preset-item subheading" @click="drawText('subheading')">Thêm tiêu đề phụ</div>
          <div class="preset-item body" @click="drawText('body')">Thêm nội dung văn bản</div>
        </div>
      </div>

      <!-- UPLOADS TAB -->
      <div v-else-if="sidebarState === 'uploads'" class="uploads-panel">
        <FileInput @change="files => insertImageElement(files)">
          <div class="upload-btn">Tải lên tệp</div>
        </FileInput>
        
        <div class="empty-upload">
          <IconPicture class="icon" />
          <p>Tải ảnh hoặc video của bạn lên đây</p>
        </div>
      </div>

      <!-- CUSTOM/TOOLBAR TAB -->
      <div v-else-if="sidebarState === 'custom'" class="custom-panel">
        <Toolbar />
      </div>

      <div v-else class="placeholder">
        {{ sidebarState }} coming soon
      </div>
    </div>

    <!-- Modals/Popovers for specific tools -->
    <Modal :visible="chartPoolActive" @closed="chartPoolActive = false" :width="400">
      <ChartPool @select="chart => { createChartElement(chart); chartPoolActive = false }" />
    </Modal>
    <Modal :visible="tableGeneratorActive" @closed="tableGeneratorActive = false" :width="330">
      <TableGenerator @insert="({ row, col }) => { createTableElement(row, col); tableGeneratorActive = false }" @close="tableGeneratorActive = false" />
    </Modal>
    <Modal :visible="latexEditorActive" @closed="latexEditorActive = false" :width="880">
      <LaTeXEditor @update="data => { createLatexElement(data); latexEditorActive = false }" @close="latexEditorActive = false" />
    </Modal>
    <Modal :visible="mediaInputActive" @closed="mediaInputActive = false" :width="400">
      <MediaInput 
        @close="mediaInputActive = false"
        @insertVideo="({ src, ext }) => { createVideoElement(src, ext); mediaInputActive = false }"
        @insertAudio="({ src, ext }) => { createAudioElement(src, ext); mediaInputActive = false }"
      />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import useCreateElement from '@/hooks/useCreateElement'
import { getImageDataURL } from '@/utils/image'
import type { ShapePoolItem } from '@/configs/shapes'
import type { LinePoolItem } from '@/configs/lines'
import {
  Close as IconClose,
  Search as IconSearch,
  ChartProportion as IconChartProportion,
  InsertTable as IconInsertTable,
  Formula as IconFormula,
  VideoTwo as IconVideoTwo,
  MusicOne as IconMusicOne,
  Symbol as IconSymbol,
  Picture as IconPicture,
} from '@icon-park/vue-next'

import ShapePool from './CanvasTool/ShapePool.vue'
import LinePool from './CanvasTool/LinePool.vue'
import ChartPool from './CanvasTool/ChartPool.vue'
import TableGenerator from './CanvasTool/TableGenerator.vue'
import MediaInput from './CanvasTool/MediaInput.vue'
import LaTeXEditor from '@/components/LaTeXEditor/index.vue'
import Thumbnails from './Thumbnails/index.vue'
import Toolbar from './Toolbar/index.vue'
import Modal from '@/components/Modal.vue'
import FileInput from '@/components/FileInput.vue'

const mainStore = useMainStore()
const { sidebarState } = storeToRefs(mainStore)

const {
  createImageElement,
  createChartElement,
  createTableElement,
  createLatexElement,
  createVideoElement,
  createAudioElement,
} = useCreateElement()

const chartPoolActive = ref(false)
const tableGeneratorActive = ref(false)
const latexEditorActive = ref(false)
const mediaInputActive = ref(false)

const panelTitle = computed(() => {
  const titles: Record<string, string> = {
    design: 'Thiết kế',
    elements: 'Thành phần',
    text: 'Văn bản',
    uploads: 'Tải lên',
    custom: 'Tùy chỉnh',
  }
  return titles[sidebarState.value] || ''
})

const closePanel = () => mainStore.setSidebarState('')

const drawText = (level: string) => {
  mainStore.setCreatingElement({
    type: 'text',
    vertical: false,
  })
}

const drawShape = (shape: ShapePoolItem) => {
  mainStore.setCreatingElement({
    type: 'shape',
    data: shape,
  })
}

const drawLine = (line: LinePoolItem) => {
  mainStore.setCreatingElement({
    type: 'line',
    data: line,
  })
}

const insertImageElement = (files: FileList) => {
  const imageFile = files[0]
  if (!imageFile) return
  getImageDataURL(imageFile).then(dataURL => createImageElement(dataURL))
}

const toggleSymbolPanel = () => mainStore.setSymbolPanelState(!mainStore.showSymbolPanel)
</script>

<style lang="scss" scoped>
.side-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #FAF9F6;
}

.panel-header {
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #eee;

  .title {
    font-weight: 700;
    font-size: 16px;
  }

  .close-btn {
    cursor: pointer;
    font-size: 20px;
    color: #666;
    &:hover { color: #000; }
  }
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.search-box {
  background-color: #f1f3f4;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 24px;
  
  .icon { color: #5f6368; margin-right: 8px; }
  input {
    border: none;
    background: transparent;
    outline: none;
    flex: 1;
    font-size: 14px;
  }
}

.section {
  margin-bottom: 24px;
  .section-header {
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 12px;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  background-color: #f8f9fa;
  transition: background-color 0.2s;

  &:hover { background-color: #f1f3f4; }
  .icon { font-size: 24px; color: #5f6368; }
  span { font-size: 11px; }
}

.text-presets {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preset-item {
  padding: 16px;
  border-radius: 8px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 700;

  &:hover { background-color: #e8eaed; transform: scale(1.02); }
  &.heading { font-size: 24px; }
  &.subheading { font-size: 18px; }
  &.body { font-size: 14px; font-weight: 400; }
}

.uploads-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  .upload-btn {
    width: 100%;
    height: 40px;
    background-color: $themeColor;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    &:hover { filter: brightness(1.1); }
  }

  .empty-upload {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #999;
    padding-top: 60px;
    .icon { font-size: 48px; margin-bottom: 12px; }
    p { font-size: 12px; text-align: center; }
  }
}
</style>
