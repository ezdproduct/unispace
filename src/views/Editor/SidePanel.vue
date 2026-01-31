<template>
  <div class="side-panel">
    <div class="panel-header" v-if="sidebarState !== 'design'">
      <div class="title">{{ panelTitle }}</div>
      <div class="close-btn" @click="closePanel()"><IconClose /></div>
    </div>

    <div class="panel-body">
      <!-- DESIGN TAB -->
      <!-- TEMPLATES TAB -->
      <div v-if="sidebarState === 'templates'" class="templates-panel">
        <div v-if="!activeTemplate" class="template-list">
          <div 
            v-for="tpl in templateList" 
            :key="tpl.id"
            class="template-item"
            @click="openTemplate(tpl)"
          >
            <img :src="tpl.sampleFront" class="thumbnail" />
          </div>
        </div>
        <div v-else class="template-detail">
          <div class="back-header" @click="activeTemplate = null">
            <IconArrowLeft size="20" /> 
            <span>Quay lại</span>
          </div>
          <div class="detail-content">
            <div class="preview-item">
              <label>Mặt trước</label>
              <div class="img-wrapper" :class="{ 'active-side': isFrontActive }">
                <img :src="activeTemplate.sampleFront" />
                <div class="zoom-overlay" @click="openZoom('front')">
                  <IconPreviewOpen />
                </div>
              </div>
            </div>
            <div class="preview-item" v-if="activeTemplate.sampleBack">
              <label>Mặt sau</label>
              <div class="img-wrapper" :class="{ 'active-side': isBackActive }">
                <img :src="activeTemplate.sampleBack" />
                <div class="zoom-overlay" @click="openZoom('back')">
                  <IconPreviewOpen />
                </div>
              </div>
            </div>
            <div class="action-bar">
               <button class="import-btn" @click="importCurrentTemplate()">Nhập mẫu</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ELEMENTS TAB -->
      <div v-else-if="sidebarState === 'elements'" class="elements-panel">
        <div class="search-box">
          <IconSearch class="icon" />
          <input type="text" placeholder="Tìm kiếm thành phần" />
        </div>

        <div class="section">
          <div class="section-header">Logo</div>
          <div class="logo-pool">
             <div 
               class="logo-item" 
               v-for="(src, index) in logoList" 
               :key="index"
               @click="createImageElement(src)"
             >
               <img :src="src" />
             </div>
          </div>
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

       <!-- AI TAB -->
       <div v-else-if="sidebarState === 'ai'" class="ai-panel">
        <div class="tool-item">
          <div class="pool-item">AI Chat (Coming Soon)</div>
        </div>
      </div>

      <!-- IMAGE TAB (UPLOADS) -->
      <div v-else-if="sidebarState === 'image'" class="uploads-panel">
        <FileInput @change="files => insertImageElement(files)">
          <div class="upload-btn">Tải lên tệp</div>
        </FileInput>
        
        <div class="uploaded-files" v-if="uploadedFiles.length > 0">
           <div 
             class="file-item" 
             v-for="(src, index) in uploadedFiles" 
             :key="index"
             @click="createImageElement(src)"
           >
             <img :src="src" />
           </div>
        </div>

        <div class="empty-upload" v-else>
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
    
    <!-- Template Zoom Modal -->
    <Modal :visible="zoomedImageList.length > 0" @closed="zoomedImageList = []" :width="800">
      <div class="zoomed-preview">
        <div class="nav-btn left" v-if="zoomedIndex > 0" @click="switchZoom(-1)">
          <IconLeft size="24" fill="#fff" />
        </div>
        <img :src="zoomedImageList[zoomedIndex]" />
        <div class="nav-btn right" v-if="zoomedIndex < zoomedImageList.length - 1" @click="switchZoom(1)">
          <IconRight size="24" fill="#fff" />
        </div>
      </div>
    </Modal>

    <!-- Template Change Warning Modal -->
    <Modal :visible="showResetModal" @closed="showResetModal = false" :width="400">
      <div class="warning-modal">
        <div class="warning-title">Cảnh báo thay đổi mẫu</div>
        <div class="warning-content">
          Bạn có chắc chắn muốn chọn mẫu khác? Mọi dữ liệu hiện tại sẽ bị xóa và bắt đầu lại từ đầu.
        </div>
        <div class="warning-footer">
          <button class="btn cancel" @click="showResetModal = false">Hủy</button>
          <button class="btn confirm" @click="confirmChangeTemplate">Đồng ý</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useMainStore, useSlidesStore } from '@/store'
import type { Slide } from '@/types/slides'
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
  ArrowLeft as IconArrowLeft,
  PreviewOpen as IconPreviewOpen,
  Left as IconLeft,
  Right as IconRight,
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
  createTextElement,
} = useCreateElement()

const templateFiles = import.meta.glob('@/assets/templates/*.svg', { eager: true, as: 'url' })
const logoFiles = import.meta.glob('@/assets/elements/*.svg', { eager: true, as: 'url' })

interface TemplateGroup {
  id: string
  sampleFront: string
  sampleBack?: string
  formFront?: string
  formBack?: string
}

