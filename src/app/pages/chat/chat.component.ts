import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ChatMessageComponent } from '@src/app/component/chat-message/chat-message.component';
import { ChatMessage } from '@src/app/model/chat';
import { ChatService } from '@src/app/module/chat/service';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { getRandomNumberBetween } from '@src/app/util/random';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, ChatMessageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewInit {

    messages$: Observable<ChatMessage[]> | null = null;

    @ViewChild('message', { static: false }) messageElement!: ElementRef;

    private readonly chatService = inject(ChatService);
    private readonly translationService = inject(TranslationService);

    ngOnInit(): void {
      this.messages$ = this.chatService.messages$;
    }

    ngAfterViewInit(): void {
      this.focusMessage();

      setTimeout(() => this.addWelcomeMessage(), 400);
    }

    addWelcomeMessage() {
      this.chatService.createPersonaMessage(`Hi! My name is Mika. I will happily answer any statistics-related questions about Sturm Graz that you might have. Auf die Schwoazn 🏴🏳️`);

      setTimeout(() => {
        this.chatService.createPersonaMessage(`Du kannst mit mir überigens auch Deutsch sprechen 😉`);
      }, 400);
    }

    focusMessage(): void {
      setTimeout(() => this.messageElement.nativeElement.focus(), 0);
    }

    getMessagePlaceholder(): string {
      return this.translationService.translate('chat.writeMessage', { name: "Mika" });
    }

    onMessageSubmit() {
      const message = this.messageElement.nativeElement.value;
      if (message.trim().length === 0) {
        return;
      }
      
      this.chatService.createUserMessage(message);

      this.messageElement.nativeElement.value = '';
    }

    private simulateTyping(message: ChatMessage, fullContent: string, timeoutMs: number, onFinished?: () => void) {
      setTimeout(() => {
        const revealedMessage = message.content;
        if (revealedMessage.length < fullContent.length) {
          const revealLength = getRandomNumberBetween(2, 6)
          const nextCharacters = fullContent.substring(revealedMessage.length, revealedMessage.length + revealLength);
          message.content += nextCharacters;
          const randomTimeoutMs = getRandomNumberBetween(40, 120);
          this.simulateTyping(message, fullContent, randomTimeoutMs, onFinished);
        } else {
          onFinished?.();
        }
      }, timeoutMs);
    }

}
