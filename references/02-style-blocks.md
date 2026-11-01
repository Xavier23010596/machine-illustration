# 风格块库（唯一真源）

> 这份文件是**全项目唯一的风格文本来源**。`scripts/build-prompt-pack.mjs` 直接从这里解析
> `### [ID]` 下面的代码块来拼装提示词包——所以**改这里就等于改全部产物**，不要在别处复制粘贴。
>
> 规则只有一条：**同一个系列里，风格块逐字复用，一个字都别改。**
> 你可以改 Subject（每台机器不同），但不能改风格块——改了，这批图就拼不成一张版。

四个风格 ID：

| ID | 用途 | 什么时候用 |
|---|---|---|
| `S1` | 等距 3D 白底（主风格） | 默认。所有单机图的第一选择 |
| `S2` | 专利线稿（黑白） | 需要印刷/黑白页、或要和 3D 图配成对 |
| `S3` | 爆炸图 | 要讲"由哪些件组成、怎么装" |
| `S4` | 剖切/剖面 | 要讲内部流道、腔体、绕组、传动路径 |
| `N` | 通用负向词 | 每次都带，不可省 |
| `P` | 配色句模板 | 接在 Subject 末尾，`{ACCENT}`/`{HEX}` 由清单填 |

---

### [S1] 等距 3D 主风格（默认）

```
isometric 3D render in axonometric projection, orthographic camera, no perspective distortion,
view from 35 degrees above the horizon; single machine isolated on seamless pure white
background (#FFFFFF), no floor, no horizon line, no environment; matte white powder-coated
sheet-steel panels with anodized aluminum trim, brushed stainless steel, dark charcoal rubber
and cable details; soft large overhead softbox light from the upper left, gentle fill from the
lower right, subtle specular highlights on metal edges, soft ambient occlusion, one soft
contact shadow directly beneath the machine; high-key, clean, evenly exposed, crisp edges, no
depth-of-field blur, everything in focus; photoreal product-visualization quality, technical
white-paper illustration style, 8k, ultra detailed; centered composition with 8% empty margin
on all sides; no text, no letters, no numbers, no labels, no logos, no watermark, no people,
no props; square 1:1 aspect ratio
```

**逐句在控制什么（改之前先读这段）**

| 句子 | 控制 | 删掉的后果 |
|---|---|---|
| `isometric ... orthographic ... 35 degrees` | 三句一起锁视角 | 少一句就出三点透视图，多张图拼版必歪 |
| `single machine isolated on seamless pure white` | 背景 | 背景跑出厂房、地面线、渐变灰 |
| `matte white powder-coated ... anodized aluminum` | 材质基调 | 改成以不锈钢为主＝另一种更冷更硬的风格 |
| `soft overhead softbox ... one soft contact shadow` | 光位唯一 | 出现 dramatic / rim light / volumetric 就变电影感 |
| `high-key ... everything in focus` | 曝光与景深 | 出现虚化，拼版时对不齐 |
| `no text ...` | 防乱码字 | 这是最关键的一句，必须留 |

### [S2] 专利线稿

```
technical patent-style line drawing, black ink on pure white, uniform single-weight black
outlines, fine stippling and sparse cross-hatching only for shading, no color, no gradients,
no rendering, no background; orthographic isometric view, 30-degree axonometric; every major
component clearly outlined and dimensionally coherent, hidden internal parts indicated with
dashed lines, clean schematic clarity; pure black and white only, high resolution 8k;
no text, no letters, no numbers, no labels, no watermark; square 1:1 aspect ratio
```

> 与 `S1` 的差别只有三处：线替代面、隐藏件用虚线、去色。**视角角度故意差 5°**（30° vs 35°），
> 这样读者一眼能分出"这是线稿版"而不是"渲染失败的 3D 图"。

### [S3] 爆炸图

```
isometric 3D exploded view in axonometric projection, orthographic camera, no perspective
distortion, view from 35 degrees above the horizon; the machine is disassembled along a single
main axis with equal gaps between parts, all parts kept coaxially aligned on one centerline,
the assembly order readable from bottom to top; single assembly isolated on seamless pure white
background (#FFFFFF), no floor, no horizon line, no environment; matte white powder-coated
sheet-steel panels with anodized aluminum trim, brushed stainless steel, dark charcoal rubber
and cable details; soft large overhead softbox light from the upper left, gentle fill from the
lower right, soft ambient occlusion, one soft contact shadow beneath the whole assembly;
high-key, clean, evenly exposed, crisp edges, no depth-of-field blur, everything in focus;
photoreal product-visualization quality, technical white-paper illustration style, 8k, ultra
detailed; centered composition with 8% empty margin on all sides; no leader lines, no callout
arrows, no text, no letters, no numbers, no labels, no logos, no watermark, no people;
square 1:1 aspect ratio
```

