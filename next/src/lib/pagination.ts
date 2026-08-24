/**
 * ページネーションのリンク生成とページ番号の省略表示
 *
 * 俳句展（/blog）で使う。以前は以下の不具合があった:
 *  - ページ送りが年月フィルタを引き継がず、絞り込み中に2ページ目を押すと全件へ飛んだ
 *  - ページ番号を全件描画しており、27ページ分がモバイルで横に潰れていた
 */

export interface PageHrefOptions {
    /** 年月フィルタ（両方揃っている場合のみ引き継ぐ） */
    year?: string;
    month?: string;
    /** ベースパス。既定は /blog */
    basePath?: string;
}

/**
 * ページ番号からリンク先を作る。
 * 年月フィルタを保持しないと、絞り込み中にページを送った瞬間に全件表示へ戻ってしまう。
 * 1ページ目は page パラメータを付けない（URLを短く保ち、正規化する）。
 */
export function buildPageHref(page: number, options: PageHrefOptions = {}): string {
    const { year, month, basePath = "/blog" } = options;
    const params = new URLSearchParams();

    if (year && month) {
        params.set("year", year);
        params.set("month", month);
    }
    if (page > 1) {
        params.set("page", String(page));
    }

    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
}

/**
 * 表示するページ番号の並びを作る。`null` は省略記号「…」を表す。
 *
 * 最初・最後・現在ページの前後 `siblings` 件だけを出す。
 * 句は増え続けるため、全ページ番号を並べるとモバイルで操作できなくなる。
 */
export function buildPageItems(
    currentPage: number,
    totalPages: number,
    siblings = 1,
): (number | null)[] {
    const items: (number | null)[] = [];

    for (let page = 1; page <= totalPages; page++) {
        const isEdge = page === 1 || page === totalPages;
        const isNearCurrent = Math.abs(page - currentPage) <= siblings;

        if (isEdge || isNearCurrent) {
            items.push(page);
        } else if (items[items.length - 1] !== null) {
            // 省略記号が連続しないようにする
            items.push(null);
        }
    }

    return items;
}
