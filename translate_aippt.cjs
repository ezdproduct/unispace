const fs = require('fs');
const path = require('path');

const translations = {
    "犯罪心理学研究": "Nghiên cứu Tâm lý học Tội phạm",
    "探索犯罪心理的成因、特征及干预策略，助力犯罪预防与矫治。": "Khám phá nguyên nhân, đặc điểm và chiến lược can thiệp tâm lý tội phạm, hỗ trợ phòng ngừa và giáo dục cải tạo tội phạm.",
    "犯罪心理学概述": "Tổng quan về Tâm lý học Tội phạm",
    "犯罪心理的形成": "Sự hình thành Tâm lý Tội phạm",
    "犯罪类型与心理特征": "Loại hình tội phạm và Đặc điểm tâm lý",
    "犯罪心理评估与干预": "Đánh giá và Can thiệp Tâm lý Tội phạm",
    "犯罪心理学的应用": "Ứng dụng của Tâm lý học Tội phạm",
    "未来发展趋势": "Xu hướng phát triển tương lai",
    "本章将介绍犯罪心理学的定义、历史、基本理论及其研究领域。": "Chương này sẽ giới thiệu định nghĩa, lịch sử, các lý thuyết cơ bản và các lĩnh vực nghiên cứu của tâm lý học tội phạm.",
    "定义与历史": "Định nghĩa và Lịch sử",
    "犯罪心理学的定义": "Định nghĩa Tâm lý học Tội phạm",
    "犯罪心理学是研究犯罪行为及其心理机制的学科，旨在理解犯罪者的心理特征和行为动机。": "Tâm lý học tội phạm là bộ môn nghiên cứu hành vi tội phạm và cơ chế tâm lý của nó, nhằm hiểu rõ đặc điểm tâm lý và động cơ hành vi của tội phạm.",
    "犯罪心理学的发展历史": "Lịch sử phát triển của Tâm lý học Tội phạm",
    "犯罪心理学起源于19世纪末，随着心理学和法学的发展逐渐形成独立学科。": "Tâm lý học tội phạm bắt nguồn từ cuối thế kỷ 19, dần hình thành một bộ môn độc lập cùng với sự phát triển của tâm lý học và luật học.",
    "主要研究领域": "Các lĩnh vực nghiên cứu chính",
    "包括犯罪心理成因、犯罪类型分析、犯罪心理评估与干预等。": "Bao gồm nguyên nhân tâm lý tội phạm, phân tích loại hình tội phạm, đánh giá và can thiệp tâm lý tội phạm, v.v.",
    "与其他学科的关系": "Mối quan hệ với các bộ môn khác",
    "犯罪心理学与法学、社会学、生物学等学科密切相关，共同探讨犯罪现象。": "Tâm lý học tội phạm có liên quan mật thiết đến luật học, xã hội học, sinh học, v.v., cùng nhau thảo luận về hiện tượng tội phạm.",
    "基本理论": "Lý thuyết cơ bản",
    "生物学理论": "Lý thuyết Sinh học",
    "探讨遗传、神经生理等因素对犯罪行为的影响。": "Thảo luận về ảnh hưởng của di truyền, sinh lý thần kinh và các yếu tố khác đối với hành vi tội phạm.",
    "心理学理论": "Lý thuyết Tâm lý học",
    "分析人格、认知、情感等心理因素与犯罪行为的关联。": "Phân tích mối liên hệ giữa các yếu tố tâm lý như nhân cách, nhận thức, cảm xúc và hành vi tội phạm.",
    "社会学理论": "Lý thuyết Xã hội học",
    "研究社会环境、文化背景等对犯罪心理的塑造作用。": "Nghiên cứu vai trò định hình của môi trường xã hội, bối cảnh văn hóa, v.v. đối với tâm lý tội phạm.",
    "综合理论": "Lý thuyết Tổng hợp",
    "结合生物学、心理学和社会学视角，全面解释犯罪心理。": "Kết hợp các góc nhìn sinh học, tâm lý học và xã hội học để giải thích toàn diện về tâm lý tội phạm.",
    "本章将探讨个体因素、环境因素及心理过程对犯罪心理的影响。": "Chương này sẽ thảo luận về ảnh hưởng của các yếu tố cá nhân, yếu tố môi trường và quá trình tâm lý đối với tâm lý tội phạm.",
    "个体因素": "Yếu tố cá nhân",
    "遗传因素": "Yếu tố di truyền",
    "研究基因与犯罪行为之间的潜在联系。": "Nghiên cứu mối liên hệ tiềm năng giữa gen và hành vi tội phạm.",
    "心理特质": "Đặc điểm tâm lý",
    "探讨人格特质如攻击性、冲动性与犯罪的关系。": "Thảo luận về mối quan hệ giữa các đặc điểm nhân cách như tính hung hăng, tính bốc đồng và tội phạm.",
    "人格障碍": "Rối loạn nhân cách",
    "分析反社会人格障碍等心理疾病对犯罪行为的推动作用。": "Phân tích vai trò thúc đẩy của các bệnh lý tâm lý như rối loạn nhân cách chống đối xã hội đối với hành vi tội phạm.",
    "早期经历": "Trải nghiệm sớm",
    "研究童年创伤、家庭暴力等对犯罪心理的长期影响。": "Nghiên cứu ảnh hưởng lâu dài của tổn thương thời thơ ấu, bạo lực gia đình, v.v. đối with tâm lý tội phạm.",
    "环境因素": "Yếu tố môi trường",
    "家庭环境": "Môi trường gia đình",
    "探讨家庭结构、教育方式对犯罪心理的塑造作用。": "Thảo luận về vai trò định hình của cấu trúc gia đình, phương thức giáo dục đối với tâm lý tội phạm.",
    "社会环境影响": "Ảnh hưởng môi trường xã hội",
    "分析同伴压力、社区环境对犯罪行为的诱导作用。": "Phân tích vai trò dẫn dắt của áp lực đồng trang lứa, môi trường cộng đồng đối với hành vi tội phạm.",
    "经济因素": "Yếu tố kinh tế",
    "研究贫困、失业等经济问题与犯罪率的关系。": "Nghiên cứu mối quan hệ giữa các vấn đề kinh tế như nghèo đói, thất nghiệp và tỷ lệ tội phạm.",
    "文化背景": "Bối cảnh văn hóa",
    "探讨文化价值观对犯罪心理的影响。": "Thảo luận về ảnh hưởng của các giá trị văn hóa đối với tâm lý tội phạm.",
    "心理过程": "Quá trình tâm lý",
    "认知过程": "Quá trình nhận thức",
    "情绪因素": "Yếu tố cảm xúc",
    "意志品质": "Phẩm chất ý chí",
    "自我意识": "Ý thức bản thân",
    "分析犯罪人对自我的认知及其对行为的影响。": "Phân tích nhận thức về bản thân của tội phạm và ảnh hưởng của nó đối với hành vi.",
    "探讨犯罪决策过程中的认知偏向。": "Thảo luận về thiên kiến nhận thức trong quá trình ra quyết định phạm tội.",
    "研究愤怒、恐惧等情绪在犯罪行为中的驱动作用。": "Nghiên cứu vai trò thúc đẩy của các cảm xúc như giận dữ, sợ hãi trong hành vi tội phạm.",
    "分析犯罪人在实施犯罪时的意志控制力能力。": "Phân tích khả năng kiểm soát ý chí của tội phạm khi thực hiện tội phạm.",
    "本章将根据犯罪动机、行为特征等对犯罪类型进行分类分析。": "Chương này sẽ phân loại và phân tích các loại hình tội phạm dựa trên động cơ phạm tội, đặc điểm hành vi, v.v.",
    "暴力犯罪": "Tội phạm bạo lực",
    "财产犯罪": "Tội phạm tài sản",
    "性犯罪": "Tội phạm tình dục",
    "青少年犯罪": "Tội phạm vị thành niên",
    "网络犯罪": "Tội phạm mạng",
    "心理特征": "Đặc điểm tâm lý",
    "研究杀人、伤害等暴力行为背后的心理机制。": "Nghiên cứu cơ chế tâm lý đằng sau các hành vi bạo lực như giết người, gây thương tích.",
    "探讨盗窃、诈骗等侵财行为的心理动机。": "Thảo luận về động cơ tâm lý của các hành vi xâm phạm tài sản như trộm cắp, lừa đảo.",
    "分析性偏好障碍及性侵害行为的心理成因。": "Phân tích nguyên nhân tâm lý của các rối loạn sở thích tình dục và hành vi xâm hại tình dục.",
    "研究青少年心理发育特点与犯罪行为的关联。": "Nghiên cứu mối liên hệ giữa các đặc điểm phát triển tâm lý của thanh thiếu niên và hành vi tội phạm.",
    "分析网络环境下犯罪者的新型心理特征。": "Phân tích các đặc điểm tâm lý kiểu mới của tội phạm trong môi trường mạng.",
    "行为特征": "Đặc điểm hành vi",
    "分析暴力犯罪者的攻击模式与残忍程度。": "Phân tích mô thức tấn công và mức độ tàn bạo của tội phạm bạo lực.",
    "研究财产犯罪者的作案技巧与心理防线。": "Nghiên cứu kỹ năng gây án và phòng thủ tâm lý của tội phạm tài sản.",
    "探讨性犯罪者的目标选择与行为控制。": "Thảo luận về việc lựa chọn mục tiêu và kiểm soát hành vi của tội phạm tình dục.",
    "研究青少年犯罪的群体性与冲动性特征。": "Nghiên cứu đặc điểm tính đám đông và tính bốc đồng của tội phạm vị thành niên.",
    "分析网络犯罪的隐蔽性与跨地域性特征。": "Phân tích các đặc điểm tính ẩn danh và tính xuyên biên giới của tội phạm mạng.",
    "本章将介绍犯罪心理评估的方法及心理干预在矫治中的应用。": "Chương này sẽ giới thiệu các phương pháp đánh giá tâm lý tội phạm và ứng dụng can thiệp tâm lý trong giáo dục cải tạo.",
    "评估方法": "Phương pháp đánh giá",
    "心理测验": "Kiểm tra tâm lý",
    "行为观察": "Quan sát hành vi",
    "访谈技术": "Kỹ thuật phỏng vấn",
    "档案分析": "Phân tích hồ sơ",
    "应用标准化量表评估犯罪人的心理特质。": "Ứng dụng các thang đo tiêu chuẩn để đánh giá đặc điểm tâm lý của tội phạm.",
    "通过直接观察记录犯罪人的行为表现。": "Ghi chép biểu hiện hành vi của tội phạm thông qua quan sát trực tiếp.",
    "采用结构化或非结构化访谈深入了解其内心世界。": "Sử dụng phỏng vấn có cấu trúc hoặc không có cấu trúc để tìm hiểu sâu về thế giới nội tâm.",
    "研究既往记录、案卷资料以获取全面背景信息。": "Nghiên cứu hồ sơ cũ, tài liệu vụ án để lấy thông tin bối cảnh toàn diện.",
    "干预策略": "Chiến lược can thiệp",
    "认知行为疗法 (CBT)": "Liệu pháp nhận thức hành vi (CBT)",
    "通过改变错误认知来修正违法行为。": "Điều chỉnh hành vi vi phạm bằng cách thay đổi nhận thức sai lầm.",
    "通过增强同理心等方式辅助矫治过程。": "Hỗ trợ quá trình cải tạo bằng cách tăng cường sự thấu cảm, v.v.",
    "制定针对性的心理预防与危机干预计划。": "Xây dựng kế hoạch phòng ngừa tâm lý và can thiệp khủng hoảng có mục tiêu.",
    "评估干预效果并及时调整干预策略。": "Đánh giá hiệu quả can thiệp và điều chỉnh chiến lược can thiệp kịp thời.",
    "同理心训练": "Huấn luyện thấu cảm",
    "危机干预": "Can thiệp khủng hoảng",
    "效果评估": "Đánh giá hiệu quả",
    "本章将探讨犯罪心理学在司法实践及犯罪预防中的具体应用。": "Chương này sẽ thảo luận về ứng dụng cụ thể của tâm lý học tội phạm trong thực tiễn tư pháp và phòng ngừa tội phạm.",
    "应用场景": "Kịch bản ứng dụng",
    "刑事侦查": "Điều tra hình sự",
    "审判过程": "Quá trình xét xử",
    "服刑期间": "Giai đoạn thi hành án",
    "回归社会": "Tái hòa nhập cộng đồng",
    "运用犯罪心理画像技术辅助侦破案件。": "Sử dụng kỹ thuật phác họa tâm lý tội phạm để hỗ trợ phá án.",
    "提供专家意见以辅助法律责任评定。": "Cung cấp ý kiến chuyên gia để hỗ trợ thẩm định trách nhiệm pháp lý.",
    "开展针对性的心理咨询与行为改造项目。": "Triển khai các dự án tư vấn tâm lý và cải tạo hành vi có mục tiêu.",
    "提供社区帮教与支持以降低重犯率。": "Cung cấp giáo dục cải tạo cộng đồng và hỗ trợ để giảm tỷ lệ tái phạm.",
    "实际案例": "Trường hợp thực tế",
    "国内外典型案例": "Các vụ án điển hình trong và ngoài nước",
    "技术手段": "Biện pháp kỹ thuật",
    "心理画像技术": "Kỹ thuật phác họa tâm lý",
    "测谎技术应用": "Ứng dụng kỹ thuật đo nói dối",
    "分析经典案例以验证心理学理论的应用效果。": "Phân tích các vụ án kinh điển để kiểm chứng hiệu quả ứng dụng của các lý thuyết tâm lý học.",
    "详细解析犯罪画像在实战中的成功经验。": "Giải thích chi tiết các kinh nghiệm thành công của phác họa tội phạm trong thực chiến.",
    "探讨心理声学等高科技手段在侦查中的潜力。": "Thảo luận về tiềm năng của các phương tiện công nghệ cao như tâm lý âm học trong điều tra.",
    "在审前及审中环节应用心理学知识。": "Ứng dụng kiến thức tâm lý học ở giai đoạn trước và trong phiên tòa.",
    "司法鉴定中的应用": "Ứng dụng trong giám định tư pháp",
    "本章将展望犯罪心理学的发展前景及面临的主要挑战。": "Chương này sẽ nhìn nhận về triển vọng phát triển và các thách thức chính mà tâm lý học tội phạm phải đối mặt.",
    "发展前景": "Triển vọng phát triển",
    "跨学科整合": "Tích hợp đa ngành",
    "技术革新": "Đổi mới công nghệ",
    "预防前置": "Phòng ngừa từ sớm",
    "国际合作": "Hợp tác quốc tế",
    "深化与脑科学、人工智能等领域的交叉研究。": "Sâu sắc hóa nghiên cứu liên ngành với khoa học não bộ, trí tuệ nhân tạo, v.v.",
    "应用大数据、VR等技术提升研究与实操水平。": "Ứng dụng Big Data, VR và các công nghệ khác để nâng cao trình độ nghiên cứu và thực hành.",
    "从源头出发，构建完善的心理预防体系。": "Bắt đầu từ nguồn gốc, xây dựng hệ thống phòng ngừa tâm lý hoàn thiện.",
    "加强全球范围内犯罪心理学研究的交流与协作。": "Tăng cường trao đổi và hợp tác trong nghiên cứu tâm lý học tội phạm ở phạm vi toàn cầu.",
    "面临挑战": "Thách thức đối mặt",
    "伦理法律难题": "Nan giải về đạo đức và luật pháp",
    "研究方法局限": "Hạn chế về phương pháp nghiên cứu",
    "社会环境变化": "Thay đổi môi trường xã hội",
    "专业人才匮乏": "Thiếu hụt tài năng chuyên môn",
    "探讨在心理评估与干预中涉及的隐私与伦理问题。": "Thảo luận về các vấn đề quyền riêng tư và đạo đức liên quan đến đánh giá và can thiệp tâm lý.",
    "寻求突破现有的研究模型与数据获取路径。": "Tìm kiếm đột phá cho các mô hình nghiên cứu và lộ trình thu thập dữ liệu hiện có.",
    "分析新型犯罪对传统心理学理论提出的新挑战。": "Phân tích những thách thức mới mà các loại tội phạm kiểu mới đặt ra cho lý thuyết tâm lý học truyền thống.",
    "呼吁加强学科建设，培养高素质专业人才。": "Kêu gọi tăng cường xây dựng bộ môn, đào tạo tài năng chuyên môn chất lượng cao.",
    "结语": "Kết luận",
    "总结犯罪心理学的价值，强调持续关注与研究的必要性。": "Tổng kết giá trị của tâm lý học tội phạm, nhấn mạnh sự cần thiết phải tiếp tục quan tâm và nghiên cứu."
};

