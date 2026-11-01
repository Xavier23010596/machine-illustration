# 翻车库：现象 → 根因 → 改哪里

> 先看第一节的判定规则。**大部分翻车不该靠堆负向词解决**，改错地方会越改越糟。

---

## 0. 先判断：改正文，还是改负向？

| 现象 | 改哪里 |
|---|---|
| 画成了**另一台机器** | 改 **Subject**（补识别特征句）+ 负向点名那台机器 |
| 画的是对的东西，但**风格不对**（透视/背景/光位/材质） | 改 **风格块**——但先确认你没有私自改过它 |
| 画的是对的东西，但**多了不该有的元素**（字/人/道具/第二台机器） | 改 **负向词** |
| 结构对但**比例不对**（胖/瘦/长/短） | 改 **Subject 的比例句** |
| 只有局部崩（一个零件化了） | **改，或者砍**——把部件数减到 5 个以内，别指望模型画对复杂件 |

一句话：**负向词管"别出现什么"，Subject 管"必须出现什么"。** 混用是最大的时间浪费。

---

## 1. 结构类（最致命）

| # | 现象 | 根因 | 修法 |
|---|---|---|---|
| 1 | 挤出机画成注塑机 / 3D 打印机 | 缺"长而低"的比例暗示 | Subject 加 `proportional character: long and low, roughly 6 times longer than it is tall`；负向加 `injection molding machine, 3D printer` |
| 2 | 拉幅机画成隧道炉 / 传送带 | 没写链夹与 V 形导轨 | 强调 `two endless chain rails diverging in a V shape, clip units gripping the film edges`，并给剖切 |
| 3 | 冷鼓画成烘缸 / 卷纸机 | 没写镜面镀铬与静电吸附 | `mirror-finish chrome-plated roll` + `electrostatic pinning bar with a thin electrode wire` |
| 4 | 模头画成一块铁疙瘩 | 没写内部流道 | 必须剖切 + `coat-hanger-shaped manifold channel narrowing toward the die lip` |
| 5 | 扫描架画成安检门 / 门框 | 只有上梁没有下梁 | `a top beam and a matching bottom beam forming a closed O-frame`；或反向写 `no bottom beam` 用于另一种机 |
| 6 | 两台相似设备（收卷 vs 分切）画混 | 只写了共同点 | 写各自**独有构件**：收卷=`two winding shafts on a rotating turret`；分切=`a shaft with multiple circular shear blades` + 多个同径小卷 |
| 7 | 机器变成"几个方块堆起来" | 部件之间没有位置关系 | 每个部件加位置词：`at the right end` / `on the left top` / `underneath` / `side by side` |
| 8 | 出现第二台机器或合体怪 | 描述里塞了两台 | 拆成两张图；负向加 `multiple machines, duplicated parts` |
| 9 | 零件重复/镜像错乱 | 模型对称性偏好 | 负向加 `duplicated parts, mirrored assemblies`；Subject 里明确"one ..." |

---

## 2. 风格类

| # | 现象 | 根因 | 修法 |
|---|---|---|---|
| 10 | 出现三点透视，多张拼不齐 | 风格块的视角三句被删了一句 | 检查 `isometric ... orthographic ... 35 degrees` 三句是否都在；不要自己"优化"措辞 |
| 11 | 白底变浅灰 / 带渐变 / 有影棚布 | 模型默认给 backdrop | 负向加 `gradient background, studio backdrop, vignette, floor, horizon line` |
| 12 | 出现地面线、地面反射 | 缺"无地面"声明 | 风格块里 `no floor, no horizon line` 必须在；负向再加 `reflective floor, cast shadow on floor`（但保留 `one soft contact shadow`，这是有意要的） |
| 13 | 画面变电影感 / 广告感 | 混入 `cinematic, dramatic, volumetric, rim light` | 从 Subject 里删掉这些词；负向加 `cinematic lighting, dramatic lighting, bloom, lens flare` |
| 14 | 车漆/机壳变彩色或金属镜面 | 配色句位置太笼统 | 配色句写具体位置，且**必须保留** `less than 10% ... the housing stays matte white` |
| 15 | 图变 3D 卡通 / 低模 / 玩具 | 风格漂移 | 负向加 `low-poly, cartoon, plastic toy look`；并检查是否漏了 `photoreal product-visualization quality` |
| 16 | 边缘糊 / 局部虚化 | 景深 | 负向加 `shallow depth of field, bokeh, blur`；保留 `everything in focus` |

---

## 3. 文字类（最容易被忽视）

| # | 现象 | 根因 | 修法 |
|---|---|---|---|
| 17 | 图上冒出歪歪扭扭的字母 | 负向没生效或位置太后 | **负向第一位必须是** `text, letters, typos`；仍出现就加 `typography, caption, label, signage` |
| 18 | 出现品牌徽标 / 铭牌 | 模型对工业品有品牌先验 | 负向加 `logo, brand name, nameplate, badge, serial number` |
| 19 | 屏幕上出现 UI | 屏幕默认被"点亮" | Subject 写 `a blank screen` / `a dark blank display`；负向加 `UI, interface, chart on screen` |

---

## 4. 成套一致性类

| # | 现象 | 根因 | 修法 |
|---|---|---|---|
| 20 | 15 张风格不统一 | 只用了文字后缀，没垫参考图 | 用锚点图做参考图（权重 0.4–0.6）+ 风格块逐字复用，两个都要 |
| 21 | 参考图把别的机器特征带进来 | 权重过高 | 权重降到 0.4；或改建锚点图（选结构最中性的一台） |
| 22 | 同一台两次出图差很多 | seed 未固定 | 固定 seed；把 seed 记进 `manifest.json` |
| 23 | 每张的"上表面"朝向不一致 | 仰角不同 | 检查每张的 `35 degrees`；参考图权重太低时也会漂，提到 0.5–0.6 |
| 24 | 剖切图里出现剖面线（hatching） | 工程制图语汇污染 | 风格块 `no hatching, no section lines` 必须在；剖面用 `uniform flat mid-grey` |

---

## 5. 三次仍不过怎么办

同一个问题改 3 次还不过，**不要继续加词**。按顺序降级：

1. **砍部件**：把 Subject 的部件从 9 个砍到 5 个，先保轮廓与识别特征。细节用第二张图（爆炸/剖切）补。
2. **换锚点**：用另一台结构更中性的机器重做锚点图。
3. **换风格**：这台改用线稿 `S2`。线稿对结构关系的容错比 3D 高，且不怕材质跑偏。
4. **承认边界**：写进交付说明"该台机器 AI 无法准确还原内部结构，建议用实拍/自绘补图"。
   —— 这一条比硬凑一张错的图专业得多。
