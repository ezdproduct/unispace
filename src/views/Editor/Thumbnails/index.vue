<template>
  <div 
    class="thumbnails"
    :class="{ 'horizontal': !vertical }"
    @mousedown="() => setThumbnailsFocus(true)"
    v-click-outside="() => setThumbnailsFocus(false)"
    v-contextmenu="contextmenusThumbnails"
  >
    <Draggable 
      class="thumbnail-list"
      ref="thumbnailsRef"
      :modelValue="slides"
      :animation="200"
      :scroll="true"
      :scrollSensitivity="50"
      :disabled="editingSectionId"
      @end="handleDragEnd"
      itemKey="id"
    >
      <template #item="{ element, index }">
        <div class="thumbnail-container">

          <div
            class="thumbnail-item"
            :class="{
              'active': slideIndex === index,
              'selected': selectedSlidesIndex.includes(index),
            }"
            @mousedown="$event => handleClickSlideThumbnail($event, index)"
            @dblclick="enterScreening()"
            v-contextmenu="contextmenusThumbnailItem"
          >
            <div class="label" v-if="vertical" :class="{ 'offset-left': index >= 99 }">{{ fillDigit(index + 1, 2) }}</div>
            <ThumbnailSlide class="thumbnail" :slide="element" :size="120" :visible="index < slidesLoadLimit" />
            <div class="transition-flag" v-if="element.turningMode && element.turningMode !== 'no'"><IconEffects /></div>
  
            <div class="note-flag" v-if="element.notes && element.notes.length" @click="openNotesPanel()">{{ element.notes.length }}</div>
          </div>

          <div class="transition-name" v-if="index < slides.length - 1 && slides[index + 1].turningMode && slides[index + 1].turningMode !== 'no'">
            <IconEffects class="icon" /> {{ getTransitionLabel(slides[index + 1].turningMode!) }}
          </div>
        </div>
      </template>
    </Draggable>

    <div class="add-slide-fixed" v-if="vertical" @click="createSlide()">
      <IconPlus class="icon" /> {{ $t('thumbnails.addSlide') }}
    </div>


  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch, useTemplateRef } from 'vue'

interface Props {
  vertical?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  vertical: true,
})
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore, useKeyboardStore } from '@/store'
import type { Slide, SlideTheme } from '@/types/slides'
import { SLIDE_ANIMATIONS } from '@/configs/animation'
import { fillDigit } from '@/utils/common'
import { isElementInViewport } from '@/utils/element'
import type { ContextmenuItem } from '@/components/Contextmenu/types'
import useSlideHandler from '@/hooks/useSlideHandler'
import useSectionHandler from '@/hooks/useSectionHandler'
import useScreening from '@/hooks/useScreening'
import useLoadSlides from '@/hooks/useLoadSlides'
import useAddSlidesOrElements from '@/hooks/useAddSlidesOrElements'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'
import Templates from './Templates.vue'
import Popover from '@/components/Popover.vue'
import Draggable from 'vuedraggable'

const { t } = useI18n()
const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const keyboardStore = useKeyboardStore()
const { selectedSlidesIndex: _selectedSlidesIndex, thumbnailsFocus } = storeToRefs(mainStore)
const { slides, slideIndex, currentSlide } = storeToRefs(slidesStore)
const { ctrlKeyState, shiftKeyState } = storeToRefs(keyboardStore)

const { slidesLoadLimit } = useLoadSlides()

const selectedSlidesIndex = computed(() => [..._selectedSlidesIndex.value, slideIndex.value])

const presetLayoutPopoverVisible = ref(false)

const hasSection = computed(() => {
  return slides.value.some(item => item.sectionTag)
})

const { addSlidesFromData } = useAddSlidesOrElements()

const {
  copySlide,
  pasteSlide,
  createSlide,
  createSlideByTemplate,
  copyAndPasteSlide,
  deleteSlide,
  cutSlide,
  selectAllSlide,
  sortSlides,
  isEmptySlide,
} = useSlideHandler()

