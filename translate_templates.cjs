const fs = require('fs')
const path = require('path')

const translations = {
  '模板封面标题': 'Tiêu đề trang bìa mẫu',
  '模板封面正文': 'Nội dung trang bìa mẫu',
  '演讲人：XXX': 'Người thuyết trình: XXX',
  '目录': 'Mục lục',
  'CONTENTS': 'MỤC LỤC',
  '目录项一': 'Mục thứ nhất',
  '目录项二': 'Mục thứ hai',
  '目录项三': 'Mục thứ ba',
  '目录项四': 'Mục thứ tư',
  '目录项五': 'Mục thứ năm',
  '目录项六': 'Mục thứ sáu',
  '目录项七': 'Mục thứ bảy',
  '目录项八': 'Mục thứ tám',
  '目录项九': 'Mục thứ chín',
  '目录项十': 'Mục thứ mười',
  '模板小节过渡标题': 'Tiêu đề chuyển tiếp phân đoạn mẫu',
  '模板小节过渡正文': 'Nội dung chuyển tiếp phân đoạn mẫu',
  '模板内容页标题': 'Tiêu đề trang nội dung mẫu',
  '内容项标题': 'Tiêu đề mục nội dung',
  '内容项正文': 'Nội dung mục nội dung',
  '未命名演示文稿': 'Trình chiếu chưa đặt tên'
}

function translateContent(content) {
  if (typeof content !== 'string') return content
  let result = content
  for (const [cn, vi] of Object.entries(translations)) {
    result = result.split(cn).join(vi)
  }
  return result
}

function processElement(element) {
  if (element.content) {
    element.content = translateContent(element.content)
  }
  if (element.text && element.text.content) {
    element.text.content = translateContent(element.text.content)
  }
  return element
}

function processFile(filepath) {
  console.log(`Processing ${filepath}...`)
  const data = JSON.parse(fs.readFileSync(filepath, 'utf8'))

  if (data.title) {
    data.title = translateContent(data.title)
  }

  if (data.slides) {
    for (const slide of data.slides) {
      if (slide.elements) {
        for (const element of slide.elements) {
          processElement(element)
        }
      }
    }
  }

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8')
}

const mockDir = path.join(__dirname, 'public', 'mocks')
for (let i = 1; i <= 8; i++) {
  const filename = `template_${i}.json`
  const filepath = path.join(mockDir, filename)
  if (fs.existsSync(filepath)) {
    processFile(filepath)
  }
  else {
    console.log(`File ${filename} not found.`)
  }
}
