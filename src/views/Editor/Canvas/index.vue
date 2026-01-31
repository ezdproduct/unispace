<template>
  <div 
    class="canvas" 
    ref="canvasRef"
    @wheel="$event => handleMousewheelCanvas($event)"
    @mousedown="$event => handleClickBlankArea($event)"
    @dblclick="$event => handleDblClick($event)"
    v-contextmenu="computedContextmenus"
    v-click-outside="removeEditorAreaFocus"
  >
    <ElementCreateSelection
      v-if="creatingElement"
      @created="data => insertElementFromCreateSelection(data)"
    />
    <ShapeCreateCanvas
      v-if="creatingCustomShape"
      @created="data => insertCustomShape(data)"
    />
    <div 
      class="viewport-wrapper"
      :style="{
        width: (viewportStyles.width * canvasScale * 2 + 40 * canvasScale) + 'px',
        height: viewportStyles.height * canvasScale + 'px',
        left: (viewportStyles.left - (viewportStyles.width * canvasScale * 0.5 + 20 * canvasScale)) + 'px',
        top: viewportStyles.top + 'px',
        animationName: previewTransition || 'none',
        display: 'flex',
        gap: (40 * canvasScale) + 'px',
      }"
      :class="{ 'slide-transition-preview': !!previewTransition }"
    >
      <!-- SLIDE 1 CONTAINER -->
      <div 
        class="slide-container" 
        :style="{
          position: 'relative', 
          width: (viewportStyles.width * canvasScale) + 'px',
          height: '100%'
        }"
      >
        <!-- Interactive Mode (If Slide Index is 0) -->
        <template v-if="slideIndex === 0">
          <div class="operates">
            <AlignmentLine 
              v-for="(line, index) in alignmentLines" 
              :key="index" 
              :type="line.type" 
              :axis="line.axis" 
              :length="line.length"
              :canvasScale="canvasScale"
            />
            <MultiSelectOperate 
              v-if="activeElementIdList.length > 1"
              :elementList="elementList"
              :scaleMultiElement="scaleMultiElement"
            />
            <Operate
              v-for="element in elementList" 
              :key="element.id"
              :elementInfo="element"
              :isSelected="activeElementIdList.includes(element.id)"
              :isActive="handleElementId === element.id"
              :isActiveGroupElement="activeGroupElementId === element.id"
              :isMultiSelect="activeElementIdList.length > 1"
              :rotateElement="rotateElement"
              :scaleElement="scaleElement"
              :openLinkDialog="openLinkDialog"
              :dragLineElement="dragLineElement"
              :moveShapeKeypoint="moveShapeKeypoint"
              v-show="!hiddenElementIdList.includes(element.id)"
            />
            <ViewportBackground />
          </div>

          <div 
            class="viewport" 
            ref="viewportRef"
            :style="{
              width: viewportStyles.width + 'px',
              height: viewportStyles.height + 'px',
              transform: `scale(${canvasScale})`,
              position: 'absolute',
              top: 0,
              left: 0,
              transformOrigin: '0 0',
            }"
          >
            <MouseSelection 
              v-if="mouseSelectionVisible"
              :top="mouseSelection.top" 
              :left="mouseSelection.left" 
              :width="mouseSelection.width" 
              :height="mouseSelection.height" 
              :quadrant="mouseSelectionQuadrant"
            />      
            <EditableElement 
              v-for="(element, index) in elementList" 
              :key="element.id"
              :elementInfo="element"
              :elementIndex="index + 1"
              :isMultiSelect="activeElementIdList.length > 1"
              :selectElement="selectElement"
              :openLinkDialog="openLinkDialog"
              v-show="!hiddenElementIdList.includes(element.id)"
            />
          </div>
        </template>

        <!-- Static Mode (If Slide Index is NOT 0) -->
        <template v-else>
          <div class="slide-overlay" @mousedown.prevent.stop="slidesStore.updateSlideIndex(0)"></div>
          <div 
            class="viewport" 
            :style="{
              width: viewportStyles.width + 'px',
              height: viewportStyles.height + 'px',
              transform: `scale(${canvasScale})`,
              pointerEvents: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
              transformOrigin: '0 0',
            }"
          >
             <div class="thumbnail-bg" 
               :style="slide1BackgroundStyle"
               style="position: absolute; width: 100%; height: 100%; z-index: -1;"
             ></div>
             <EditableElement 
              v-for="(element, index) in slides[0]?.elements || []" 
              :key="element.id"
              :elementInfo="element"
              :elementIndex="index + 1"
              :isMultiSelect="false"
              :selectElement="() => {}"
              :openLinkDialog="() => {}"
            />
          </div>
        </template>
        <div class="page-number-label">Mặt trước</div>
      </div>

      <!-- SLIDE 2 CONTAINER -->
      <div 
        class="slide-container" 
        :style="{
          position: 'relative', 
          width: (viewportStyles.width * canvasScale) + 'px',
          height: '100%'
        }"
      >
        <!-- Interactive Mode (If Slide Index is 1) -->
        <template v-if="slideIndex === 1">
          <div class="operates">
            <AlignmentLine 
              v-for="(line, index) in alignmentLines" 
              :key="index" 
              :type="line.type" 
              :axis="line.axis" 
              :length="line.length"
              :canvasScale="canvasScale"
            />
            <MultiSelectOperate 
              v-if="activeElementIdList.length > 1"
              :elementList="elementList"
              :scaleMultiElement="scaleMultiElement"
            />
            <Operate
              v-for="element in elementList" 
              :key="element.id"
              :elementInfo="element"
              :isSelected="activeElementIdList.includes(element.id)"
              :isActive="handleElementId === element.id"
              :isActiveGroupElement="activeGroupElementId === element.id"
              :isMultiSelect="activeElementIdList.length > 1"
              :rotateElement="rotateElement"
              :scaleElement="scaleElement"
              :openLinkDialog="openLinkDialog"
              :dragLineElement="dragLineElement"
              :moveShapeKeypoint="moveShapeKeypoint"
              v-show="!hiddenElementIdList.includes(element.id)"
            />
            <ViewportBackground />
          </div>

          <div 
            class="viewport" 
            ref="viewportRef"
            :style="{
              width: viewportStyles.width + 'px',
              height: viewportStyles.height + 'px',
              transform: `scale(${canvasScale})`,
              position: 'absolute',
              top: 0,
              left: 0,
              transformOrigin: '0 0',
            }"
          >
            <!-- No MouseSelection for 2nd slide to avoid complex ref logic for now, or assume it works if activated -->
             <MouseSelection 
              v-if="mouseSelectionVisible"
              :top="mouseSelection.top" 
              :left="mouseSelection.left" 
              :width="mouseSelection.width" 
              :height="mouseSelection.height" 
              :quadrant="mouseSelectionQuadrant"
            /> 
            <EditableElement 
              v-for="(element, index) in elementList" 
              :key="element.id"
              :elementInfo="element"
              :elementIndex="index + 1"
              :isMultiSelect="activeElementIdList.length > 1"
              :selectElement="selectElement"
              :openLinkDialog="openLinkDialog"
              v-show="!hiddenElementIdList.includes(element.id)"
            />
          </div>
        </template>

         <!-- Static Mode (If Slide Index is NOT 1) -->
        <template v-else>
          <div class="slide-overlay" @mousedown.prevent.stop="slidesStore.updateSlideIndex(1)"></div>
          <div 
            class="viewport" 
            :style="{
              width: viewportStyles.width + 'px',
              height: viewportStyles.height + 'px',
              transform: `scale(${canvasScale})`,
              pointerEvents: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
              transformOrigin: '0 0',
            }"
          >
             <div class="thumbnail-bg"
                :style="slide2BackgroundStyle" 
                style="position: absolute; width: 100%; height: 100%; z-index: -1;"
             ></div>
             <EditableElement 
              v-for="(element, index) in slides[1]?.elements || []" 
              :key="element.id"
              :elementInfo="element"
              :elementIndex="index + 1"
              :isMultiSelect="false"
              :selectElement="() => {}"
              :openLinkDialog="() => {}"
            />
          </div>
        </template>
        <div class="page-number-label">Mặt sau</div>
      </div>
    </div>

    <div class="drag-mask" v-if="spaceKeyState"></div>

    <Ruler :viewportStyles="viewportStyles" :elementList="elementList" v-if="showRuler" />

    <Modal
      v-model:visible="linkDialogVisible" 
      :width="540"
    >
      <LinkDialog @close="linkDialogVisible = false" />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, provide, ref, watch, watchEffect, useTemplateRef, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore, useKeyboardStore } from '@/store'
