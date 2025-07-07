import { BasicGame } from "./game";

export enum ParagraphType {
    GameLink = "gameLink",
    Text = "text",
}

export interface TextParagraph {
    type: ParagraphType.Text,
    content: string;
}

export interface GameLinkParagraph {
    type: ParagraphType.GameLink,
    content: BasicGame;
}

export interface SearchAnswer {
    paragraphs: (TextParagraph | GameLinkParagraph)[];
}

export type MagicSearchResponseDto = {
    answer: SearchAnswer;
}

export type ChatMessageType = 'text' | 'gameLink';

export type ChatMessage = {
  id: number;
  type: ChatMessageType;
  timestamp: Date;
  content: string;
  byUser: boolean;
  isSubsequent?: boolean;
}