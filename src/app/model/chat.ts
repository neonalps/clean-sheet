export enum ParagraphType {
    Text = "text",
}

export interface TextParagraph {
    type: ParagraphType.Text,
    content: string;
}

export interface SearchAnswer {
    paragraphs: TextParagraph[];
}