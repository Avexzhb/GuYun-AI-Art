
import { GoogleGenAI } from "@google/genai";
import { Mode } from "../types";

export const generateImage = async (prompt: string, mode: Mode): Promise<string> => {
  // Always create a new GoogleGenAI instance right before the call to ensure up-to-date API key usage.
 const ai = new GoogleGenAI({ apiKey: process.env.API_KEY })
  
  let finalPrompt = "";
  if (mode === Mode.CITY_MAP) {
    finalPrompt = `请为我创作一幅${prompt}的手绘风格旅游攻略地图，要求如下：

一、前期调研（必须执行）
搜索${prompt}的最新旅游攻略、热门景点、特色美食
搜索该城市的地理布局、行政区划、主要街道分布
了解当地文化特色、建筑风格、代表性元素

二、地图设计要求
1. 视觉风格
- 采用温暖的手绘插画风格，色彩明快
- 融入当地特色元素（如上海的城隍庙，东方明珠塔等）
- 使用具有地方特色的装饰性边框 and 图案
- 整体风格要轻松活泼，适合年轻游客
2. 地图布局
- 准确标注城市主要区域的相对位置关系
- 绘制主要道路轮廓（不需要详细标注）
- 标注重要地标建筑的方位
- 添加指南针、比例尺等地图要素

三、内容要求（核心）
1. 必游景点（8-12个）
- 用手绘图标标注位置
- 每个景点配简短介绍（1-2句话）
- 标注开放时间、门票价格（如有）
- 用星级或特殊图标标注推荐程度
2. 地道美食（10-15个）
- 分类标注：小吃街、特色餐厅、网红店、老字号
- 每个美食点配手绘插图（如火锅、串串、小笼包等）
- 标注特色菜品名称
- 标注大致价格区间（￥/￥￥/￥￥￥）
3. 特色体验
- 茶馆、酒吧街、夜市等生活场景
- 当地特色活动（如变脸、采耳等）
- 最佳拍照打卡点
4. 交通枢纽
- 机场位置及名称（用飞机图标）
- 主要火车站位置及名称（用火车图标）
- 标注与市中心的大致方位关系
5. 实用提示
- 最佳游览季节
- 当地特色伴手礼推荐
- 3日游/5日游推荐路线
- 温馨提示（如"钱塘观潮"、"当地风俗"等）

四、设计细节
1. 图标系统
- 景点：用特色建筑剪影
- 美食：用食物手绘图
- 交通枢纽：飞机（机场）、火车（火车站）
- 住宿：用小房子图标
- 拍照点：用相机图标
2. 文字排版
- 标题使用有特色的手写字体
- 正文使用清晰易读的字体
- 重要信息用醒目颜色标注
- 中英文双语标注重要景点
3. 色彩方案
- 根据城市气质选择主色调：
  - 成都：橙红色（火锅）+ 黑白（熊猫）+ 绿色（茶文化）
  - 西安：土黄色（古城墙）+ 红色（文化）
  - 杭州：青绿色（西湖）+ 粉色（樱花）
  - 北京：红色（故宫）+ 金色（皇家）
  - 上海：蓝色（外滩）+ 金色（繁华）

五、输出格式
- 高清图片
- 可打印版本
- 比例 3:4`;
  } else {
    finalPrompt = `请为我创作一副${prompt}的手绘风格工艺流程图，要求如下:

【AI 执行指令核心】

第一阶段：全维度文化调研 (必须执行)
1. 工艺内核： 梳理${prompt}最正宗的 5个核心工艺步骤，确立逻辑顺序。
2. 视觉图腾： 检索特产所在城市的标志性建筑（如：福建厝、徽派马头墙、岭南镬耳屋）、地标景观及特有装饰纹样。
3. 城市色彩指纹 (City Key Color)： 根据特产属性与产地地貌提取主色调。例如：
   - 苏州/杭州： 黛青、烟雨灰、湖水绿。
   - 西安/敦煌： 暖沙黄、朱砂红、石窟灰。
   - 广东/福建： 岭南深红、墨绿、砖红、金黄。
4. 书法气韵匹配： 确定符合地域性格的书体（北方求其“骨”，沉稳有力；南方求其“韵”，飘逸洒脱）。
5. 诗词挖掘： 选取与${prompt}或其产地最契合的四句诗词。

第二阶段：视觉排版与艺术创作
1. 文化叙事边框 (Cultural Border)：
   - 在画面的最外圈设计一个精致的装饰性边框。
   - 边框必须融合调研出的城市建筑元素、特色景观和传统纹样，像相框一样包围主体。
2. 色彩分级渲染： 全图必须以调研得出的“城市色彩指纹”为主基调，通过水墨晕染或水彩叠色表现，增强地域代入感。
3. S型逻辑流线： 5个工艺节点呈“S”型由上至下婉转分布。
4. 原子化图文绑定： 每个节点必须严丝合缝地包含：[粗体数字] + [手绘插图] + [中文工艺名] + [英文对照]。这四个元素必须紧密挨在一起。
5. 书法呈现： 标题（左上角）与诗词（侧边竖排）使用调研确定的书法风格，模拟毛笔书写的干枯浓淡质感。

第三阶段：排版逻辑与逻辑闭环
1. 物理连接： 用虚线箭头依次连接 1→5 节点。
2. 严谨性检查： 确保数字顺序与工艺步骤、插图内容完全闭环，严禁出现逻辑错乱。

输出格式：
- 高清图片
- 比例 1:1`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: finalPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: mode === Mode.CITY_MAP ? "3:4" : "1:1",
          imageSize: "1K"
        },
        // Real-time information capability via googleSearch tool for gemini-3-pro-image-preview
        tools: [{ googleSearch: {} }]
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      // Find the image part as it may not be the first part.
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    // Explicitly throw a reset signal if the project/key is not found/active
    if (errorMsg.includes("Requested entity was not found")) {
      throw new Error("KEY_RESET_REQUIRED");
    }
    console.error("Gemini Error:", error);
    throw error;
  }
};