import type { ContextmenuItem } from '@/components/Contextmenu/types'
import type { PPTElement, PPTShapeElement } from '@/types/slides'
import type { AlignmentLineProps, CreateCustomShapeData } from '@/types/edit'
import { injectKeySlideScale } from '@/types/injectKey'
import { removeAllRanges } from '@/utils/selection'
import { KEYS } from '@/configs/hotkey'

import useViewportSize from './hooks/useViewportSize'
import useMouseSelection from './hooks/useMouseSelection'
import useDrop from './hooks/useDrop'
import useRotateElement from './hooks/useRotateElement'
import useScaleElement from './hooks/useScaleElement'
import useSelectAndMoveElement from './hooks/useSelectElement'
import useDragElement from './hooks/useDragElement'
import useDragLineElement from './hooks/useDragLineElement'
import useMoveShapeKeypoint from './hooks/useMoveShapeKeypoint'
import useInsertFromCreateSelection from './hooks/useInsertFromCreateSelection'

import useDeleteElement from '@/hooks/useDeleteElement'
import useCopyAndPasteElement from '@/hooks/useCopyAndPasteElement'
import useSelectElement from '@/hooks/useSelectElement'
import useScaleCanvas from '@/hooks/useScaleCanvas'
import useScreening from '@/hooks/useScreening'
import useSlideHandler from '@/hooks/useSlideHandler'
import useCreateElement from '@/hooks/useCreateElement'