function translateContent(content) {
    if (typeof content !== 'string') return content;
    let result = content;
    for (const [cn, vi] of Object.entries(translations)) {
        result = result.split(cn).join(vi);
    }
    return result;
}

function processAIPPT(filepath) {
    console.log(`Processing ${filepath}...`);
    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));

    if (data.slides) {
        for (const slide of data.slides) {
            if (slide.data) {
                if (slide.data.title) slide.data.title = translateContent(slide.data.title);
                if (slide.data.text) slide.data.text = translateContent(slide.data.text);
                if (slide.data.items) {
                    slide.data.items = slide.data.items.map(item => {
                        if (typeof item === 'string') return translateContent(item);
                        if (item.title) item.title = translateContent(item.title);
                        if (item.text) item.text = translateContent(item.text);
                        return item;
                    });
                }
            }
        }
    }

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
}

function processMarkdown(filepath) {
    console.log(`Processing ${filepath}...`);
    let content = fs.readFileSync(filepath, 'utf8');
    for (const [cn, vi] of Object.entries(translations)) {
        content = content.split(cn).join(vi);
    }
    fs.writeFileSync(filepath, content, 'utf8');
}

const mockDir = path.join(__dirname, 'public', 'mocks');
const aipptPath = path.join(mockDir, 'AIPPT.json');
const aipptOutlinePath = path.join(mockDir, 'AIPPT_Outline.md');

if (fs.existsSync(aipptPath)) processAIPPT(aipptPath);
if (fs.existsSync(aipptOutlinePath)) processMarkdown(aipptOutlinePath);
