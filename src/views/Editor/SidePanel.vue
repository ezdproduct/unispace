<template>
  <div class="side-panel">
    <div class="panel-header" v-if="sidebarState !== 'design'">
      <div class="title">{{ panelTitle }}</div>
      <div class="close-btn" @click="closePanel()"><IconClose /></div>
    </div>

    <div class="panel-body">
      <!-- DESIGN TAB -->
      <div v-if="sidebarState === 'design'" class="design-panel">
        <BackgroundPool />
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


      </div>

      <!-- TEXT TAB -->
      <div v-else-if="sidebarState === 'text'" class="text-panel">
        <div class="text-presets">
          <div class="preset-item heading" @click="drawText('heading')">Thêm tiêu đề</div>
          <div class="preset-item subheading" @click="drawText('subheading')">Thêm tiêu đề phụ</div>
          <div class="preset-item body" @click="drawText('body')">Thêm nội dung văn bản</div>
        </div>

        <div class="colored-presets">
          <div 
            class="colored-item" 
            v-for="(item, index) in coloredTemplates" 
            :key="index"
            :style="item.style"
            @click="createColoredText(item)"
          >
            {{ item.label }}
          </div>
        </div>

        <Divider />
        <TextStylePanel />
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
import { useMainStore, useSlidesStore } from '@/store'
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
import BackgroundPool from './CanvasTool/BackgroundPool.vue'
import Toolbar from './Toolbar/index.vue'
import Modal from '@/components/Modal.vue'
import FileInput from '@/components/FileInput.vue'
import Divider from '@/components/Divider.vue'
import TextStylePanel from './Toolbar/ElementStylePanel/TextStylePanel.vue'

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

const slidesStore = useSlidesStore()
const { viewportRatio, viewportSize } = storeToRefs(slidesStore)

const drawText = (type: 'heading' | 'subheading' | 'body') => {
  const defaultSize = {
    heading: { width: 600, height: 80, fontSize: '60px', fontWeight: 700 },
    subheading: { width: 500, height: 60, fontSize: '36px', fontWeight: 600 },
    body: { width: 400, height: 100, fontSize: '24px', fontWeight: 400 },
  }
  const size = defaultSize[type]
  const left = (viewportSize.value - size.width) / 2
  const top = (viewportSize.value * viewportRatio.value - size.height) / 2
  
  const contentMap = {
    heading: `<p style="font-size: ${size.fontSize}; font-weight: ${size.fontWeight}; text-align: center;">Thêm tiêu đề</p>`,
    subheading: `<p style="font-size: ${size.fontSize}; font-weight: ${size.fontWeight}; text-align: center;">Thêm tiêu đề phụ</p>`,
    body: `<p style="font-size: ${size.fontSize}; text-align: center;">Thêm nội dung văn bản</p>`,
  }

  createTextElement({
    left,
    top,
    width: size.width,
    height: size.height,
  }, { content: contentMap[type] })
}

const coloredTemplates = [
  { 
    label: 'Glow', 
    style: { color: '#fff', textShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff', backgroundColor: '#000' }, 
    content: '<p style="font-size: 60px; font-weight: 800; color: #fff; text-shadow: 0 0 10px #00d4ff, 0 0 20px #00d4ff; text-align: center;">NEON</p>' 
  },
  { 
    label: 'Gradient', 
    style: { background: 'linear-gradient(45deg, #FF3D77, #8B2DED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }, 
    content: '<p style="font-size: 60px; font-weight: 800; background: linear-gradient(45deg, #FF3D77, #8B2DED); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-align: center;">GRADIENT</p>' 
  },
  { 
    label: 'Retro', 
    style: { color: '#FFD700', textShadow: '3px 3px 0px #BF360C', fontWeight: 800 }, 
    content: '<p style="font-size: 60px; font-weight: 800; color: #FFD700; text-shadow: 3px 3px 0px #BF360C; text-align: center;">RETRO</p>' 
  },
  { 
    label: 'Cyber', 
    style: { color: '#00ff41', border: '2px solid #00ff41', padding: '5px', backgroundColor: '#000', fontWeight: 'bold' }, 
    content: '<p style="font-size: 50px; font-weight: 700; color: #00ff41; text-align: center;">CYBER</p>' 
  },
]

const createColoredText = (template: typeof coloredTemplates[0]) => {
  const width = 500
  const height = 120
  const left = (viewportSize.value - width) / 2
  const top = (viewportSize.value * viewportRatio.value - height) / 2

  createTextElement({
    left,
    top,
    width,
    height,
  }, { content: template.content })
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

  /* REMOVED .text-presets styles and replaced with new styles below */
  .text-presets {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .preset-item {
    padding: 12px;
    border-radius: 8px;
    background-color: #f8f9fa;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 700;
    text-align: center;
    border: 1px solid transparent;

    &:hover { 
      background-color: #fff; 
      border-color: $themeColor;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      transform: translateY(-1px); 
    }
    
    &.heading { font-size: 20px; font-weight: 800; }
    &.subheading { font-size: 16px; font-weight: 700; opacity: 0.9; }
    &.body { font-size: 14px; font-weight: 400; opacity: 0.8; }
  }

  .colored-presets {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 10px;
  }

  .colored-item {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f8f9fa;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 16px;
    font-weight: 800;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
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