const templateList = computed(() => {
  const groups: Record<string, TemplateGroup> = {}
  
  for (const path in templateFiles) {
    const fileName = path.split('/').pop() || ''
    // Decode URI component to handle Vietnamese characters
    const lowerName = decodeURIComponent(fileName).toLowerCase().replace('.svg', '')
    
    // Standardized format: type_id_face.svg (e.g., sample_a1_front.svg)
    // type: sample | form
    // face: front | back
    
    let type = ''
    if (lowerName.includes('sample')) type = 'sample'
    else if (lowerName.includes('form')) type = 'form'
    else continue
    
    let face = ''
    if (lowerName.includes('front')) face = 'front'
    else if (lowerName.includes('back')) face = 'back'
    else continue

    // Extract ID: Remove type, face, and underscores/dashes
    let id = lowerName
      .replace(/sample|form|front|back/g, '')
      .replace(/[_-]/g, ' ') // Replace separators with space to keep ID parts equivalent if needed, or just remove
      .trim()
      
    // Fix ID if it becomes " a1 " -> "a1"
    id = id.replace(/\s+/g, '').trim()
    
    if (!id) continue
    
    if (!groups[id]) {
      groups[id] = { id, sampleFront: '' }
    }
    
    const url = templateFiles[path]
    if (type === 'sample' && face === 'front') groups[id].sampleFront = url
    if (type === 'sample' && face === 'back') groups[id].sampleBack = url
    if (type === 'form' && face === 'front') groups[id].formFront = url
    if (type === 'form' && face === 'back') groups[id].formBack = url
  }
  
  // Fallback: If sampleBack is missing but formBack exists, use formBack for preview
  for (const id in groups) {
    if (!groups[id].sampleBack && groups[id].formBack) {
      groups[id].sampleBack = groups[id].formBack
    }
  }
  
  return Object.values(groups).filter(g => g.sampleFront)
})

const logoList = computed(() => {
  return Object.values(logoFiles)
})

const activeTemplate = ref<TemplateGroup | null>(null)
const uploadedFiles = ref<string[]>([])
const importedTemplateId = ref<string | null>(null)
const showResetModal = ref(false)
const pendingTemplate = ref<TemplateGroup | null>(null)

const openTemplate = (tpl: TemplateGroup) => {
  if (importedTemplateId.value && importedTemplateId.value !== tpl.id) {
    pendingTemplate.value = tpl
    showResetModal.value = true
    return
  }
  activeTemplate.value = tpl
}

const confirmChangeTemplate = () => {
  if (!pendingTemplate.value) return
  
  // Reset slides
  const defaultSlide: Slide = {
    id: nanoid(10),
    elements: [],
    background: {
      type: 'solid',
      color: '#ffffff',
    },
  }
  slidesStore.setSlides([defaultSlide])
  slidesStore.updateSlideIndex(0)
  
  // Update template
  activeTemplate.value = pendingTemplate.value
  importedTemplateId.value = null
  showResetModal.value = false
  pendingTemplate.value = null
}

const importCurrentTemplate = async () => {
  if (!activeTemplate.value) return
  
  // If we already have this template imported, we might want to prevent re-importing or allow it?
  // The user requirement says "only allow importing one template".
  // If it's the SAME template, maybe just return or allow re-importing?
  // Let's assume re-importing the SAME template is allowed or at least doesn't trigger "Reset".
  // But if we want to be strict:
  if (importedTemplateId.value && importedTemplateId.value === activeTemplate.value.id) {
     // Already imported this one. Just return to avoid duplication if that's desired.
     // Or let them import again (stacking duplicates of same template).
     // Based on "start over", maybe we should clear even for the same template?
     // For now, let's just track the ID.
  }
  
  const { formFront, formBack } = activeTemplate.value
  
  // Insert front to current slide
  if (formFront) {
    await createImageElement(formFront, { lock: true }, false)
  }
  
  // If back image exists, create new slide and insert it there
  if (formBack) {
    // Create new slide
    const newSlide: Slide = {
      id: nanoid(10),
      elements: [],
      background: {
        type: 'solid',
        color: slidesStore.theme.backgroundColor,
      },
    }
    
    // Add slide (switches to it automatically)
    slidesStore.addSlide(newSlide)
    
    // Allow state update to settle (though addSlide is sync, safe to wait a tick)
    setTimeout(async () => {
      await createImageElement(formBack, { lock: true }, false)
    }, 100)
  }
  
  importedTemplateId.value = activeTemplate.value.id
}

const isFrontActive = computed(() => {
  if (!activeTemplate.value?.formFront || !slidesStore.currentSlide) return false
  return slidesStore.currentSlide.elements.some(
    el => el.type === 'image' && el.src === activeTemplate.value?.formFront
  )
})

const isBackActive = computed(() => {
  // If fallback logic (sampleBack == formBack) is used, we need to be careful, but here we check formBack primarily.
  // Note: logic in importCurrentTemplate uses activeTemplate.value.formBack.
  if (!activeTemplate.value?.formBack || !slidesStore.currentSlide) return false
  return slidesStore.currentSlide.elements.some(
    el => el.type === 'image' && el.src === activeTemplate.value?.formBack
  )
})