import EditableElement from './EditableElement.vue'
import MouseSelection from './MouseSelection.vue'
import ViewportBackground from './ViewportBackground.vue'
import AlignmentLine from './AlignmentLine.vue'
import Ruler from './Ruler.vue'
import ElementCreateSelection from './ElementCreateSelection.vue'
import ShapeCreateCanvas from './ShapeCreateCanvas.vue'
import MultiSelectOperate from './Operate/MultiSelectOperate.vue'
import Operate from './Operate/index.vue'
import LinkDialog from './LinkDialog.vue'
import Modal from '@/components/Modal.vue'

const mainStore = useMainStore()
const {
  activeElementIdList,
  activeGroupElementId,
  handleElementId,
  hiddenElementIdList,
  editorAreaFocus,
  gridLineSize,
  showRuler,
  creatingElement,
  creatingCustomShape,
  canvasScale,
  textFormatPainter,
  previewTransition,
} = storeToRefs(mainStore)
const slidesStore = useSlidesStore()
const { currentSlide, slides, slideIndex } = storeToRefs(slidesStore)
const { ctrlKeyState, spaceKeyState } = storeToRefs(useKeyboardStore())

const getBackgroundStyle = (background: any) => {
  if (!background) return { backgroundColor: '#fff' }
  const style: any = {}
  if (background.type === 'solid') style.backgroundColor = background.color
  else if (background.type === 'image') {
    style.backgroundImage = `url(${background.image.src})`
    style.backgroundSize = background.image.size
    style.backgroundPosition = 'center'
    style.backgroundRepeat = 'no-repeat'
  }
  else if (background.type === 'gradient') {
    style.backgroundImage = background.gradient.color
  }
  return style
}

