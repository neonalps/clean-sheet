import { TextParagraph } from "@src/app/model/chat";

export type ReplaceRule = {
    open: string;
    close: string;
}

export type TransformToHtmlOptions = {
    bold: ReplaceRule;
}

export function transformTextParagraphToHtml(paragraph: TextParagraph, options: TransformToHtmlOptions): string {
    const result: string[] = [];

    let isBoldOpen = false;
    for (let i = 0; i < paragraph.content.length; i++) {
        const current = paragraph.content[i];
        if (current === '*') {
            if (isBoldOpen) {
                result.push(options.bold.close);
            } else {
                result.push(options.bold.open);
            }
            isBoldOpen = !isBoldOpen;
        } else {
            result.push(current);
        }
    }

    return result.join('');
}