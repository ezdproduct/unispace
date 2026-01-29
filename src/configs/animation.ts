import type { TurningMode } from '@/types/slides'

export const ANIMATION_DEFAULT_DURATION = 1000
export const ANIMATION_DEFAULT_TRIGGER = 'click'
export const ANIMATION_CLASS_PREFIX = 'animate__'

export const ENTER_ANIMATIONS = [
  {
    type: 'bounce',
    name: 'Đàn hồi',
    children: [
      { name: 'Nhảy vào', value: 'bounceIn' },
      { name: 'Nhảy từ phải', value: 'bounceInLeft' },
      { name: 'Nhảy từ trái', value: 'bounceInRight' },
      { name: 'Nhảy từ dưới', value: 'bounceInUp' },
      { name: 'Nhảy từ trên', value: 'bounceInDown' },
    ],
  },
  {
    type: 'fade',
    name: 'Mờ dần',
    children: [
      { name: 'Xuất hiện', value: 'fadeIn' },
      { name: 'Xuất hiện từ trên', value: 'fadeInDown' },
      { name: 'Xuất hiện từ trên (xa)', value: 'fadeInDownBig' },
      { name: 'Xuất hiện từ trái', value: 'fadeInLeft' },
      { name: 'Xuất hiện từ trái (xa)', value: 'fadeInLeftBig' },
      { name: 'Xuất hiện từ phải', value: 'fadeInRight' },
      { name: 'Xuất hiện từ phải (xa)', value: 'fadeInRightBig' },
      { name: 'Xuất hiện từ dưới', value: 'fadeInUp' },
      { name: 'Xuất hiện từ dưới (xa)', value: 'fadeInUpBig' },
      { name: 'Từ góc trên trái', value: 'fadeInTopLeft' },
      { name: 'Từ góc trên phải', value: 'fadeInTopRight' },
      { name: 'Từ góc dưới trái', value: 'fadeInBottomLeft' },
      { name: 'Từ góc dưới phải', value: 'fadeInBottomRight' },
    ],
  },
  {
    type: 'rotate',
    name: 'Xoay',
    children: [
      { name: 'Xoay vào', value: 'rotateIn' },
      { name: 'Xoay từ dưới trái', value: 'rotateInDownLeft' },
      { name: 'Xoay từ dưới phải', value: 'rotateInDownRight' },
      { name: 'Xoay từ trên trái', value: 'rotateInUpLeft' },
      { name: 'Xoay từ trên phải', value: 'rotateInUpRight' },
    ],
  },
  {
    type: 'zoom',
    name: 'Thu phóng',
    children: [
      { name: 'Phóng to', value: 'zoomIn' },
      { name: 'Phóng từ trên', value: 'zoomInDown' },
      { name: 'Phóng từ trái', value: 'zoomInLeft' },
      { name: 'Phóng từ phải', value: 'zoomInRight' },
      { name: 'Phóng từ dưới', value: 'zoomInUp' },
    ],
  },
  {
    type: 'slide',
    name: 'Trượt',
    children: [
      { name: 'Trượt từ trên', value: 'slideInDown' },
      { name: 'Trượt từ trái', value: 'slideInLeft' },
      { name: 'Trượt từ phải', value: 'slideInRight' },
      { name: 'Trượt từ dưới', value: 'slideInUp' },
    ],
  },
  {
    type: 'flip',
    name: 'Lật',
    children: [
      { name: 'Lật trục X', value: 'flipInX' },
      { name: 'Lật trục Y', value: 'flipInY' },
    ],
  },
  {
    type: 'back',
    name: 'Phóng trượt',
    children: [
      { name: 'Phóng từ trên', value: 'backInDown' },
      { name: 'Phóng từ trái', value: 'backInLeft' },
      { name: 'Phóng từ phải', value: 'backInRight' },
      { name: 'Phóng từ dưới', value: 'backInUp' },
    ],
  },
  {
    type: 'lightSpeed',
    name: 'Lướt',
    children: [
      { name: 'Lướt từ phải', value: 'lightSpeedInRight' },
      { name: 'Lướt từ trái', value: 'lightSpeedInLeft' },
    ],
  },
]