const {
  createSection,
  removeSection,
  removeAllSection,
  removeSectionSlides,
  updateSectionTitle,
} = useSectionHandler()

const getTransitionLabel = (mode: string) => {
  const transition = SLIDE_ANIMATIONS.find(item => item.value === mode)
  return transition ? transition.label : ''
}

// 页面被切换时
const thumbnailsRef = useTemplateRef<InstanceType<typeof Draggable>>('thumbnailsRef')
watch(() => slideIndex.value, () => {

  // 清除多选状态的幻灯片
  if (selectedSlidesIndex.value.length) {
    mainStore.updateSelectedSlidesIndex([])
  }

  // 检查当前页缩略图是否在可视范围，不在的话需要滚动到对应的位置
  nextTick(() => {
    const activeThumbnailRef: HTMLElement = thumbnailsRef.value?.$el?.querySelector('.thumbnail-item.active')
    if (thumbnailsRef.value && activeThumbnailRef && !isElementInViewport(activeThumbnailRef, thumbnailsRef.value.$el)) {
      setTimeout(() => {
        activeThumbnailRef.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  })
}, { immediate: true })

// 切换页面
const changeSlideIndex = (index: number) => {
  mainStore.setActiveElementIdList([])

  if (slideIndex.value === index) return
  slidesStore.updateSlideIndex(index)
}

// 点击缩略图
const handleClickSlideThumbnail = (e: MouseEvent, index: number) => {
  if (editingSectionId.value) return

  const isMultiSelected = selectedSlidesIndex.value.length > 1

  if (isMultiSelected && selectedSlidesIndex.value.includes(index) && e.button !== 0) return

  // 按住Ctrl键，点选幻灯片，再次点击已选中的页面则取消选中
  // 如果被取消选中的页面刚好是当前激活页面，则需要从其他被选中的页面中选择第一个作为当前激活页面
  if (ctrlKeyState.value) {
    if (slideIndex.value === index) {
      if (!isMultiSelected) return

      const newSelectedSlidesIndex = selectedSlidesIndex.value.filter(item => item !== index)
      mainStore.updateSelectedSlidesIndex(newSelectedSlidesIndex)
      changeSlideIndex(selectedSlidesIndex.value[0])
    }
    else {
      if (selectedSlidesIndex.value.includes(index)) {
        const newSelectedSlidesIndex = selectedSlidesIndex.value.filter(item => item !== index)
        mainStore.updateSelectedSlidesIndex(newSelectedSlidesIndex)
      }
      else {
        const newSelectedSlidesIndex = [...selectedSlidesIndex.value, index]
        mainStore.updateSelectedSlidesIndex(newSelectedSlidesIndex)
      }
    }
  }
  // 按住Shift键，选择范围内的全部幻灯片
  else if (shiftKeyState.value) {
    if (slideIndex.value === index && !isMultiSelected) return

    let minIndex = Math.min(...selectedSlidesIndex.value)
    let maxIndex = index

    if (index < minIndex) {
      maxIndex = Math.max(...selectedSlidesIndex.value)
      minIndex = index
    }

    const newSelectedSlidesIndex = []
    for (let i = minIndex; i <= maxIndex; i++) newSelectedSlidesIndex.push(i)
    mainStore.updateSelectedSlidesIndex(newSelectedSlidesIndex)
  }
  // 正常切换页面
  else {
    mainStore.updateSelectedSlidesIndex([])
    changeSlideIndex(index)
  }
}

// 设置缩略图工具栏聚焦状态（只有聚焦状态下，该部分的快捷键才能生效）
const setThumbnailsFocus = (focus: boolean) => {
  if (thumbnailsFocus.value === focus) return
  mainStore.setThumbnailsFocus(focus)

  if (!focus) mainStore.updateSelectedSlidesIndex([])
}

// 拖拽调整顺序后进行数据的同步
const handleDragEnd = (eventData: { newIndex: number; oldIndex: number }) => {
  const { newIndex, oldIndex } = eventData
  if (newIndex === undefined || oldIndex === undefined || newIndex === oldIndex) return
  sortSlides(newIndex, oldIndex)
}

// 打开批注面板
const openNotesPanel = () => {
  mainStore.setNotesPanelState(true)
}

const editingSectionId = ref('')

const editSection = (id: string) => {
  mainStore.setDisableHotkeysState(true)
  editingSectionId.value = id || 'default'

  nextTick(() => {
    const inputRef = document.querySelector(`#section-title-input-${id || 'default'}`) as HTMLInputElement
    inputRef.focus()
  })
}

const saveSection = (e: FocusEvent | KeyboardEvent) => {
  const title = (e.target as HTMLInputElement).value
  updateSectionTitle(editingSectionId.value, title)

  editingSectionId.value = ''
  mainStore.setDisableHotkeysState(false)
}

const insertAllTemplates = ({ slides, theme }: { slides: Slide[], theme: Partial<SlideTheme> }) => {
  if (isEmptySlide.value) slidesStore.setSlides(slides, theme)
  else addSlidesFromData(slides)
}

const contextmenusSection = (el: HTMLElement): ContextmenuItem[] => {
  const sectionId = el.dataset.sectionId!

  return [
    {
      text: t('contextmenu.deleteSection'),
      handler: () => removeSection(sectionId),
    },
    {
      text: t('contextmenu.deleteSectionAndSlides'),
      handler: () => {
        mainStore.setActiveElementIdList([])
        removeSectionSlides(sectionId)
      },
    },
    {
      text: t('contextmenu.deleteAllSections'),
      handler: removeAllSection,
    },
    {
      text: t('contextmenu.renameSection'),
      handler: () => editSection(sectionId),
    },
  ]
}

const { enterScreening, enterScreeningFromStart } = useScreening()

const contextmenusThumbnails = (): ContextmenuItem[] => {
  return [
    {
      text: t('contextmenu.paste'),
      subText: 'Ctrl + V',
      handler: pasteSlide,
    },
    {
      text: t('contextmenu.selectAll'),
      subText: 'Ctrl + A',
      handler: selectAllSlide,
    },
    {
      text: t('contextmenu.newSlide'),
      subText: 'Enter',
      handler: createSlide,
    },
    {
      text: t('contextmenu.playFromStart'),
      subText: 'F5',
      handler: enterScreeningFromStart,
    },
  ]
}

const contextmenusThumbnailItem = (): ContextmenuItem[] => {
  return [
    {
      text: t('contextmenu.cut'),
      subText: 'Ctrl + X',
      handler: cutSlide,
    },
    {
      text: t('contextmenu.copy'),
      subText: 'Ctrl + C',
      handler: copySlide,
    },
    {
      text: t('contextmenu.paste'),
      subText: 'Ctrl + V',
      handler: pasteSlide,
    },
    {
      text: t('contextmenu.selectAll'),
      subText: 'Ctrl + A',
      handler: selectAllSlide,
    },
    { divider: true },
    {
      text: t('contextmenu.newSlide'),
      subText: 'Enter',
      handler: createSlide,
    },
    {
      text: t('contextmenu.copySlide'),
      subText: 'Ctrl + D',
      handler: copyAndPasteSlide,
    },
    {
      text: t('contextmenu.deleteSlide'),
      subText: 'Delete',
      handler: () => deleteSlide(),
    },
    {
      text: t('contextmenu.addSection'),
      handler: createSection,
      disable: !!currentSlide.value.sectionTag,
    },
    { divider: true },
    {
      text: t('contextmenu.playFromCurrent'),
      subText: 'Shift + F5',
      handler: enterScreening,
    },
  ]
}
</script>

<style lang="scss" scoped>
.thumbnails {
  height: 100%;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  user-select: none;
  position: relative;

  &.horizontal {
    flex-direction: row;
    align-items: center;
    border-right: 0;

    .thumbnail-list {
      display: flex;
      flex-direction: row;
      padding: 0 10px;
    }

    .thumbnail-item {
      padding: 0 8px;
      flex-direction: column;
      .label { margin: 0 0 4px 0; width: auto; text-align: center; }
    }

    .add-slide-fixed {
      margin: 0 16px;
      width: 100px;
    }
  }
}
.add-slide {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  flex-shrink: 0;
  gap: 12px;

  .btn {
    width: 36px;
    height: 36px;
    background-color: $themeColor;
    color: #0A1428;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all $transitionDelay;
    box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
    position: relative;
    z-index: 1;

    &::before {
      display: none; // Remove pink blob
    }

    &:hover {
      transform: translateY(-2px);
      filter: brightness(1.1);
      box-shadow: 0 8px 25px rgba(0, 212, 255, 0.6);
    }

    .icon {
      font-size: 18px;
    }
  }
  
  .select-theme-text {
    font-size: 13px;
    font-weight: 600;
    color: $textColor;
    cursor: pointer;
    
    &:hover {
      color: $themeColor;
    }
  }

  .select-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
    color: #666;
    &:hover {
      background-color: rgba(0,0,0,0.05);
      color: $themeColor;
    }
  }
}

.add-slide-fixed {
  height: 48px;
  margin: 12px 20px;
  background-color: #fff;
  color: $themeColor;
  border: 1px solid rgba($themeColor, 0.2);
  border-radius: $borderRadiusPill;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all $transitionDelay;

  &:hover {
    background-color: rgba($themeColor, 0.02);
    border-color: $themeColor;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba($themeColor, 0.1);
  }

  .icon {
    margin-right: 8px;
    font-size: 18px;
  }
}

.thumbnail-list {
  padding: 0;
  flex: 1;
  overflow: auto;
}
.thumbnail-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  position: relative;

  .thumbnail {
    border-radius: $borderRadius;
    outline: 2px solid transparent;
    transition: all $transitionDelayFast;
    cursor: pointer;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }
  }

  &.active {
    background-color: rgba($themeColor, 0.05); // Subtle Navy glow
    .label {
      color: $themeColor; 
      font-weight: 800;
    }
    .thumbnail {
      outline: 2px solid $themeColor;
      box-shadow: 0 8px 30px rgba($themeColor, 0.15);
    }
  }
  &.selected {
    .thumbnail {
      outline: 2px solid $themeColor;
    }
  }

  .label {
    font-size: 11px;
    font-family: $headingFont;
    color: $textColorSecondary;
    width: 28px;
    text-align: right;
    margin-right: 16px;
    transition: all $transitionDelay;
  }
}

