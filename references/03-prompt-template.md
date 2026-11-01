# 清单格式与 Subject 写法

---

## 1. 清单 JSON（脚本的输入）

一个 JSON 文件，`machines` 数组一行一台。字段与 `scripts/build-prompt-pack.mjs` 的校验一一对应。

```json
{
  "project": "BOPET 双向拉伸聚酯薄膜产线",
  "anchor": "D03",
  "styles": ["3d", "line"],
  "machines": [
    {
      "id": "D03",
      "name_zh": "单螺杆挤出机",
      "name_en": "Single-Screw Extruder",
      "stage": "熔融挤出",
      "accent": "teal",
      "hex": "#0FA3A3",
      "cutaway": false,
      "subject_3d": "a large single-screw plastics extruder for film production: ...",
      "subject_line": "same extruder drawn as a patent-style line diagram — ...",
      "extra_negative": "injection molding machine, 3D printer"
    }
  ]
}
```

| 字段 | 必填 | 规则 |
|---|---|---|
| `id` | ✅ | 唯一；按流程顺序编号（`D01`…） |
| `name_zh` / `name_en` | ✅ | 后期标注用；英文名同时进文件名 |
| `stage` | 建议 | 决定配色段与总图分组；同名工段自动同色 |
| `accent` + `hex` | ✅ | `hex` 必须 `#RRGGBB`；`accent` 是英文色名 |
| `subject_3d` / `subject_line` | ✅ | **全英文**；不带 `Subject:` 前缀（脚本会补） |
| `cutaway` | 建议 | `true` 表示这台的内部结构必须露出来 |
| `extra_negative` | ✅（脚本会提醒） | 最容易被误认成的那台机器 |

`anchor` 是锚点图（先跑、定调的那一台）。`styles` 可选 `3d` / `line` / `exploded` / `cut`。

> 15 台以内可以直接手写。更多就先用表格（id/中英名/工段/色/部件清单）批量整理再转 JSON。

---

## 2. Subject 四段模板

```
Subject: <定义句>:
  <部件 1>，<部件 2>，<部件 3>（从大到小、从外到内，分号隔开）;
  <连接与附属：管路 / 输送 / 电缆 / 控制箱>;
  <比例或识别特征：proportional character: ...>
Accent color: {ACCENT} ({HEX}) ... less than 10% ...
```

**篇幅**：60–120 词，部件 5–9 个。少于 5 个 → 模型只能给通用外形；多于 9 个 → 它开始丢件或乱造。

### 拆解一个真实例子

```
Subject: a large single-screw plastics extruder for film production:
```
→ **定义句**。三要素：规模（large）、机型（single-screw）、用途（for film production）。
用途不是修饰，它决定了模型走"薄膜线"还是"造粒线"的形态库。

```
a horizontal barrel about 8 meters long with five hinged heating-jacket covers in a row
along its length,
```
→ **主构件 + 可数特征**。`five ... in a row` 是离散计数，模型对数量词最敏感，比"several"稳得多。

```
a bulky rectangular gearbox and a TEFC drive motor at the right end,
a stainless feed hopper with a slide gate on the left top,
a vacuum vent port on top of the barrel with a small condenser,
two rigid insulated melt pipes leaving the discharge end,
the whole unit mounted on a low fabricated steel base with anchor bolts;
```
→ **其余构件，按"大件→小件"排，每个都带位置词**（`at the right end` / `on the left top` / `on top of`）。
位置词是把"零件清单"变成"一台机器"的关键，没有位置词，模型会把零件堆在中心。

```
proportional character: long and low, roughly 6 times longer than it is tall.
```
→ **识别特征句**。这一句专门用来杀死"注塑机那种高胖机身"。

```
Accent color: teal (#0FA3A3) on the barrel jacket covers and the base frame,
occupying less than 10% of the visible surface; the housing stays matte white.
```
→ **配色句**。位置写具体（不是笼统的 "on the frame"），但 **10% 与白机身的约束不能动**。

