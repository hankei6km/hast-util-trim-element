import type { Element, ElementContent } from 'hast'

export type Matcher = RegExp
export type Filter = {
    trimTextMatcher?: Matcher | null
    trimTagNameMatcher?: Matcher | null
    stopTagNameMatcher?: Matcher | null
}

export type TrimElementOptions = {
    recursiveTagNames?: RegExp | null
    trimExistingEmptyText?: boolean
    trimExistingEmptyElement?: boolean
    trimBecameEmptyElement?: boolean
    startFilter?: Filter
    endFilter?: Filter
}

type NormalizedTrimElementOptions = Required<Omit<TrimElementOptions, 'startFilter' | 'endFilter'>> & {
    startFilter: Required<Filter>
    endFilter: Required<Filter>
}

type FilterOptions = {
    filter: Required<Filter>
} & Required<Omit<TrimElementOptions, 'startFilter' | 'endFilter'>>

export function getDefaultRecursiveTagNames(): Required<TrimElementOptions>['recursiveTagNames'] {
    return /^(a|strong|em|span|del|u|s|b|sub|sup)$/iu
}
export function getDefaultTrimExistingEmptyText(): Required<TrimElementOptions>['trimExistingEmptyText'] {
    return true
}
export function getDefaultTrimExistingEmptyElement(): Required<TrimElementOptions>['trimExistingEmptyElement'] {
    return true
}
export function getDefaultTrimBecameEmptyElement(): Required<TrimElementOptions>['trimBecameEmptyElement'] {
    return true
}
export function getDefaultStartFilter(): Required<Filter> {
    return {
        trimTextMatcher: /^\s+/u, // `String.prototype.trim' は UTF-16 コードポイント列。'v' フラグは es2024 から。
        trimTagNameMatcher: /^br$/iu,
        stopTagNameMatcher: /^(img|hr|input|meta|link|area|base|col|embed|source|track|wbr)$/iu
    }

}
export function getDefaultEndFilter(): Required<Filter> {
    return {
        trimTextMatcher: /\s+$/u,
        trimTagNameMatcher: /^br$/iu,
        stopTagNameMatcher: /^(img|hr|input|meta|link|area|base|col|embed|source|track|wbr)$/iu
    }
}

export function getDefaultTrimElementOptions(): TrimElementOptions {
    return {
        recursiveTagNames: getDefaultRecursiveTagNames(),
        trimExistingEmptyText: getDefaultTrimExistingEmptyText(),
        trimExistingEmptyElement: getDefaultTrimExistingEmptyElement(),
        trimBecameEmptyElement: getDefaultTrimBecameEmptyElement(),
        startFilter: getDefaultStartFilter(),
        endFilter: getDefaultEndFilter()
    }
}
export function getNormalizedTrimElementOptions(options: TrimElementOptions = {}): NormalizedTrimElementOptions {
    return {
        recursiveTagNames: typeof options.recursiveTagNames === 'undefined' ? defaultRecursiveTagNames : options.recursiveTagNames,
        trimExistingEmptyText: typeof options.trimExistingEmptyText === 'undefined' ? defaultTrimExistingEmptyText : options.trimExistingEmptyText,
        trimExistingEmptyElement: typeof options.trimExistingEmptyElement === 'undefined' ? defaultTrimExistingEmptyElement : options.trimExistingEmptyElement,
        trimBecameEmptyElement: typeof options.trimBecameEmptyElement === 'undefined' ? defaultTrimBecameEmptyElement : options.trimBecameEmptyElement,
        startFilter: {
            trimTextMatcher: typeof options.startFilter?.trimTextMatcher === 'undefined' ? defaultStartFilter.trimTextMatcher : options.startFilter?.trimTextMatcher,
            trimTagNameMatcher: typeof options.startFilter?.trimTagNameMatcher === 'undefined' ? defaultStartFilter.trimTagNameMatcher : options.startFilter?.trimTagNameMatcher,
            stopTagNameMatcher: typeof options.startFilter?.stopTagNameMatcher === 'undefined' ? defaultStartFilter.stopTagNameMatcher : options.startFilter?.stopTagNameMatcher
        },
        endFilter: {
            trimTextMatcher: typeof options.endFilter?.trimTextMatcher === 'undefined' ? defaultEndFilter.trimTextMatcher : options.endFilter?.trimTextMatcher,
            trimTagNameMatcher: typeof options.endFilter?.trimTagNameMatcher === 'undefined' ? defaultEndFilter.trimTagNameMatcher : options.endFilter?.trimTagNameMatcher,
            stopTagNameMatcher: typeof options.endFilter?.stopTagNameMatcher === 'undefined' ? defaultEndFilter.stopTagNameMatcher : options.endFilter?.stopTagNameMatcher
        }
    }
}

const defaultRecursiveTagNames = getDefaultRecursiveTagNames()
const defaultTrimExistingEmptyText = getDefaultTrimExistingEmptyText()
const defaultTrimExistingEmptyElement = getDefaultTrimExistingEmptyElement()
const defaultTrimBecameEmptyElement = getDefaultTrimBecameEmptyElement()
const defaultStartFilter = getDefaultStartFilter()
const defaultEndFilter = getDefaultEndFilter()
const defaultTrimElementOptions: TrimElementOptions = getDefaultTrimElementOptions()