const slide1BackgroundStyle = computed(() => getBackgroundStyle(slides.value[0]?.background))
const slide2BackgroundStyle = computed(() => getBackgroundStyle(slides.value[1]?.background))

const viewportRef = useTemplateRef<HTMLElement>('viewportRef')
const alignmentLines = ref<AlignmentLineProps[]>([])

const linkDialogVisible = ref(false)
const openLinkDialog = () => linkDialogVisible.value = true

watch(handleElementId, () => {
  mainStore.setActiveGroupElementId('')
})

const elementList = ref<PPTElement[]>([])
const setLocalElementList = () => {
  elementList.value = currentSlide.value ? JSON.parse(JSON.stringify(currentSlide.value.elements)) : []
}
watchEffect(setLocalElementList)

const canvasRef = useTemplateRef<HTMLElement>('canvasRef')
const { dragViewport, viewportStyles } = useViewportSize(canvasRef)

useDrop(canvasRef)

const { mouseSelection, mouseSelectionVisible, mouseSelectionQuadrant, updateMouseSelection } = useMouseSelection(elementList, viewportRef)

const { dragElement } = useDragElement(elementList, alignmentLines, canvasScale)
const { dragLineElement } = useDragLineElement(elementList)
const { selectElement } = useSelectAndMoveElement(elementList, dragElement)
const { scaleElement, scaleMultiElement } = useScaleElement(elementList, alignmentLines, canvasScale)
const { rotateElement } = useRotateElement(elementList, viewportRef, canvasScale)
const { moveShapeKeypoint } = useMoveShapeKeypoint(elementList, canvasScale)

const { selectAllElements } = useSelectElement()
const { deleteAllElements } = useDeleteElement()
const { pasteElement } = useCopyAndPasteElement()
const { enterScreeningFromStart } = useScreening()
const { updateSlideIndex } = useSlideHandler()
const { createTextElement, createShapeElement } = useCreateElement()

// 组件渲染时，如果存在元素焦点，需要清除
// 这种情况存在于：有焦点元素的情况下进入了放映模式，再退出时，需要清除原先的焦点（因为可能已经切换了页面）
onMounted(() => {
  if (activeElementIdList.value.length) {
    nextTick(() => mainStore.setActiveElementIdList([]))
  }
})

// 点击画布的空白区域：清空焦点元素、设置画布焦点、清除文字选区、清空格式刷状态
const handleClickBlankArea = (e: MouseEvent) => {
  if (activeElementIdList.value.length) mainStore.setActiveElementIdList([])

  if (!spaceKeyState.value) updateMouseSelection(e)
  else dragViewport(e)

  if (!editorAreaFocus.value) mainStore.setEditorareaFocus(true)
  if (textFormatPainter.value) mainStore.setTextFormatPainter(null)
  removeAllRanges()
}

// 双击空白处插入文本
const handleDblClick = (e: MouseEvent) => {
  if (activeElementIdList.value.length || creatingElement.value || creatingCustomShape.value) return
  if (!viewportRef.value) return

  const viewportRect = viewportRef.value.getBoundingClientRect()
  const left = (e.pageX - viewportRect.x) / canvasScale.value
  const top = (e.pageY - viewportRect.y) / canvasScale.value

  createTextElement({
    left,
    top,
    width: 200 / canvasScale.value, // 除以 canvasScale 是为了与点击选区创建的形式保持相同的宽度
    height: 0,
  })
}

// 画布注销时清空格式刷状态
onUnmounted(() => {
  if (textFormatPainter.value) mainStore.setTextFormatPainter(null)
})

// 移除画布编辑区域焦点
const removeEditorAreaFocus = () => {
  if (editorAreaFocus.value) mainStore.setEditorareaFocus(false)
}