const zoomedImageList = ref<string[]>([])
const zoomedIndex = ref(0)

const openZoom = (face: 'front' | 'back') => {
  if (!activeTemplate.value) return
  const list = [activeTemplate.value.sampleFront]
  if (activeTemplate.value.sampleBack) list.push(activeTemplate.value.sampleBack)
  
  zoomedImageList.value = list
  zoomedIndex.value = face === 'front' ? 0 : (list.length > 1 ? 1 : 0)
}

const switchZoom = (dir: -1 | 1) => {
  const newIndex = zoomedIndex.value + dir
  if (newIndex >= 0 && newIndex < zoomedImageList.value.length) {
    zoomedIndex.value = newIndex
  }
}

const chartPoolActive = ref(false)
const tableGeneratorActive = ref(false)
const latexEditorActive = ref(false)
const mediaInputActive = ref(false)
const showAIPPTDialog = ref(false) // Added for the new tool

const panelTitle = computed(() => {
  const titles: Record<string, string> = {
    templates: 'Mẫu',
    elements: 'Thành phần',
    text: 'Văn bản',
    image: 'Hình ảnh',
    ai: 'AI',
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
    heading: `<p style="font-size: ${size.fontSize}; font-weight: ${size.fontWeight}; text-align: center; color: #000000;">Thêm tiêu đề</p>`,
    subheading: `<p style="font-size: ${size.fontSize}; font-weight: ${size.fontWeight}; text-align: center; color: #000000;">Thêm tiêu đề phụ</p>`,
    body: `<p style="font-size: ${size.fontSize}; text-align: center; color: #000000;">Thêm nội dung văn bản</p>`,
  }

  createTextElement({
    left,
    top,
    width: size.width,
    height: size.height,
  }, { content: contentMap[type], defaultColor: '#000000' })
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
  getImageDataURL(imageFile).then(dataURL => {
    createImageElement(dataURL)
    uploadedFiles.value.unshift(dataURL)
  })
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

  .uploaded-files {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    
    .file-item {
      aspect-ratio: 1;
      background: #f8f9fa;
      border-radius: 4px;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s;
      
      &:hover {
        background: #fff;
        border-color: $themeColor;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      
      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }
  }
}

.templates-panel {
  height: 100%;
  
  .template-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding-bottom: 20px;
  }

  .template-item {
    cursor: pointer;
    border-radius: 8px;
    overflow: hidden;
    background: #f8f9fa;
    border: 2px solid transparent;
    transition: all 0.2s;
    
    &:hover {
      border-color: $themeColor;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .thumbnail {
      width: 100%;
      height: auto;
      display: block;
      object-fit: contain;
    }
  }

  .template-detail {
    display: flex;
    flex-direction: column;
    height: 100%;

    .back-header {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding-bottom: 16px;
      color: #666;
      font-weight: 600;
      border-bottom: 1px solid #eee;
      margin-bottom: 16px;
      
      &:hover { color: #000; }
    }

    .detail-content {
      flex: 1;
      overflow-y: auto;
      display: grid; 
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      align-content: start;
    }

    .preview-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      label {
        font-size: 12px;
        font-weight: 600;
        color: #333;
        text-align: center;
      }
      
      .img-wrapper {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 8px;
        border: 1px solid #eee;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        border: 2px solid transparent; 
        transition: border-color 0.2s;

        &.active-side {
          border-color: #000;
        }
        
        img {
          max-width: 100%;
          max-height: 100%;
          display: block;
          object-fit: contain;
        }

        .zoom-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
          cursor: pointer;
          color: white;
          font-size: 24px;
        }

        &:hover .zoom-overlay {
          opacity: 1;
        }
      }
    }
    
    .action-bar {
      grid-column: 1 / -1; /* Span full width */
      margin-top: auto;
      padding-top: 10px;
    }

    .import-btn {
      width: 100%;
      height: 44px;
      background-color: $themeColor;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.2s;
      
      &:hover {
        background-color: darken($themeColor, 5%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }
}

.zoomed-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  position: relative;
  min-height: 400px;
  
  img {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
  }

  .nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;
    z-index: 10;
    
    &:hover {
      background-color: rgba(0,0,0,0.8);
    }
    
    &.left { left: 10px; }
    &.right { right: 10px; }
  }
}

.warning-modal {
  padding: 24px;
  background: white;
  border-radius: 8px;

  .warning-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 12px;
    color: #333;
  }

  .warning-content {
    font-size: 14px;
    color: #666;
    margin-bottom: 24px;
    line-height: 1.5;
  }

  .warning-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    .btn {
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;

      &.cancel {
        background: #f1f3f4;
        color: #333;
        &:hover { background: #e8eaed; }
      }

      &.confirm {
        background: $themeColor;
        color: white;
        &:hover { filter: brightness(1.1); }
      }
    }
  }
}

.logo-pool {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  
  .logo-item {
    aspect-ratio: 1;
    background: #f8f9fa;
    border-radius: 4px;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.2s;
    
    &:hover {
      background: #fff;
      border-color: $themeColor;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }
}
</style>