export const EXIT_ANIMATIONS = [
  {
    type: 'bounce',
    name: 'Đàn hồi',
    children: [
      { name: 'Nhảy ra', value: 'bounceOut' },
      { name: 'Nhảy sang trái', value: 'bounceOutLeft' },
      { name: 'Nhảy sang phải', value: 'bounceOutRight' },
      { name: 'Nhảy lên trên', value: 'bounceOutUp' },
      { name: 'Nhảy xuống dưới', value: 'bounceOutDown' },
    ],
  },
  {
    type: 'fade',
    name: 'Mờ dần',
    children: [
      { name: 'Biến mất', value: 'fadeOut' },
      { name: 'Biến mất xuống dưới', value: 'fadeOutDown' },
      { name: 'Biến mất xuống dưới (xa)', value: 'fadeOutDownBig' },
      { name: 'Biến mất sang trái', value: 'fadeOutLeft' },
      { name: 'Biến mất sang trái (xa)', value: 'fadeOutLeftBig' },
      { name: 'Biến mất sang phải', value: 'fadeOutRight' },
      { name: 'Biến mất sang phải (xa)', value: 'fadeOutRightBig' },
      { name: 'Biến mất lên trên', value: 'fadeOutUp' },
      { name: 'Biến mất lên trên (xa)', value: 'fadeOutUpBig' },
      { name: 'Ra góc trên trái', value: 'fadeOutTopLeft' },
      { name: 'Ra góc trên phải', value: 'fadeOutTopRight' },
      { name: 'Ra góc dưới trái', value: 'fadeOutBottomLeft' },
      { name: 'Ra góc dưới phải', value: 'fadeOutBottomRight' },
    ],
  },
  {
    type: 'rotate',
    name: 'Xoay',
    children: [
      { name: 'Xoay ra', value: 'rotateOut' },
      { name: 'Xoay ra dưới trái', value: 'rotateOutDownLeft' },
      { name: 'Xoay ra dưới phải', value: 'rotateOutDownRight' },
      { name: 'Xoay ra trên trái', value: 'rotateOutUpLeft' },
      { name: 'Xoay ra trên phải', value: 'rotateOutUpRight' },
    ],
  },
  {
    type: 'zoom',
    name: 'Thu phóng',
    children: [
      { name: 'Thu nhỏ ra', value: 'zoomOut' },
      { name: 'Thu nhỏ xuống dưới', value: 'zoomOutDown' },
      { name: 'Thu nhỏ sang trái', value: 'zoomOutLeft' },
      { name: 'Thu nhỏ sang phải', value: 'zoomOutRight' },
      { name: 'Thu nhỏ lên trên', value: 'zoomOutUp' },
    ],
  },
  {
    type: 'slide',
    name: 'Trượt',
    children: [
      { name: 'Trượt xuống dưới', value: 'slideOutDown' },
      { name: 'Trượt sang trái', value: 'slideOutLeft' },
      { name: 'Trượt sang phải', value: 'slideOutRight' },
      { name: 'Trượt lên trên', value: 'slideOutUp' },
    ],
  },
  {
    type: 'flip',
    name: 'Lật',
    children: [
      { name: 'Lật trục X thoát', value: 'flipOutX' },
      { name: 'Lật trục Y thoát', value: 'flipOutY' },
    ],
  },
  {
    type: 'back',
    name: 'Thu nhỏ trượt',
    children: [
      { name: 'Thu nhỏ xuống dưới', value: 'backOutDown' },
      { name: 'Thu nhỏ sang trái', value: 'backOutLeft' },
      { name: 'Thu nhỏ sang phải', value: 'backOutRight' },
      { name: 'Thu nhỏ lên trên', value: 'backOutUp' },
    ],
  },
  {
    type: 'lightSpeed',
    name: 'Lướt',
    children: [
      { name: 'Lướt sang phải', value: 'lightSpeedOutRight' },
      { name: 'Lướt sang trái', value: 'lightSpeedOutLeft' },
    ],
  },
]

export const ATTENTION_ANIMATIONS = [
  {
    type: 'shake',
    name: 'Rung lắc',
    children: [
      { name: 'Lắc ngang', value: 'shakeX' },
      { name: 'Lắc dọc', value: 'shakeY' },
      { name: 'Lắc đầu', value: 'headShake' },
      { name: 'Đu đưa', value: 'swing' },
      { name: 'Nghiêng ngả', value: 'wobble' },
      { name: 'Kinh ngạc', value: 'tada' },
      { name: 'Rung rinh', value: 'jello' },
    ],
  },
  {
    type: 'other',
    name: 'Khác',
    children: [
      { name: 'Nảy', value: 'bounce' },
      { name: 'Nhấp nháy', value: 'flash' },
      { name: 'Nhịp tim', value: 'pulse' },
      { name: 'Dây cao su', value: 'rubberBand' },
      { name: 'Nhịp tim (nhanh)', value: 'heartBeat' },
    ],
  },
]

interface SlideAnimation {
  label: string
  value: TurningMode
}

export const SLIDE_ANIMATIONS: SlideAnimation[] = [
  { label: 'Không', value: 'no' },
  { label: 'Ngẫu nhiên', value: 'random' },
  { label: 'Trượt ngang', value: 'slideX' },
  { label: 'Trượt dọc', value: 'slideY' },
  { label: 'Trượt ngang (3D)', value: 'slideX3D' },
  { label: 'Trượt dọc (3D)', value: 'slideY3D' },
  { label: 'Mờ dần', value: 'fade' },
  { label: 'Xoay', value: 'rotate' },
  { label: 'Mở dọc', value: 'scaleY' },
  { label: 'Mở ngang', value: 'scaleX' },
  { label: 'Phóng to', value: 'scale' },
  { label: 'Thu nhỏ', value: 'scaleReverse' },
]