---

## 3. 识别特征句：六个可直接套的句式

| # | 句式 | 适合 | 例 |
|---|---|---|---|
| 1 | `proportional character: roughly N times longer than it is tall` | 长条形设备 | 挤出机、拉幅机、辊道、烘干线 |
| 2 | `<动作主语> <数量> <构件> <形态/朝向>` | 有独有机构 | `two endless chain rails diverging in a V shape` |
| 3 | `a <A> and a matching <B> forming a closed <形状>` | 必须成对出现 | `top beam and a matching bottom beam forming a closed O-frame` |
| 4 | `<表面处理> <构件>，<视觉后果>` | 靠材质辨认 | `mirror-finish chrome-plated roll with a visible specular streak` |
| 5 | `visibly divided into <阶段> by <分界特征>` | 长腔体分段 | `divided into preheat, stretching, heat-setting zones by panel seams` |
| 6 | `no <不该有的东西>`（写在 Subject 里而非负向） | 需要和近亲区分 | `no bottom beam`（扫描架 vs 安检门） |

**判定写没写对**：把这句话单独给一个没看过原图的人，他能画出大致轮廓吗？不能就是没写到位。

---

## 4. 线稿版 Subject 怎么写

线稿不是"3D 去色"，是**另一套信息密度**：

1. **保留轮廓与分件线**，去掉材质、光照、颜色——那些在线稿里没有对应的笔触。
2. **隐藏件用虚线**：`internal channel in dashed lines`、`hidden passages shown dashed`。
3. **剖切要在正文里说出来**：`half-section showing the internal ... `，否则线稿会画成外观图。
4. **加一句 "same <machine>"** 让两版指同一样东西，读者能对上。

模板：

```
Subject (line): same <机器名> drawn as a patent-style line diagram — <构件1>, <构件2>,
<构件3>, <内部件> in dashed lines.
```

---

## 5. 十条写作禁令

| # | 禁 | 因为 |
|---|---|---|
| 1 | `high-end / premium / futuristic / elegant` | 只会把图推向广告片，不增加任何结构信息 |
| 2 | `cinematic lighting / dramatic / volumetric` | 破坏统一光位，白底会脏 |
| 3 | `detailed / intricate / complex`（单独使用） | 空形容词；要写"几个什么件" |
| 4 | 图内任何文字需求（铭牌、屏幕 UI、标签） | 必出乱码；标注后期加 |
| 5 | 具体品牌、型号、厂商名 | 侵权风险，且模型会编徽标 |
| 6 | `realistic factory floor / workshop background` | 与"白底孤图"直接冲突 |
| 7 | 一次描述两台以上机器 | 会出合体怪；要两台就出两张再拼 |
| 8 | 用中文写 Subject | 大多数模型对英文结构词更稳 |
| 9 | 部件超过 9 个 | 开始丢件、造件 |
| 10 | 在 Subject 里重复风格块的内容（等距/白底/光位） | 重复权重会让模型过度响应，出图变"图鉴封面"而不是设备图 |

---

## 6. 从文档到名单：一个可复用的提炼动作

拿到一份工艺说明，按这个顺序切：

1. **找工段**：文档里的章节标题通常就是工段（配料/挤出/过滤/铸片/拉伸/检测/收卷）。
2. **每段找"单位设备"**：一台机器干一件事。一段里如果写了三台设备，就是三个条目。
3. **每台写"在干什么"**：一句话，动词开头（把切片熔成熔体 / 把熔体摊成厚片 / 把厚片拉长）。
4. **标"可数特征"**：几根辊、几道门、几个腔、几排灯——数字是提示词里最硬的锚。
5. **标"必露内部"**：只有流道/腔体/绕组这类"不看内部就不知道是什么"的才剖切。

做完这五步，`subject_3d` 基本就是把这些句子翻译成英文名词短语。
