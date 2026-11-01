# Changelog

本项目的所有重要变更都会记录在此文件。
格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

（暂无）

## [1.0.0] - <YEAR>-<MM>-<DD>

首个公开版本，从一次真实交付（BOPET 双向拉伸薄膜产线 · 15 台设备插图）反向整理。

### Added

- **`SKILL.md`**：五步流程（建清单 → 选风格 → 写 Subject → 批量出图 → 标注），每步带 gate；
  两条不可协商硬规则（图内零文字、风格块逐字复用）；9 条交付质量门；失败处理表。
- **`references/01-visual-dna.md`**：六层视觉 DNA（等距正交 / 纯白无环境 / 哑光白壳 / 点缀色 <10% /
  柔光无透视 / 无景深），以及换领域（半导体、医疗、实验仪器）时改什么、不改什么。
- **`references/02-style-blocks.md`**：风格块**唯一真源**——`S1` 等距 3D 白底、`S2` 专利线稿、
  `S3` 爆炸图、`S4` 剖切、`N` 负向、`P` 配色句；脚本从此文件解析，不存在第二份副本。
- **`references/03-prompt-template.md`**：清单 JSON schema；Subject 四段模板逐句拆解；
  **识别特征句 6 个可套句式**（比例 / 独有构件 / 成对构件 / 材质后果 / 分段 / 负向式）；十条禁令。
- **`references/04-palette-and-labels.md`**：配色三硬规则（占比 <10%、同色 ≤3 台、同段同色）；
  标注元素与字号阶梯。
- **`references/05-failure-fixes.md`**：24 条翻车记录，每条给"现象 → 根因 → 该改正文还是改负向"的判定。
- **`references/06-poster-layout.md`**：16:9 总图分区、任意台数的列宽公式、≤5 类箭头体系。
- **`references/07-image-generation.md`**：锚点链五步、参考图权重 0.4–0.6、挑图 5 条、重试上限 3 次、
  联系表一致性 QA、`manifest.json` 登记项。
- **`scripts/build-prompt-pack.mjs`**：清单 → 提示词包。内置校验（hex 合法性、id 重复、
  Subject 含中文、词数不足、缺识别特征句、缺误认负向词、风格与机器能力不匹配），
  输出 `prompt-pack.md` + `prompt-pack.json` + `manifest.json`，支持 `--split` 与 `--styles`。
- **`examples/bopet/`**：15 台设备的完整清单、30 条成品提示词、出图登记表、案例导读。
- **开源配套**：`README.md`（中文，含免责声明）、MIT `LICENSE`、`.gitignore`、`.gitattributes`（统一 LF）、
  `CONTRIBUTING.md`、`CODE_OF_CONDUCT.md`、`SECURITY.md`、Issue / PR 模板。

### Known limitations

- 不出图。效果依赖使用者自己的生图通道。
- `S3` / `S4` 由 `S1` 的视觉 DNA 推导而来，未经过与原手册同等规模的实跑验证。
- 总图排版给的是规范与公式，不含可直接运行的排版代码。
- 示例中的设备外形为按工艺重建的示意，不对应任何厂商机型。
