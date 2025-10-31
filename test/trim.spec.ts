import { h } from 'hastscript'
import { getNormalizedTrimElementOptions } from '../src/trim.js'
import type { TrimElementOptions } from '../src/index.js'
import { getDefaultTrimElementOptions, trimElement } from '../src/index.js'

describe('getDefaultTrimElementOptions()', () => {
  it('should return default options', async () => {
    const options: TrimElementOptions = getDefaultTrimElementOptions()
    expect(options).toBeDefined()
    expect(options)
      .toEqual({
        recursiveTagNames: /^(a|strong|em|span|del|u|s|b|sub|sup)$/iu,
        trimExistingEmptyText: true,
        trimExistingEmptyElement: true,
        trimBecameEmptyElement: true,
        startFilter: {
          trimTextMatcher: /^\s+/u,
          trimTagNameMatcher: /^br$/iu,
          stopTagNameMatcher: /^(img|hr|input|meta|link|area|base|col|embed|source|track|wbr)$/ui
        },
        endFilter: {
          trimTextMatcher: /\s+$/u,
          trimTagNameMatcher: /^br$/iu,
          stopTagNameMatcher: /^(img|hr|input|meta|link|area|base|col|embed|source|track|wbr)$/iu
        }
      })
  })
})

describe('getNormalizedTrimElementOptions()', () => {
  it('should return normalized options', async () => {
    expect(getNormalizedTrimElementOptions({}))
      .toEqual({
        recursiveTagNames: /^(a|strong|em|span|del|u|s|b|sub|sup)$/iu,
        trimExistingEmptyText: true,
        trimExistingEmptyElement: true,
        trimBecameEmptyElement: true,
        startFilter: {
          trimTextMatcher: /^\s+/u,
          trimTagNameMatcher: /^br$/iu,
          stopTagNameMatcher: /^(img|hr|input|meta|link|area|base|col|embed|source|track|wbr)$/iu
        },
        endFilter: {
          trimTextMatcher: /\s+$/u,
          trimTagNameMatcher: /^br$/iu,
          stopTagNameMatcher: /^(img|hr|input|meta|link|area|base|col|embed|source|track|wbr)$/iu
        }
      })

    expect(getNormalizedTrimElementOptions(getDefaultTrimElementOptions()))
      .toEqual({
        recursiveTagNames: /^(a|strong|em|span|del|u|s|b|sub|sup)$/iu,
        trimExistingEmptyText: true,
        trimExistingEmptyElement: true,
        trimBecameEmptyElement: true,
        startFilter: {
          trimTextMatcher: /^\s+/u,
          trimTagNameMatcher: /^br$/iu,
          stopTagNameMatcher: /^(img|hr|input|meta|link|area|base|col|embed|source|track|wbr)$/iu
        },
        endFilter: {
          trimTextMatcher: /\s+$/u,
          trimTagNameMatcher: /^br$/iu,
          stopTagNameMatcher: /^(img|hr|input|meta|link|area|base|col|embed|source|track|wbr)$/iu
        }
      })

    expect(getNormalizedTrimElementOptions({
      recursiveTagNames: null,
      trimExistingEmptyText: false,
      trimExistingEmptyElement: true,
      trimBecameEmptyElement: true,
      startFilter: {
        trimTextMatcher: null,
        trimTagNameMatcher: null,
        stopTagNameMatcher: null
      },
      endFilter: {
        trimTextMatcher: null,
        trimTagNameMatcher: null,
        stopTagNameMatcher: null
      }
    }))
      .toEqual({
        recursiveTagNames: null,
        trimExistingEmptyText: false,
        trimExistingEmptyElement: true,
        trimBecameEmptyElement: true,
        startFilter: {
          trimTextMatcher: null,
          trimTagNameMatcher: null,
          stopTagNameMatcher: null
        },
        endFilter: {
          trimTextMatcher: null,
          trimTagNameMatcher: null,
          stopTagNameMatcher: null
        }
      })

    expect(getNormalizedTrimElementOptions({
      recursiveTagNames: null,
      trimExistingEmptyText: true,
      trimExistingEmptyElement: false,
      trimBecameEmptyElement: true,
      startFilter: {
        trimTextMatcher: null,
        trimTagNameMatcher: null,
        stopTagNameMatcher: null
      },
      endFilter: {
        trimTextMatcher: null,
        trimTagNameMatcher: null,
        stopTagNameMatcher: null
      }
    }))
      .toEqual({
        recursiveTagNames: null,
        trimExistingEmptyText: true,
        trimExistingEmptyElement: false,
        trimBecameEmptyElement: true,
        startFilter: {
          trimTextMatcher: null,
          trimTagNameMatcher: null,
          stopTagNameMatcher: null
        },
        endFilter: {
          trimTextMatcher: null,
          trimTagNameMatcher: null,
          stopTagNameMatcher: null
        }
      })

    expect(getNormalizedTrimElementOptions({
      recursiveTagNames: null,
      trimExistingEmptyText: true,
      trimExistingEmptyElement: true,
      trimBecameEmptyElement: false,
      startFilter: {
        trimTextMatcher: null,
        trimTagNameMatcher: null,
        stopTagNameMatcher: null
      },
      endFilter: {
        trimTextMatcher: null,
        trimTagNameMatcher: null,
        stopTagNameMatcher: null
      }
    }))
      .toEqual({
        recursiveTagNames: null,
        trimExistingEmptyText: true,
        trimExistingEmptyElement: true,
        trimBecameEmptyElement: false,
        startFilter: {
          trimTextMatcher: null,
          trimTagNameMatcher: null,
          stopTagNameMatcher: null
        },
        endFilter: {
          trimTextMatcher: null,
          trimTagNameMatcher: null,
          stopTagNameMatcher: null
        }
      })

    expect(getNormalizedTrimElementOptions({
      recursiveTagNames: /test0/,
      trimExistingEmptyText: false,
      trimExistingEmptyElement: false,
      trimBecameEmptyElement: false,
      startFilter: {
        trimTextMatcher: /test-start-a/,
        trimTagNameMatcher: /test-start-c/,
        stopTagNameMatcher: /test-start-d/
      },
      endFilter: {
        trimTextMatcher: /test-end-e/,
        trimTagNameMatcher: /test-end-f/,
        stopTagNameMatcher: /test-end-g/
      }
    }))
      .toEqual({
        recursiveTagNames: /test0/,
        trimExistingEmptyText: false,
        trimExistingEmptyElement: false,
        trimBecameEmptyElement: false,
        startFilter: {
          trimTextMatcher: /test-start-a/,
          trimTagNameMatcher: /test-start-c/,
          stopTagNameMatcher: /test-start-d/
        },
        endFilter: {
          trimTextMatcher: /test-end-e/,
          trimTagNameMatcher: /test-end-f/,
          stopTagNameMatcher: /test-end-g/
        }
      })
  })
})