.transition-name {
  font-size: 10px;
  color: $textColorSecondary;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 4px 8px;
  margin: 4px 20px 4px 44px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  
  .icon {
    margin-right: 4px;
    font-size: 12px;
  }
}

.page-number {
  height: 32px;
  font-size: 11px;
  line-height: 32px;
  text-align: center;
  color: $textColorSecondary;
  background-color: rgba(0,0,0,0.05);
}

.section-title {
  height: 26px;
  font-size: 12px;
  padding: 6px 8px 2px 18px;
  color: $textColorSecondary;

  &.contextmenu-active {
    color: #fff;

    .text::before {
      border-bottom-color: #fff;
      border-right-color: #fff;
    }
  }

  .text {
    display: flex;
    align-items: center;
    position: relative;

    &::before {
      content: '';
      width: 0;
      height: 0;
      border-top: 3px solid transparent;
      border-left: 3px solid transparent;
      border-bottom: 3px solid $textColorSecondary;
      border-right: 3px solid $textColorSecondary;
      margin-right: 5px;
    }

    .text-content {
      display: inline-block;
      @include ellipsis-oneline();
    }
  }

  input {
    width: 100%;
    border: 0;
    outline: 0;
    padding: 0;
    font-size: 12px;
    background: transparent;
    color: #fff;
  }
}
</style>