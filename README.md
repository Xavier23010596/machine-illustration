# machine-illustration · 工业设备科研插图提示词工程

> 把一台机器变成成套的、风格统一的、可以直接生图的英文提示词。
> 输入一份工艺文档或一张设备清单，输出 15 台设备能拼进同一张版的提示词包。

这是一个 **Agent Skill**（`SKILL.md` + 参考文档 + 校验脚本）。它不负责"想出好看的图"，
它负责**让一批图看起来是同一天、同一个人、同一套标准做出来的**——这才是产线图鉴、论文附图、
技术白皮书配图真正难的地方。

---

## 免责声明

请在下载或使用前读完这一段。

- 本项目是**提示词方法论的整理**，**不是**任何厂商、机构、平台或软件产品的官方项目，
  与其没有隶属、合作或背书关系。
- `examples/bopet/` 的案例依据**公开的产线工艺资料**（工序、设备功能、参数口径）整理；
  其中设备外形描述是按工艺与常见机型**重建的示意**，**不对应任何具体厂商的机型**。
- 本仓库**不包含任何第三方照片、工程图纸、宣传素材或其片段**。所有风格块、模板、句式均为本项目自写。
- 使用本项目产出的图像，其**版权、商用合规、是否涉及他人在先权利**，由使用者自行判断并承担全部责任；
  本项目不就生成结果的准确性、可用性作任何担保。
- 本项目**不承诺**生成结果准确反映真实设备结构。需要精确工程表达时，请使用 CAD 与厂商正式资料。

---

## 它解决什么问题

产线示意图翻车，八成不是"模型不行"，是这三个死因：

| 死因 | 症状 | 本项目的对策 |
|---|---|---|
| **画风漂移** | 一套 15 张，张张风格不同，拼版像拼贴 | 四套**风格锚块**逐字复用，一个字不改（`references/02`） |
| **图内冒字** | 图里出现歪字母、假徽标、乱编号 | **图内零文字**，名称/序号/箭头全部后期叠加 |
| **画成另一台** | 挤出机被画成注塑机、拉幅机被画成隧道炉 | 每台写一句**识别特征句**，并在负向词里点名"最容易被误认成的那台" |

第三点是本项目最核心的资产：从 24 条翻车修法里提炼出的**六个可套句式**
（比例 / 独有构件 / 成对构件 / 材质后果 / 分段 / 负向式），换任何机器都能往里填。

---

## 能力

### 五步流程（每步有 gate）

| 步骤 | 做什么 | 过门条件 |
|---|---|---|
| 1 建清单 | 从工艺文档或口述里提炼设备表 | 每台都有 id / 双名 / 工段 / 点缀色 / 双 Subject / 误认负向词 |
| 2 选风格 | 在 3D、线稿、爆炸、剖切里挑 1–2 种 | 全系列 ≤3 种；剖切只给关键 2–3 台 |
| 3 写 Subject | 四段式 + 一句识别特征 | 三段齐全、比例句必写、无形容词堆砌 |
| 4 批量出图 | 锚点链 + 挑图 5 条 | 锚点图先定稿，其余以它为参考图（权重 0.4–0.6） |
| 5 标注与总图 | 文字后期叠加 | 图内零文字，标注方案单列 |

### 四套风格块

| 代号 | 风格 | 什么时候用 |
|---|---|---|
| `S1` | 等距 3D 白底 | 默认；单机图鉴、论文装置图 |
| `S2` | 专利线稿 | 要和 3D 配成对，或要黑白印刷 |
| `S3` | 爆炸图 | 讲"由哪些件组成、怎么装" |
| `S4` | 剖切 | 讲内部流道、腔体、传动路径 |
| `N` / `P` | 负向 / 配色句 | 与上面任意一套搭配 |

风格块存放在 `references/02-style-blocks.md`，是**唯一真源**：脚本从它解析拼装，
不存在"文档一套、产物另一套"。

### 触发词

在对话里说到下面任一情形即可触发：

`设备示意图` `机械插图` `产线示意` `科研绘图` `等距 3D` `专利线稿` `爆炸图` `剖切图`
`machine illustration` `isometric equipment render`

也接受意图式触发：「给这批设备出一套风格统一的图」「把这篇工艺说明变成设备清单」
「要 3D 图配线稿图」「做一张多设备产线总示意」。

---

## 快速开始

### 依赖

**只有一个：Node.js ≥ 18。** 无 npm 依赖、无网络请求、无第三方包。
脚本用的是 Node 内置 `fs` / `path`，`node scripts/...` 直接跑。

出图环节需要你自己有生图通道（任意支持"参考图 + 负向词"的模型都可以）；
本项目不内置、不代理、不收取任何 API。

### 三步跑通

```bash
# 1. 拿案例清单当模板，改成你的设备
cp examples/bopet/inventory.json my-inventory.json

# 2. 先校验（不发图，只查字段与写法）
node scripts/build-prompt-pack.mjs --in my-inventory.json --check

# 3. 生成提示词包：人读 md + 机读 json + 出图登记表
node scripts/build-prompt-pack.mjs --in my-inventory.json --out out/
```

