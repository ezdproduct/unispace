export const enum KEYS {
  C = 'C',
  X = 'X',
  Z = 'Z',
  Y = 'Y',
  A = 'A',
  G = 'G',
  L = 'L',
  F = 'F',
  D = 'D',
  B = 'B',
  P = 'P',
  O = 'O',
  R = 'R',
  T = 'T',
  MINUS = '-',
  EQUAL = '=',
  DIGIT_0 = '0',
  DELETE = 'DELETE',
  UP = 'ARROWUP',
  DOWN = 'ARROWDOWN',
  LEFT = 'ARROWLEFT',
  RIGHT = 'ARROWRIGHT',
  ENTER = 'ENTER',
  SPACE = ' ',
  TAB = 'TAB',
  BACKSPACE = 'BACKSPACE',
  ESC = 'ESCAPE',
  PAGEUP = 'PAGEUP',
  PAGEDOWN = 'PAGEDOWN',
  F5 = 'F5',
}

interface HotkeyItem {
  type: string
  children: {
    label: string
    value?: string
  }[]
}

export const HOTKEY_DOC: HotkeyItem[] = [
  {
    type: 'Chung',
    children: [
      { label: 'Cắt', value: 'Ctrl + X' },
      { label: 'Sao chép', value: 'Ctrl + C' },
      { label: 'Dán', value: 'Ctrl + V' },
      { label: 'Dán văn bản thuần túy', value: 'Ctrl + Shift + V' },
      { label: 'Sao chép và dán nhanh', value: 'Ctrl + D' },
      { label: 'Chọn tất cả', value: 'Ctrl + A' },
      { label: 'Hoàn tác', value: 'Ctrl + Z' },
      { label: 'Làm lại', value: 'Ctrl + Y' },
      { label: 'Xóa', value: 'Delete / Backspace' },
      { label: 'Chọn nhiều', value: 'Giữ Ctrl hoặc Shift' },
      { label: 'Tìm kiếm & Thay thế', value: 'Ctrl + F' },
      { label: 'In', value: 'Ctrl + P' },
      { label: 'Đóng cửa sổ', value: 'ESC' },
    ],
  },
  {
    type: 'Trình chiếu',
    children: [
      { label: 'Trình chiếu từ đầu', value: 'F5' },
      { label: 'Trình chiếu từ trang hiện tại', value: 'Shift + F5' },
      { label: 'Trang trước', value: '↑ / ← / PgUp' },
      { label: 'Trang sau', value: '↓ / → / PgDown' },
      { label: 'Trang sau', value: 'Enter / Space' },
      { label: 'Thoát trình chiếu', value: 'ESC' },
    ],
  },
  {
    type: 'Chỉnh sửa Slide',
    children: [
      { label: 'Tạo Slide mới', value: 'Enter' },
      { label: 'Di chuyển bản vẽ', value: 'Space + Kéo chuột' },
      { label: 'Thu phóng bản vẽ', value: 'Ctrl + Cuộn chuột' },
      { label: 'Phóng to bản vẽ', value: 'Ctrl + =' },
      { label: 'Thu nhỏ bản vẽ', value: 'Ctrl + -' },
      { label: 'Vừa màn hình hiện tại', value: 'Ctrl + 0' },
      { label: 'Trang trước (khi không chọn phần tử)', value: '↑' },
      { label: 'Trang sau (khi không chọn phần tử)', value: '↓' },
      { label: 'Trang trước', value: 'Cuộn chuột lên / PgUp' },
      { label: 'Trang sau', value: 'Cuộn chuột xuống / PgDown' },
      { label: 'Tạo văn bản nhanh', value: 'Nhấp đúp vùng trống / T' },
      { label: 'Tạo hình chữ nhật nhanh', value: 'R' },
      { label: 'Tạo hình tròn nhanh', value: 'O' },
      { label: 'Tạo đường nét nhanh', value: 'L' },
      { label: 'Thoát trạng thái vẽ', value: 'Chuột phải' },
    ],
  },
  {
    type: 'Thao tác phần tử',
    children: [
      { label: 'Di chuyển', value: '↑ / ← / ↓ / →' },
      { label: 'Khóa', value: 'Ctrl + L' },
      { label: 'Nhóm', value: 'Ctrl + G' },
      { label: 'Rã nhóm', value: 'Ctrl + Shift + G' },
      { label: 'Đưa lên trên cùng', value: 'Alt + F' },
      { label: 'Đưa xuống dưới cùng', value: 'Alt + B' },
      { label: 'Khóa tỷ lệ rộng cao', value: 'Giữ Ctrl hoặc Shift' },
      { label: 'Tạo đường ngang / dọc', value: 'Giữ Ctrl hoặc Shift' },
      { label: 'Chuyển phần tử tập trung', value: 'Tab' },
      { label: 'Xác nhận cắt ảnh', value: 'Enter' },
      { label: 'Hoàn thành vẽ hình tự do', value: 'Enter' },
    ],
  },
  {
    type: 'Chỉnh sửa bảng',
    children: [
      { label: 'Đến ô tiếp theo', value: 'Tab' },
      { label: 'Di chuyển ô tiêu điểm', value: '↑ / ← / ↓ / →' },
      { label: 'Chèn hàng phía trên', value: 'Ctrl + ↑' },
      { label: 'Chèn hàng phía dưới', value: 'Ctrl + ↓' },
      { label: 'Chèn cột bên trái', value: 'Ctrl + ←' },
      { label: 'Chèn cột bên phải', value: 'Ctrl + →' },
    ],
  },
  {
    type: 'Chỉnh sửa dữ liệu biểu đồ',
    children: [
      { label: 'Đến hàng tiếp theo', value: 'Enter' },
    ],
  },
  {
    type: 'Chỉnh sửa văn bản',
    children: [
      { label: 'Chữ đậm', value: 'Ctrl + B' },
      { label: 'Chữ nghiêng', value: 'Ctrl + I' },
      { label: 'Gạch chân', value: 'Ctrl + U' },
      { label: 'Mã nội dòng', value: 'Ctrl + E' },
      { label: 'Chỉ số trên', value: 'Ctrl + ;' },
      { label: 'Chỉ số dưới', value: `Ctrl + '` },
      { label: 'Chọn đoạn văn', value: `ESC` },
    ],
  },
  {
    type: 'Các thao tác nhanh khác',
    children: [
      { label: 'Thêm ảnh - Dán ảnh từ bộ nhớ tạm' },
      { label: 'Thêm ảnh - Kéo thả ảnh từ máy tính vào bản vẽ' },
      { label: 'Thêm ảnh - Dán mã SVG vào bản vẽ' },
      { label: 'Thêm ảnh - Dán liên kết ảnh từ Pexels' },
      { label: 'Thêm văn bản - Dán văn bản từ bộ nhớ tạm' },
      { label: 'Thêm văn bản - Kéo thả văn bản được chọn vào bản vẽ' },
      { label: 'Chỉnh sửa văn bản - Hỗ trợ cú pháp markdown để tạo danh sách và trích dẫn' },
    ],
  },
]