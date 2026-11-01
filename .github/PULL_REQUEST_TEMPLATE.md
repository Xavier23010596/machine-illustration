# Pull Request

## 这个 PR 做了什么

<!-- 一句话。例：新增 S5 半透明壳体风格块，解决压力容器看不到管程的问题 -->

## 类型

- [ ] 新增风格块
- [ ] 修改现有风格块（**必须**标 BREAKING 并说明理由）
- [ ] 新增 / 调整校验规则
- [ ] 文档补充或修正
- [ ] 脚本能力
- [ ] 示例设备补充

## 影响的文件

<!-- 勾选实际改动的，没改的留空 -->

- [ ] `SKILL.md`
- [ ] `references/02-style-blocks.md`（唯一真源，改动会穿透全仓）
- [ ] `references/03-prompt-template.md`
- [ ] `references/05-failure-fixes.md`
- [ ] `scripts/build-prompt-pack.mjs`
- [ ] `examples/bopet/`
- [ ] 其他：<!-- 说明 -->

## 为什么这么改

<!-- 不要只写"优化了措辞"。要写：原措辞会导致什么具体错误，新措辞压住了哪个错误倾向 -->

### 改前会错在哪

<!-- 例：用 S1 时模型把压力容器的封头画成平的，因为描述里没约束曲面 -->

### 改后压住了什么

<!-- 例：S5 明确要求 ellipsoidal heads，并加负向 flat end cap -->

## 如果是风格块改动

- [ ] 已在 PR 标题或正文标注 `BREAKING`
- [ ] 已同步 `SKILL.md` 中引用该块的位置
- [ ] 已在 `CHANGELOG.md` 的 `[Unreleased]` 下记录，并说明对存量提示词的影响
- [ ] 已确认现有 15 台示例重新生成后仍能通过 `--check`

## 验证

粘贴实际运行的输出，不要只写"测试通过"。

```text
$ node --check scripts/build-prompt-pack.mjs
（输出）

$ node scripts/build-prompt-pack.mjs --in examples/bopet/inventory.json --check
（输出：X 台 / Y 条 / 0 错误）
```

## 红线确认

- [ ] 未新增任何依赖、未发任何网络请求
- [ ] 未包含第三方照片、图纸、宣传素材或商标
- [ ] 新增示例设备为按工艺重建的示意，已注明"不对应具体机型"
- [ ] 文件为 UTF-8、LF 换行、无制表符（`.gitattributes` 已固定）
- [ ] 若改了校验规则，已附**能抓出错误**的负向用例（不只是"跑通了"）
