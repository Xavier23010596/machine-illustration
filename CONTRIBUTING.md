# 贡献指南

感谢愿意补一块。本项目最需要三类贡献：**新风格块**、**新的翻车案例**、**校验规则**。

---

## 一、四条红线

1. **不擅自改风格块措辞。** `references/02-style-blocks.md` 是唯一真源，改一个字，
   全世界的存量提示词就与新版本不一致。必须改时，在 PR 里说明"为什么原措辞会导致什么具体错误"，
   并在 CHANGELOG 标 `BREAKING`。
2. **不引入依赖。** 不装 npm 包、不加框架、不加在线字体、不发网络请求。
   脚本只允许用 Node 内置模块（`fs` / `path` / `url`）。
3. **不提交第三方素材。** 厂商照片、工程图纸、宣传图、产品渲染图一律不收，连"参考一下"都不行。
   要说明某台设备长什么样，用文字描述构件。
4. **提交前 `--check` 必须零错误。** 见下方验证步骤。

---

## 二、开发环境

只需要 Node.js ≥ 18，不需要 `npm install`。

```bash
git clone https://github.com/Xavier23010596/machine-illustration.git machine-illustration
cd machine-illustration
node --version          # 应 >= v18
node scripts/build-prompt-pack.mjs --in examples/bopet/inventory.json --check
```

预期输出：15 台 / 30 条，0 错误。若有 warning，逐条确认是否合理。

---

## 三、本地验证（提交前必做）

```bash
# 1. 语法
node --check scripts/build-prompt-pack.mjs

# 2. 案例校验
node scripts/build-prompt-pack.mjs --in examples/bopet/inventory.json --check

# 3. 四风格展开
node scripts/build-prompt-pack.mjs --in examples/bopet/inventory.json --out /tmp/pack --styles 3d,line,exploded,cut --split

# 4. 负向测试：故意写坏，确认能被抓出来
node -e '
const inv={project:"t",styles:["3d"],machines:[
 {id:"X1",name_zh:"泵",hex:"#12",subject_3d:"a pump",subject_line:"x"}]};
require("fs").writeFileSync("/tmp/bad.json",JSON.stringify(inv));'
node scripts/build-prompt-pack.mjs --in /tmp/bad.json --check   # 应报错退出，非零
```

第 4 步是关键：校验器的价值在于**能抓错**，不是"跑通了"。

---

## 四、加一套新风格块

以加 `S5`（例如"半透明壳体"）为例：

1. 在 `references/02-style-blocks.md` 里按现有格式新增：

   ```markdown
   ### [S5] 半透明壳体
   （一句话说明它解决什么问题、什么场景用）
   ```text
   （风格块正文，必须以 no text, no letters, no numbers 结尾）
   ```
   ```

2. 在 `scripts/build-prompt-pack.mjs` 的 `STYLE_MAP` 里注册 `s5`；
3. 在 `examples/bopet/inventory.json` 里至少补 2 台的对应字段；
4. 在 `SKILL.md` 的 Step 2 表格中加一行；
5. 跑第三节的四步验证；
6. PR 描述里附**至少两组**对照说明：用 `S1` 会错在哪、用 `S5` 修正了什么。

> 不要求你贴出图（那涉及你的平台账号），但必须说清"它压住了哪个具体的错误倾向"。

---

## 五、加一条翻车案例

写进 `references/05-failure-fixes.md`，格式固定三段：

| 字段 | 要求 |
|---|---|
| 现象 | 只说看到什么，不解释（"挤出机被画成高胖机身"） |
| 根因 | 模型先验里的哪一类设备覆盖了你的描述 |
| 修法 | **明确写"改正文"还是"改负向"**，并给出改后的原句 |

只写"现象 + 重新生成试试"的 PR 会被退回——那样的条目没有迁移价值。

---

## 六、提交规范

采用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

```
feat(references): 新增 S5 半透明壳体风格块
fix(scripts): 修正 hex 校验对小写字母的误判
docs(skill): 补充剖切只给 2-3 台的判定标准
test: 增加 id 重复的负向用例
```

- 一个 PR 只做一件事。顺手重排全文、改空白、换标点请单独提。
- 提交信息用中文或英文都可以，但同一 PR 内保持一致。

---

## 七、PR 自检清单

复制到 PR 描述里逐条勾：

- [ ] `node --check scripts/build-prompt-pack.mjs` 通过
- [ ] `--check` 对 `examples/bopet/inventory.json` 零错误
- [ ] 若改了风格块：已在 PR 说明改动的具体理由，并标 `BREAKING`
- [ ] 若改了风格块：`SKILL.md` 与 `references/` 中引用该块的地方已同步
- [ ] 未新增任何依赖、未发任何网络请求
- [ ] 未包含第三方照片 / 图纸 / 商标 / 厂商机型名
- [ ] 新增示例设备为按工艺重建的示意，已在描述中注明"不对应具体机型"
- [ ] 文件为 UTF-8、LF 换行、无制表符
- [ ] 已在 CHANGELOG 的 `[Unreleased]` 下补一条

---

## 八、发布流程（维护者）

```bash
# 1. 确认干净
git status

# 2. 版本号三处同步：SKILL.md frontmatter / CHANGELOG / git tag
#    例：1.0.0 -> 1.1.0

# 3. 打 tag 并推送
git tag -a v1.1.0 -m "v1.1.0"
git push origin main --tags
```

发版后到 Releases 页面用 CHANGELOG 对应段落写说明——别人引用"我用的哪个版本"时才有着落。

---

## 九、行为准则

参与本项目即视为同意 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。
