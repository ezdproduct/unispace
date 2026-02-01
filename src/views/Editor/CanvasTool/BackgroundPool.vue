<template>
  <div class="background-pool">
    <div class="category-header">Chọn mẫu</div>
    
    <div class="background-list">
      <div 
        class="background-item" 
        v-for="(bg, index) in backgrounds" 
        :key="index"
        @click="applyBackground(bg)"
      >
        <img 
          :src="bg.src" 
          loading="lazy" 
          referrerpolicy="no-referrer" 
          @contextmenu.prevent
          @dragstart.prevent
        />
        <div class="checkmark" v-if="currentSlide.background?.image?.src === bg.src">
          <IconCheckOne class="icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { CheckOne as IconCheckOne } from '@icon-park/vue-next'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import type { SlideBackground } from '@/types/slides'

const slidesStore = useSlidesStore()
const { currentSlide, slides } = storeToRefs(slidesStore)
const { addHistorySnapshot } = useHistorySnapshot()

const backgrounds = [
  { src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=424&q=80', fullSrc: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&h=1920&q=80' },
  { src: 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=424&q=80', fullSrc: 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&h=1920&q=80' },
  { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=424&q=80', fullSrc: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&h=1920&q=80' },
  { src: 'https://plus.unsplash.com/premium_photo-1673328573981-893bdc72445b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=424&q=80', fullSrc: 'https://plus.unsplash.com/premium_photo-1673328573981-893bdc72445b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&h=1920&q=80' },
  { src: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=424&q=80', fullSrc: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&h=1920&q=80' },
  { src: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=424&q=80', fullSrc: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&h=1920&q=80' },
  { src: 'https://images.unsplash.com/photo-1531685250784-75699ddc9afc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=424&q=80', fullSrc: 'https://images.unsplash.com/photo-1531685250784-75699ddc9afc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&h=1920&q=80' },
  { src: 'https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=424&q=80', fullSrc: 'https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&h=1920&q=80' },
]

const applyBackground = (bg: { src: string, fullSrc: string }) => {
  const newBackground: SlideBackground = {
    type: 'image',
    image: {
      src: bg.fullSrc,
      size: 'cover',
    },
  }
  // Apply to all slides
  slides.value.forEach(slide => {
    slidesStore.updateSlide({ background: newBackground }, slide.id)
  })
  addHistorySnapshot()
}
</script>

<style lang="scss" scoped>
.background-pool {
  padding-bottom: 20px;
}
.category-header {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 12px;
}

.background-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.background-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 3/4;
  border: 1px solid transparent;
  transition: all 0.2s;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  &:hover {
    border-color: $themeColor;
    
    img {
      transform: scale(1.1);
    }
  }

  .checkmark {
    position: absolute;
    bottom: 6px;
    right: 6px;
    width: 20px;
    height: 20px;
    background-color: $themeColor;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
}
</style>