**三条硬约束**

1. `along a single main axis` —— 沿一条主轴拆，不要四散飞开。四散就失去"装配顺序"的信息。
2. `equal gaps` + `coaxially aligned` —— 等距、同轴。间距不统一，读者会以为距离有含义。
3. `no leader lines, no callout arrows` —— 引线与编号**后期加**。让模型画引线必歪。

### [S4] 剖切 / 剖面

```
isometric 3D cutaway render in axonometric projection, orthographic camera, no perspective
distortion, view from 35 degrees above the horizon; the housing is cut open with one clean
quarter-section, the cut faces finished in a uniform flat mid-grey tone so the section reads as
solid material, internal cavities, channels and moving parts fully exposed and structurally
coherent, hidden internal passages suggested by smooth continuous surfaces; single machine
isolated on seamless pure white background (#FFFFFF), no floor, no horizon line, no environment;
matte white powder-coated sheet-steel panels with anodized aluminum trim, brushed stainless
steel, dark charcoal rubber and cable details; soft large overhead softbox light from the upper
left, gentle fill from the lower right, soft ambient occlusion inside the cut, one soft contact
shadow beneath the machine; high-key, clean, evenly exposed, crisp edges, no depth-of-field
blur, everything in focus; photoreal product-visualization quality, technical white-paper
illustration style, 8k, ultra detailed; centered composition with 8% empty margin on all sides;
no hatching, no section lines, no text, no letters, no numbers, no labels, no logos,
no watermark, no people; square 1:1 aspect ratio
```

**两条硬约束**

1. `one clean quarter-section` —— 只剖一刀、标准四分之一。剖两刀会露出不必要的内部件，画面变乱。
2. `uniform flat mid-grey` 且 `no hatching` —— 剖面用**平灰**而不是剖面线；剖面线是工程制图语汇，
   在 3D 渲染里会让模型画出一堆乱线。

### [N] 通用负向词

```
text, letters, typos, watermark, signature, logo, brand name, human hands, people, clutter,
messy background, gradient background, colored background, studio backdrop, multiple machines,
duplicated parts, distorted geometry, warped panels, melted edges, floating parts, impossible
mechanism, low-poly, cartoon, sketch, painting, blurry, shallow depth of field, bokeh,
oversaturated, neon, rainbow colors, plastic toy look, sci-fi fantasy
```

负向词覆盖三类翻车，别只盯着"画风"：

| 类别 | 词 | 对应现象 |
|---|---|---|
| 背景跑偏 | `gradient background`, `colored background`, `studio backdrop` | 白底变灰、带渐变或影棚布 |
| 结构崩坏 | `warped panels`, `impossible mechanism`, `duplicated parts`, `floating parts` | 板件扭曲、机构不可能、零件重复 |
| 风格跑偏 | `cartoon`, `painting`, `plastic toy look`, `sci-fi fantasy` | 变插画、变玩具、变科幻 |

**按机器追加**（写在 `N` 之后，不要替换 `N`）：把"最容易被误认成的那台机器"加进去，例如
`injection molding machine, 3D printer` / `tunnel kiln, conveyor belt` / `security gate, door frame`。
这一招比反复改 Subject 有效得多。

### [P] 配色句模板

```
Accent color: {ACCENT} ({HEX}) applied only to the frame, hand-wheel valves and a few small
indicator lights, occupying less than 10% of the visible surface; the housing stays matte white.
```

- `{ACCENT}` 填颜色英文名（`teal` / `amber` / `violet`…），`{HEX}` 填 `#0FA3A3` 这类值。
- 三个位置（机架 / 阀门手轮 / 指示灯）是**默认位**，可按机器改成该机最合理的三个小面积位置
  （例如拉幅机改成 `oven door handles and chain-rail covers`）。
- 只有一句硬约束不能变：**`less than 10% of the visible surface; the housing stays matte white`**。
  超过 10% 机身就会被染色，整套图就不再是"白机 + 点缀"的统一语言。
