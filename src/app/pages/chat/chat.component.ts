import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { getRandomNumberBetween } from '@src/app/util/random';

export type ChatMessage = {
  id: number;
  timestamp: Date;
  content: string;
  byUser: boolean;
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

    ngAfterViewInit(): void {
      this.focusMessage();

      setTimeout(() => this.addWelcomeMessage(), 800);
    }

    addWelcomeMessage() {
      this.createMessage(`Hi! My name is Mika. I will gladly answer any statistical questions about Sturm Graz that you might have. Auf die Schwoazn 🏴🏳️`, false);
    }

    focusMessage(): void {
      setTimeout(() => this.messageElement.nativeElement.focus(), 0);
    }

    getDynamicClasses(message: ChatMessage): string[] {
      const dynamicClasses: string[] = [];

      if (message.byUser) {
        dynamicClasses.push(`ml-2/5`);
      }

      return dynamicClasses;
    }

    onMessageSubmit() {
      const message = this.messageElement.nativeElement.value;
      
      this.createMessage(message, true);

      this.messageElement.nativeElement.value = '';
    }

    private createMessage(content: string, byUser: boolean) {
      const message: ChatMessage = {
        id: this.messages.length + 1,
        content: byUser ? content : "",
        timestamp: new Date(),
        byUser,
      };

      this.messages.push(message);

      if (!byUser) {
        this.simulateTyping(message, content, 70);
      }
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