需要拆成一条一个 txt（便于批量喂平台）：

```bash
node scripts/build-prompt-pack.mjs --in my-inventory.json --out out/ --styles 3d,cut --split
```

`--styles` 可选 `3d,line,exploded,cut` 任意组合，默认 `3d,line`。

### 作为 Agent Skill 安装

```bash
git clone <THIS_REPO> machine-illustration
mkdir -p ~/.claude/skills/machine-illustration
cp -r machine-illustration/SKILL.md machine-illustration/references machine-illustration/scripts \
      ~/.claude/skills/machine-illustration/
```

Windows（PowerShell）：

```powershell
git clone <THIS_REPO> machine-illustration
$dest = "$env:USERPROFILE\.claude\skills\machine-illustration"
New-Item -ItemType Directory -Force $dest
Copy-Item .\machine-illustration\SKILL.md,.\machine-illustration\references,.\machine-illustration\scripts $dest -Recurse
```

装好后直接说：「用 machine-illustration 给这条产线出一套等距 3D 设备图」。

---

## 目录结构

```
SKILL.md                        五步流程 + 9 条质量门 + 失败处理
references/
  01-visual-dna.md              六层视觉 DNA，以及换领域时改什么、不改什么
  02-style-blocks.md            风格块唯一真源（S1/S2/S3/S4/N/P）
  03-prompt-template.md         清单 schema + Subject 四段模板 + 识别特征句 6 句式
  04-palette-and-labels.md      配色三硬规则 + 标注元素与字号阶梯
  05-failure-fixes.md           24 条翻车：现象 → 根因 → 改正文还是改负向
  06-poster-layout.md           16:9 总图分区 + 列宽公式（任意台数）
  07-image-generation.md        锚点链、参考图权重、挑图、重试、联系表 QA
scripts/
  build-prompt-pack.mjs         清单 → 提示词包（校验 + 展开 + 登记表 + 拆分）
examples/bopet/                 15 台设备 / 30 条成品提示词 / 出图登记表
```

---

## 一段真实的成品提示词

这是 `examples/bopet/prompt-pack.md` 里 D03（单螺杆挤出机）的 3D 段，可直接对照写法：

```text
Subject: a large single-screw plastics extruder for film production: a horizontal barrel about
8 meters long with five hinged heating-jacket covers in a row along its length, a bulky
rectangular gearbox and a TEFC drive motor at the right end, a stainless feed hopper with a
slide gate on the left top, a vacuum vent port on top of the barrel with a small condenser, two
rigid insulated melt pipes leaving the discharge end, ...
proportional character: long and low, roughly 6 times longer than it is tall.
```

注意三件事，缺一个就会翻车：

1. 开头是**名词短语定义**（`a large single-screw plastics extruder for film production`），不是形容词堆砌；
2. `five hinged heating-jacket covers in a row` 是**独有构件**——模型据此区分它和注塑机；
3. `long and low, roughly 6 times longer than it is tall` 是**比例句**——不写就会被画成高胖机身。

> 本项目**不内置出图预览**，因为效果取决于你用的模型。想看出图长什么样，用上面这段去跑一张最快。

---

## 已知限制

- **不生成图。** 它产出提示词，出图靠你的模型；没有出图通道时只交付提示词包，不会假装出过图。
- **不保证结构准确。** 提示词是对外形语言的约束，不是工程图；关键尺寸、公差、装配关系请用 CAD。
- **S3 爆炸图 / S4 剖切是推导出来的风格块**，比 S1/S2 更依赖模型能力。首次使用建议先拿一台试跑。
- **不做精确复刻。** 不能"照着这张厂商照片一模一样地画"——那既不可控，也容易踩到他人权利。
- **总图排版是指导而非代码。** `references/06` 给的是分区、列宽公式与箭头规范，落地仍需在 PPT/Figma 里排。

---

## 开源协议

[MIT](LICENSE)。可商用、可修改、可再分发，保留版权声明即可。

**协议不覆盖**：第三方商标、产品外观设计、以及用这些提示词生成的图像（那部分归你和你所用模型的条款管）。

---

## 贡献

欢迎补风格块、补翻车案例、补校验规则。提 PR 前请读 [CONTRIBUTING.md](CONTRIBUTING.md)。

四条红线：不改风格块措辞而不说明理由 / 不引入前端框架或在线字体 /
不提交第三方照片或图纸 / 提交前 `--check` 必须零错误。

- 报 Bug → [Issue 模板](.github/ISSUE_TEMPLATE/bug_report.yml)
- 提需求 → [Issue 模板](.github/ISSUE_TEMPLATE/feature_request.yml)
- 安全问题 → 见 [SECURITY.md](SECURITY.md)，**不要开公开 Issue**