describe('trimElement()', () => {
  it('should trim <br> element', async () => {
    {
      const e = h('p', [h('br')])
      trimElement(e)
      expect(e)
        .toEqual(h('p', []))
    }
    {
      const e = h('p', [h('br'), h('br')])
      trimElement(e)
      expect(e)
        .toEqual(h('p', []))
    }
    {
      const e = h('p', ['test0'])
      trimElement(e)
      expect(e)
        .toEqual(h('p', ['test0']))
    }
    {
      const e = h('p', [h('br')])
      trimElement(e)
      expect(e)
        .toEqual(h('p', []))
    }
    {
      const e = h('p', ['test0', h('br')])
      trimElement(e)
      expect(e)
        .toEqual(h('p', ['test0']))
    }
    {
      const e = h('p', [h('br'), 'test0', h('br')])
      trimElement(e)
      expect(e)
        .toEqual(h('p', ['test0']))
    }
    {
      const e = h('p', [h('br'), 'test0'])
      trimElement(e)
      expect(e)
        .toEqual(h('p', ['test0']))
    }
    {
      const e = h('p', [h('br'), 'test0', h('br'), 'test1', h('br')])
      trimElement(e)
      expect(e)
        .toEqual(h('p', ['test0', h('br'), 'test1']))
    }
    {
      const e = h('p', [h('br'), h('br'), 'test0', h('br'), 'test1', h('br'), h('br')])
      trimElement(e)
      expect(e)
        .toEqual(h('p', ['test0', h('br'), 'test1']))
    }
    {
      const e = h('p', [h('span', [h('br'), 'test2']), 'test0', h('br'), 'test1', h('span', ['test3', h('br')]), h('br')])
      trimElement(e)
      expect(e)
        .toEqual(h('p', [h('span', ['test2']), 'test0', h('br'), 'test1', h('span', ['test3'])]))
    }
    {
      const e = h('p', [{ type: 'element', tagName: 'BR', properties: {}, children: [] }, 'test0', { type: 'element', tagName: 'BR', properties: {}, children: [] }])
      trimElement(e)
      expect(e)
        .toEqual(h('p', ['test0']))
    }
  })
  it('should trim whitespace', async () => {
    {
      const e = h('p', ['    '])
      trimElement(e)
      expect(e)
        .toEqual(h('p', []))
    }
    {
      const e = h('p', ['    test0 test1'])
      trimElement(e)
      expect(e)
        .toEqual(h('p', ['test0 test1']))
    }
    {
      const e = h('p', ['test0 test1   '])
      trimElement(e)
      expect(e)
        .toEqual(h('p', ['test0 test1']))
    }
    {
      const e = h('p', ['   test0 test1   '])
      trimElement(e)
      expect(e)
        .toEqual(h('p', ['test0 test1']))
    }
    {
      const e = h('p', ['    ', h('span', [' ']), ' test0 test1'])
      trimElement(e)
      expect(e)
        .toEqual(h('p', ['test0 test1']))
    }
    {
      const e = h('p', [, 'test0 test1 ', h('span', [' ']), '    '])
      trimElement(e)
      expect(e)
        .toEqual(h('p', ['test0 test1']))
    }
    {
      const e = h('p', ['   ', h('span', [' ']), ' test0 test1 ', h('span', [' ']), '    '])
      trimElement(e)
      expect(e)
        .toEqual(h('p', ['test0 test1']))
    }
    {
      const e = h('p', ['   ', h('span', [' test2']), ' test0 test1 ', h('span', ['test3 ']), '    '])
      trimElement(e)
      expect(e)
        .toEqual(h('p', [h('span', ['test2']), ' test0 test1 ', h('span', ['test3'])]))
    }
    {
      const e = h('p', ['   ', h('span', []), ' test0 test1 ', h('span', []), '    '])
      trimElement(e)
      expect(e)
        .toEqual(h('p', ['test0 test1']))
    }
    {
      const e = h('p', ['   ', { type: 'element', tagName: 'SPAN', properties: {}, children: [{ type: 'text', value: ' test2' }] }, ' test0 test1 ', { type: 'element', tagName: 'SPAN', properties: {}, children: [{ type: 'text', value: 'test3 ' }] }, '    '])
      trimElement(e)
      expect(e)
        .toEqual(h('p', [{ type: 'element', tagName: 'SPAN', properties: {}, children: [{ type: 'text', value: 'test2' }] }, ' test0 test1 ', { type: 'element', tagName: 'SPAN', properties: {}, children: [{ type: 'text', value: 'test3' }] }]))
    }
  })
  it('should trim <br> element and whitespace', async () => {
    {
      const e = h('p', ['   ', h('br'), h('span', [' ', h('br'), 'test2']), ' test0 test1 ', h('span', ['test3', h('br'), ' ']), h('br'), '   '])
      trimElement(e)
      expect(e)
        .toEqual(h('p', [h('span', ['test2']), ' test0 test1 ', h('span', ['test3'])]))
    }
    {
      // trimEndChildren() のループで、childrenをすべて処理した場合の確認(i が -1 になる)
      const e = h('p', ['   ', h('br'), h('span', [' ', h('br')]), ' test0 test1 ', h('span', [h('br'), ' ']), h('br'), '   '])
      trimElement(e)
      expect(e)
        .toEqual(h('p', ['test0 test1']))
    }
  })
  it('should stop trimming', async () => {
    {
      const e = h('p', ['   ', h('span', [' ']), h('b', ['stop']), ' test0 test1 ', h('b', ['stop']), h('span', [' ']), '    '])
      trimElement(e)
      expect(e)
        .toEqual(h('p', [h('b', ['stop']), ' test0 test1 ', h('b', ['stop'])]))
    }
    {
      const e = h('p', ['  ', h('img', { src: 'test.png' }), '    test0 test1    ', h('img', { src: 'test.png' }), '  '])
      trimElement(e)
      expect(e)
        .toEqual(h('p', [h('img', { src: 'test.png' }), '    test0 test1    ', h('img', { src: 'test.png' })]))
    }
  })
  it('should trim various whitespace', async () => {
    // https://ja.wikipedia.org/wiki/%E7%A9%BA%E7%99%BD%E6%96%87%E5%AD%97
    const s: { ch: string, comment: string }[] = [
      // { ch: '　', comment: 'U+3000 (全角スペース)' },
      { ch: '\u0009', comment: 'U+0009 (character tabulation)' },
      { ch: '\u000A', comment: 'U+000A (line feed)' },
      { ch: '\u000B', comment: 'U+000B (line tabulation)' },
      { ch: '\u000C', comment: 'U+000C (form feed)' },
      { ch: '\u000D', comment: 'U+000D (carriage return)' },
      { ch: '\u0020', comment: 'U+0020 (space)' },
      // { ch: '\u0085', comment: 'U+0085 (next line)' }, // https://en.wikipedia.org/wiki/C0_and_C1_control_codes#NEL  // EBICDIC 用
      { ch: '\u00A0', comment: 'U+00A0 (no-break space)' },
      { ch: '\u1680', comment: 'U+1680 (ogham space mark)' },
      { ch: '\u2000', comment: 'U+2000 (en quad)' },
      { ch: '\u2001', comment: 'U+2001 (em quad)' },
      { ch: '\u2002', comment: 'U+2002 (en space)' },
      { ch: '\u2003', comment: 'U+2003 (em space)' },
      { ch: '\u2004', comment: 'U+2004 (three-per-em space)' },
      { ch: '\u2005', comment: 'U+2005 (four-per-em space)' },
      { ch: '\u2006', comment: 'U+2006 (six-per-em space)' },
      { ch: '\u2007', comment: 'U+2007 (figure space)' },
      { ch: '\u2008', comment: 'U+2008 (punctuation space)' },
      { ch: '\u2009', comment: 'U+2009 (thin space)' },
      { ch: '\u200A', comment: 'U+200A (hair space)' },
      { ch: '\u2028', comment: 'U+2028 (line separator)' },
      { ch: '\u2029', comment: 'U+2029 (paragraph separator)' },
      { ch: '\u202F', comment: 'U+202F (narrow no-break space)' },
      { ch: '\u205F', comment: 'U+205F (medium mathematical space)' },
      { ch: '\u3000', comment: 'U+3000 (ideographic space)' }
    ]
    let i = 0
    try {
      for (; i < s.length; i++) {
        const e = h('p', [` ${s[i].ch}`, h('span', [` ${s[i].ch}`]), ' test0 test1 ', h('span', [`${s[i].ch} `]), `${s[i].ch} `])
        trimElement(e)
        expect(e)
          .toEqual(h('p', ['test0 test1']))
      }
    } finally {
      if (i < s.length) {
        console.error(`failed at ${i}: ${s[i].comment}`)
      }
    }
  })
  it('should preserve comments', async () => {
    {
      const e = h('p', ['   ', { type: 'comment', value: 'comment0' }, h('span', [' ', h('br'), 'test2']), ' test0 test1 ', h('span', ['test3', h('br'), ' ']), { type: 'comment', value: 'comment1' }, '   '])
      trimElement(e)
      expect(e)
        .toEqual(h('p', [{ type: 'comment', value: 'comment0' }, h('span', ['test2']), ' test0 test1 ', h('span', ['test3']), { type: 'comment', value: 'comment1' }]))
    }
    {
      const e = h('p', ['   ', h('span', [{ type: 'comment', value: 'comment0' }, ' ', h('br'), 'test2']), ' test0 test1 ', h('span', ['test3', h('br'), ' ', { type: 'comment', value: 'comment1' }]), '   '])
      trimElement(e)
      expect(e)
        .toEqual(h('p', [h('span', [{ type: 'comment', value: 'comment0' }, 'test2']), ' test0 test1 ', h('span', ['test3', { type: 'comment', value: 'comment1' }])]))
    }
  })
  it('should trim empty texts correctly', async () => {
    const a = () => JSON.parse( // h() に渡したオブジェクトは返却された Element を操作すると変化することがある。よって、毎回新しいオブジェクトを生成する。
      JSON.stringify(['   ', '', h('span', ['', '   ']), ' test0 test1 ', h('span', ['   ', '']), '', '    '])
    )
    {
      // デフォルトでの動作確認
      const e = h('p', a())
      trimElement(e)
      expect(e)
        .toEqual(h('p', ['test0 test1']))
    }
    {
      const e = h('p', a())
      trimElement(e, { trimExistingEmptyText: false })
      expect(e)
        .toEqual(h('p', ['', h('span', ['', '   ']), ' test0 test1 ', h('span', ['   ', '']), '']))
    }
  })
  it('should trim empty elements correctly', async () => {
    const a = () => JSON.parse( // h() に渡したオブジェクトは返却された Element を操作すると変化することがある。よって、毎回新しいオブジェクトを生成する。
      JSON.stringify(['   ', h('br'), h('span', [' ', h('br')]), h('em', []), ' test0 test1 ', h('em', []), h('span', [h('br'), ' ']), h('br'), '   '])
    )
    {
      // デフォルトでの動作確認
      const e = h('p', a())
      trimElement(e)
      expect(e)
        .toEqual(h('p', ['test0 test1']))
    }
    {
      const e = h('p', a())
      trimElement(e, { trimExistingEmptyElement: false })
      expect(e)
        .toEqual(h('p', [h('em', []), 'test0 test1', h('em', [])]))
    }
    {
      const e = h('p', a())
      trimElement(e, { trimBecameEmptyElement: false })
      expect(e)
        .toEqual(h('p', [h('span', []), 'test0 test1', h('span', [])]))
    }
    {
      const e = h('p', a())
      trimElement(e, { trimBecameEmptyElement: false, trimExistingEmptyElement: false })
      expect(e)
        .toEqual(h('p', [h('span', []), h('em', []), 'test0 test1', h('em', []), h('span', [])]))
    }
  })
  it('should trim empty texts and elements correctly', async () => {
    {
      const e = h('p', ['   ', h('span', []), '', h('span', ['', '   ']), ' test0 test1 ', h('span', ['   ', '']), '', h('span', []), '    '])
      trimElement(e, { trimExistingEmptyText: true, trimExistingEmptyElement: true, trimBecameEmptyElement: true })
      expect(e)
        .toEqual(h('p', ['test0 test1']))
    }
  })
  it('should trim elements with custom tag names', async () => {
    {
      const e = h('p', ['   ', h('foo', [' ']), '', h('bar', ['', '   ']), ' test0 test1 ', h('bar', ['   ', '']), '', h('foo', [' ']), '    '])
      trimElement(e, {
        recursiveTagNames: ['foo', 'bar']
      })
      expect(e)
        .toEqual(h('p', ['test0 test1']))
    }
    {
      const e = h('p', ['   ', h('foo', [' ']), '', h('bar', ['', '   ']), h('baz', []), ' test0 test1 ', h('qux', []), h('bar', ['   ', '']), '', h('foo', [' ']), '    '])
      trimElement(e, {
        recursiveTagNames: ['foo', 'bar'],
        startFilter: { stopTagNameMatcher: 'baz' },
        endFilter: { stopTagNameMatcher: 'qux' }
      })
      expect(e)
        .toEqual(h('p', [h('baz', []), ' test0 test1 ', h('qux', [])]))
    }
    {
      const e = h('p', ['   ', h('foo', [' ']), '', h('bar', ['', '   ']), h('baz', []), ' test0 test1 ', h('qux', []), h('bar', ['   ', '']), '', h('foo', [' ']), '    '])
      trimElement(e, {
        trimExistingEmptyElement: false,
        recursiveTagNames: ['foo', 'bar'],
        startFilter: { trimTagNameMatcher: 'baz' },
        endFilter: { trimTagNameMatcher: 'qux' }
      })
      expect(e)
        .toEqual(h('p', ['test0 test1']))
    }
  })
  it('should disable trimming by the empty options', async () => {
    {
      const e = h('p', ['   ', h('br'), h('span', [' ', h('br'), 'test2']), ' test0 test1 ', h('span', ['test3', h('br'), ' ']), h('br'), '   '])
      trimElement(e, {
        //recursiveTagNames: null,
        startFilter: {
          trimTextMatcher: null,
          trimTagNameMatcher: null,
          stopTagNameMatcher: null
        },
        endFilter: {
          trimTextMatcher: null,
          trimTagNameMatcher: null,
          stopTagNameMatcher: null
        }
      })
      expect(e)
        .toEqual(h('p', ['   ', h('br'), h('span', [' ', h('br'), 'test2']), ' test0 test1 ', h('span', ['test3', h('br'), ' ']), h('br'), '   ']))
    }
    {
      const e = h('p', ['   ', h('br'), h('span', [' ', h('br'), 'test2']), ' test0 test1 ', h('span', ['test3', h('br'), ' ']), h('br'), '   '])
      trimElement(e, {
        recursiveTagNames: null,
      })
      expect(e)
        .toEqual(h('p', [h('span', [' ', h('br'), 'test2']), ' test0 test1 ', h('span', ['test3', h('br'), ' '])]))
    }
  })
})