// 滚动鼠标
const { scaleCanvas } = useScaleCanvas()
const throttleScaleCanvas = throttle(scaleCanvas, 100, { leading: true, trailing: false })
const throttleUpdateSlideIndex = throttle(updateSlideIndex, 300, { leading: true, trailing: false })

const handleMousewheelCanvas = (e: WheelEvent) => {
  e.preventDefault()

  // 按住Ctrl键时：缩放画布
  if (ctrlKeyState.value) {
    if (e.deltaY > 0) throttleScaleCanvas('-')
    else if (e.deltaY < 0) throttleScaleCanvas('+')
  }
  // 上下翻页
  else {
    if (e.deltaY > 0) throttleUpdateSlideIndex(KEYS.DOWN)
    else if (e.deltaY < 0) throttleUpdateSlideIndex(KEYS.UP)
  }
}

// 开关标尺
const toggleRuler = () => {
  mainStore.setRulerState(!showRuler.value)
}

// 在鼠标绘制的范围插入元素
const { insertElementFromCreateSelection, formatCreateSelection } = useInsertFromCreateSelection(viewportRef)

// 插入自定义任意多边形
const insertCustomShape = (data: CreateCustomShapeData) => {
  const {
    start,
    end,
    path,
    viewBox,
  } = data
  const position = formatCreateSelection({ start, end })
  if (position) {
    const supplement: Partial<PPTShapeElement> = {}
    if (data.fill) supplement.fill = data.fill
    if (data.outline) supplement.outline = data.outline
    createShapeElement(position, { path, viewBox }, supplement)
  }

  mainStore.setCreatingCustomShapeState(false)
}

const { t } = useI18n()

const computedContextmenus = (): ContextmenuItem[] => {
  return [
    {
      text: t('canvas.paste'),
      subText: 'Ctrl + V',
      handler: pasteElement,
    },
    {
      text: t('canvas.selectAll'),
      subText: 'Ctrl + A',
      handler: selectAllElements,
    },
    {
      text: t('canvas.ruler'),
      subText: showRuler.value ? '√' : '',
      handler: toggleRuler,
    },
    {
      text: t('canvas.gridLines'),
      handler: () => mainStore.setGridLineSize(gridLineSize.value ? 0 : 50),
      children: [
        {
          text: t('canvas.gridLinesNone'),
          subText: gridLineSize.value === 0 ? '√' : '',
          handler: () => mainStore.setGridLineSize(0),
        },
        {
          text: t('canvas.gridLinesSmall'),
          subText: gridLineSize.value === 25 ? '√' : '',
          handler: () => mainStore.setGridLineSize(25),
        },
        {
          text: t('canvas.gridLinesMedium'),
          subText: gridLineSize.value === 50 ? '√' : '',
          handler: () => mainStore.setGridLineSize(50),
        },
        {
          text: t('canvas.gridLinesLarge'),
          subText: gridLineSize.value === 100 ? '√' : '',
          handler: () => mainStore.setGridLineSize(100),
        },
      ],
    },
    {
      text: t('canvas.resetSlide'),
      handler: deleteAllElements,
    },
    { divider: true },
    {
      text: t('canvas.showScreening'),
      subText: 'F5',
      handler: enterScreeningFromStart,
    },
  ]
}

provide(injectKeySlideScale, canvasScale)
</script>

<style lang="scss" scoped>
.canvas {
  height: 100%;
  user-select: none;
  overflow: hidden;
  background-color: $lightGray;
  position: relative;
}
.drag-mask {
  cursor: grab;
  @include absolute-0();
}
.viewport-wrapper {
  position: absolute;
  box-shadow: 0 40px 100px rgba(0, 212, 255, 0.1), 0 0 0 1px $borderColor; // Electric cyan tinted shadow
}
.viewport {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
}
.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 0 2px $themeColor;
  }
}
.page-number-label {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: #666;
  font-weight: 700;
}
.thumbnail-bg {
  background-color: #fff;
}
</style>