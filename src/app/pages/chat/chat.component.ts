import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, inject, ViewChild } from '@angular/core';
import { TextParagraph } from '@src/app/model/chat';
import { ChatService } from '@src/app/module/chat/service';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { transformTextParagraphToHtml } from '@src/app/util/html';
import { getRandomNumberBetween } from '@src/app/util/random';
import { catchError, take, throwError } from 'rxjs';

export type ChatMessage = {
  id: number;
  timestamp: Date;
  content: string;
  byUser: boolean;
  isSubsequent?: boolean;
}

@Component({
  selector: 'app-chat',
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements AfterViewInit {

    @ViewChild('message', { static: false }) messageElement!: ElementRef;

    messages: ChatMessage[] = [];

    private readonly chatService = inject(ChatService);
    private readonly translationService = inject(TranslationService);

    ngAfterViewInit(): void {
      this.focusMessage();

      setTimeout(() => this.addWelcomeMessage(), 800);
    }

    addWelcomeMessage() {
      this.createMessage(`Hi! My name is Mika. I will gladly answer any statistics-related questions about Sturm Graz that you might have. Auf die Schwoazn 🏴🏳️`, false);
    }

    addErrorMessage() {
      this.createMessage(`Leider habe ich das nicht verstanden 😢 könntest du das bitte noch einmal versuchen? 🙏`, false);
    }

    focusMessage(): void {
      setTimeout(() => this.messageElement.nativeElement.focus(), 0);
    }

    getDynamicClasses(message: ChatMessage): string[] {
      const dynamicClasses: string[] = [];

      if (message.byUser) {
        dynamicClasses.push(`ml-2/5`);
      }

      if (message.isSubsequent) {
        dynamicClasses.push(`mt-1`);
      } else {
        dynamicClasses.push(`mt-3`);
      }

      return dynamicClasses;
    }

    getMessagePlaceholder(): string {
      return this.translationService.translate('chat.writeMessage', { name: "Mika" });
    }

    onMessageSubmit() {
      const message = this.messageElement.nativeElement.value;
      if (message.trim().length === 0) {
        return;
      }
      
      this.createMessage(message, true);

      this.messageElement.nativeElement.value = '';

      this.chatService.postMagicSearchQuery(message).pipe(take(1)).subscribe((response) => {
        this.createMessage(response.answer.paragraphs.map(item => transformTextParagraphToHtml(item, { bold: { open: `<span class="bold">`, close: `</span>` } })).join(` `), false);
      }, (error) => { 
        console.warn(`received error response`, error);
        this.addErrorMessage();
       });
    }

    private createMessage(content: string, byUser: boolean) {
      // to check if it is a subsequent message
      const lastMessage = this.getLastMessage();

      const message: ChatMessage = {
        id: this.messages.length + 1,
        content: byUser ? content : "",
        timestamp: new Date(),
        byUser,
        isSubsequent: lastMessage !== null && lastMessage.byUser === byUser,
      };

      this.messages.push(message);

      if (!byUser) {
        this.simulateTyping(message, content, 70);
      }
    }

    private getLastMessage(): ChatMessage | null {
      if (this.messages.length === 0) {
        return null;
      }

      return this.messages[this.messages.length - 1];
    }

    private simulateTyping(message: ChatMessage, fullContent: string, timeoutMs: number) {
      setTimeout(() => {
        const revealedMessage = message.content;
        if (revealedMessage.length < fullContent.length) {
          const revealLength = getRandomNumberBetween(2, 6)
          const nextCharacters = fullContent.substring(revealedMessage.length, revealedMessage.length + revealLength);
          message.content += nextCharacters;
          const randomTimeoutMs = getRandomNumberBetween(40, 120);
          this.simulateTyping(message, fullContent, randomTimeoutMs);
        }
      }, timeoutMs);
    }

}
