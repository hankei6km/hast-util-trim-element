# hast-util-trim-element

`Element`(主に `<p>` を想定)から先頭と末尾の空白や改行(含む `<br>`)などを削除する hast ユーティリティ.

## Install

```sh
npm install @hankei6km/hast-util-trim-element
```

## Usage

```js
import { h } from 'hastscript'
import { toHtml } from 'hast-util-to-html'
import { trimElement } from '@hankei6km/hast-util-trim-element'

const tree = h('p', [{ type: 'comment', value: 'コメント' }, '\u00A0\u00A0\u00A0\u00A0', h('span', []), '   ', h('br'), h('strong', '  \u3000あいうえお'), h('br'), 'かきくけこ', h('br'), h('strong', ['さしすせそ   ']), h('br'), '   '])

console.log(toHtml(tree))

trimElement(tree)

console.log(toHtml(tree))
```

yield:

```html
<p><!--コメント-->    <span></span>   <br><strong>  　あいうえお</strong><br>かきくけこ<br><strong>さしすせそ   </strong><br>   </p>
<p><!--コメント--><strong>あいうえお</strong><br>かきくけこ<br><strong>さしすせそ</strong></p>
```

## API

### `trimElement(element, [options])`

`element` 内の先頭または末尾の空白や改行を削除する。`element` は `hast` の `Element` ノードまたは `Element['children']` の配列。

#### `options.recursiveTagNames`

`element` 内の子ノードで `options.recursiveTagNames` に含まれるタグ名を持つ要素があった場合、その子要素も再帰的にトリムする、`null` で全て無視(`RegExp` または `hast-util-is-element` の [`Test`](https://github.com/syntax-tree/hast-util-is-element?tab=readme-ov-file#test)、デフォルトは `/^(a|strong|em|span|del|u|s|b|sub|sup)$/iu`)。

#### `options.trimExistingEmptyText`

`element` 内の子ノードをトリムする際に、既に空のテキストノード(`{"type": "text", "value": ""}`)もトリムするか？しない場合はそこで処理を停止する(`boolean`、デフォルトは `true`)。

#### `options.trimExistingEmptyElement`

`element` 内の子ノードをトリムする際に、既に空の要素もトリムするか？しない場合は空の要素を残して処理を継続する(`boolean`、デフォルトは `true`)。

#### `options.trimBecameEmptyElement`

`element` 内の子ノードをトリムする際に、再帰的なトリムにより空になった要素もトリムするか？しない場合は空の要素を残して処理を継続する(`boolean`、デフォルトは `true`)。

#### `options.startFilter`

`element` 内の先頭からトリムする際に、挙動をカスタマイズするためのフィルター。

##### `startFilter` のフィールド

- `trimTextMatcher`: 先頭のテキストノードからトリムするテキストを決定するマッチャー(`RegExp`、デフォルトは `/^\s+/u`)。
- `trimTagNameMatcher`: 先頭の`element`ノードをトリムするかを決定するマッチャー、`null` で全て無視(`RegExp` または `hast-util-is-element` の [`Test`](https://github.com/syntax-tree/hast-util-is-element?tab=readme-ov-file#test)、デフォルトは `/^br$/iu`)。
- `stopTagNameMatcher`: 先頭の`element`ノードを見つけた際に、トリムを停止するかを決定するマッチャー、`null` で全て無視(`RegExp` または `hast-util-is-element` の [`Test`](https://github.com/syntax-tree/hast-util-is-element?tab=readme-ov-file#test)、デフォルトは `/^(img|hr|input|meta|link|area|base|col|embed|source|track|wbr)$/iu`)。他の条件より優先される(例: 子要素が 0 個は継続されるが、`stopTagNameMatcher` にマッチした場合は処理が停止される)。

#### `options.endFilter`

`element` 内の末尾からトリムする際に、挙動をカスタマイズするためのフィルター。

##### `endFilter` のフィールド

- `trimTextMatcher`: 末尾のテキストノードからトリムするテキストを決定するマッチャー(`RegExp`、デフォルトは `/\s+$/u`)。
- `trimTagNameMatcher`: 末尾の`element`ノードをトリムするかを決定するマッチャー、`null` で全て無視(`RegExp` または `hast-util-is-element` の [`Test`](https://github.com/syntax-tree/hast-util-is-element?tab=readme-ov-file#test)、デフォルトは `/^br$/iu`)。
- `stopTagNameMatcher`: 末尾の`element`ノードを見つけた際に、トリムを停止するかを決定するマッチャー、`null` で全て無視(`RegExp` または `hast-util-is-element` の [`Test`](https://github.com/syntax-tree/hast-util-is-element?tab=readme-ov-file#test)、デフォルトは `/^(img|hr|input|meta|link|area|base|col|embed|source|track|wbr)$/iu`)。他の条件より優先される(例: 子要素が 0 個は継続されるが、`stopTagNameMatcher` にマッチした場合は処理が停止される)。

## License

MIT License

Copyright (c) 2025 hankei6km