function getStartFilterOptions(options: NormalizedTrimElementOptions): FilterOptions {
    return {
        filter: {
            trimTextMatcher: options.startFilter.trimTextMatcher,
            trimTagNameMatcher: options.startFilter.trimTagNameMatcher,
            stopTagNameMatcher: options.startFilter.stopTagNameMatcher
        },
        recursiveTagNames: options.recursiveTagNames,
        trimExistingEmptyText: options.trimExistingEmptyText,
        trimExistingEmptyElement: options.trimExistingEmptyElement,
        trimBecameEmptyElement: options.trimBecameEmptyElement
    }
}
function getEndFilterOptions(options: NormalizedTrimElementOptions): FilterOptions {
    return {
        filter: {
            trimTextMatcher: options.endFilter.trimTextMatcher,
            trimTagNameMatcher: options.endFilter.trimTagNameMatcher,
            stopTagNameMatcher: options.endFilter.stopTagNameMatcher
        },
        recursiveTagNames: options.recursiveTagNames,
        trimExistingEmptyText: options.trimExistingEmptyText,
        trimExistingEmptyElement: options.trimExistingEmptyElement,
        trimBecameEmptyElement: options.trimBecameEmptyElement
    }
}

type FilterState = 'trim' | 'pass' | 'recursive' | 'stop'
function filterElement(e: ElementContent, options: FilterOptions): FilterState {
    let filterState: FilterState = 'stop'
    if (e.type === 'text') {
        if (e.value.length === 0) {  // value が 0 は fromHtml などでは存在しなさそうだが、手動で作ることはできる。
            if (options.trimExistingEmptyText) {
                // 空の text node は trim する。
                filterState = 'trim'
            }
        } else {
            if (options.filter.trimTextMatcher instanceof RegExp) {
                const v = e.value.replace(options.filter.trimTextMatcher, '')
                if (v.length === 0) {
                    // value が置き換わるが trim されるで変更はしない。
                    // (新しい children でこの element はなくなる)
                    filterState = 'trim'
                } else if (v.length !== e.value.length) {
                    // element 自体は trim されないが、value は置き換わる。
                    // なお、children 操作のループを抜けるとき、この element は変更された状態で残す。
                    filterState = 'stop'
                    e.value = v
                }
            }
        }
    } else if (e.type === 'element') {
        if (!(options.filter.stopTagNameMatcher instanceof RegExp && options.filter.stopTagNameMatcher.test(e.tagName))) {
            if (options.filter.trimTagNameMatcher instanceof RegExp && options.filter.trimTagNameMatcher.test(e.tagName)) {
                filterState = 'trim'
            }
            if (filterState === 'stop') {
                if (e.children.length === 0) {
                    if (options.trimExistingEmptyElement) {
                        // 空の element は trim する。
                        filterState = 'trim'
                    } else {
                        // 空の element は trim しない、pass で残して継続する
                        filterState = 'pass'
                    }
                } else if (e.children.length > 0 && options.recursiveTagNames instanceof RegExp && options.recursiveTagNames.test(e.tagName)) {
                    // 再帰的に trim するが、lead/trail で処理が異なる(再帰に利用する関数が異なる)ため、呼び出しもとにまかせる。
                    filterState = 'recursive'
                }
            }
        }
    } else if (e.type === 'comment') {
        // コメントは trim しない、pass で残して継続する(doctypeは？)
        filterState = 'pass'
    }
    return filterState
}

function trimStartChildren(el: Element, options: FilterOptions): void {
    const trimmedChildren: ElementContent[] = []
    let filterState: FilterState = 'trim'
    let i = 0
    for (; i < el.children.length; i++) {
        const e = el.children[i]
        filterState = filterElement(e, options)
        if (filterState === 'recursive' && e.type === 'element') { // 'recursive' は element の場合のみだが、型ガードのため再判定(冗長)
            filterState = 'stop'
            trimStartChildren(e, options)
            if (e.children.length === 0) {
                if (options.trimBecameEmptyElement) {
                    // 再帰的に trim された結果、子要素が空になった場合、要素も trim する。
                    filterState = 'trim'
                } else {
                    // 要素は trim しない、pass で残して継続する
                    filterState = 'pass'
                }
            }
        }
        if (filterState === 'pass') {
            trimmedChildren.push(e)
        } else if (filterState === 'stop') {
            trimmedChildren.push(e)
            break
        }
    }
    el.children = [...trimmedChildren, ...el.children.slice(i + 1)]
    return
}

function trimEndChildren(el: Element, options: FilterOptions): void {
    const trimmedChildren: ElementContent[] = []
    let filterState: FilterState = 'trim'
    let i = el.children.length - 1
    for (; i >= 0; i--) {
        const e = el.children[i]
        filterState = filterElement(e, options)
        if (filterState === 'recursive' && e.type === 'element') {
            filterState = 'stop'
            trimEndChildren(e, options)
            if (e.children.length === 0) {
                if (options.trimBecameEmptyElement) {
                    // 再帰的に trim された結果、子要素が空になった場合、要素も trim する。
                    filterState = 'trim'
                } else {
                    // 要素は trim しない、pass で残して継続する
                    filterState = 'pass'
                }
            }
        }
        if (filterState === 'pass') {
            trimmedChildren.push(e)
        } else if (filterState === 'stop') {
            trimmedChildren.push(e)
            break
        }
    }
    el.children = [...el.children.slice(0, i < 0 ? 0 : i), ...trimmedChildren.reverse()]
    return
}

export function trimElement(element: Element, options: TrimElementOptions = defaultTrimElementOptions): void {
    if (element.type === 'element') {
        const normalizedOptions = getNormalizedTrimElementOptions(options)
        trimStartChildren(
            element,
            getStartFilterOptions(normalizedOptions)
        )
        trimEndChildren(
            element,
            getEndFilterOptions(normalizedOptions)
        )
    }
}
