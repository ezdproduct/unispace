import json
import os
import re

translations = {
    "模板封面标题": "Tiêu đề trang bìa mẫu",
    "模板封面正文": "Nội dung trang bìa mẫu",
    "演讲人：XXX": "Người thuyết trình: XXX",
    "目录": "Mục lục",
    "CONTENTS": "MỤC LỤC",
    "目录项一": "Mục thứ nhất",
    "目录项二": "Mục thứ hai",
    "目录项三": "Mục thứ ba",
    "目录项四": "Mục thứ tư",
    "目录项五": "Mục thứ năm",
    "目录项六": "Mục thứ sáu",
    "目录项七": "Mục thứ bảy",
    "目录项八": "Mục thứ tám",
    "目录项九": "Mục thứ chín",
    "目录项十": "Mục thứ mười",
    "模板小节过渡标题": "Tiêu đề chuyển tiếp phân đoạn mẫu",
    "模板小节过渡正文": "Nội dung chuyển tiếp phân đoạn mẫu",
    "模板内容页标题": "Tiêu đề trang nội dung mẫu",
    "内容项标题": "Tiêu đề mục nội dung",
    "内容项正文": "Nội dung mục nội dung",
    "未命名演示文稿": "Trình chiếu chưa đặt tên"
}

def translate_content(content):
    if not isinstance(content, str):
        return content
    for cn, vi in translations.items():
        content = content.replace(cn, vi)
    return content

def process_element(element):
    if "content" in element:
        element["content"] = translate_content(element["content"])
    if "text" in element and isinstance(element["text"], dict) and "content" in element["text"]:
        element["text"]["content"] = translate_content(element["text"]["content"])
    return element

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if "title" in data:
        data["title"] = translate_content(data["title"])
    
    if "slides" in data:
        for slide in data["slides"]:
            if "elements" in slide:
                for element in slide["elements"]:
                    process_element(element)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False)

mock_dir = r"C:\Users\Kim Ngan\.gemini\antigravity\scratch\PPTist\public\mocks"
for i in range(1, 9):
    filename = f"template_{i}.json"
    filepath = os.path.join(mock_dir, filename)
    if os.path.exists(filepath):
        print(f"Processing {filename}...")
        process_file(filepath)
    else:
        print(f"File {filename} not found.")
