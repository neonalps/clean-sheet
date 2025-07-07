import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChatMessage } from '@src/app/model/chat';

@Component({
  selector: 'app-chat-message',
  imports: [CommonModule],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.css'
})
export class ChatMessageComponent {

  @Input() message!: ChatMessage;

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

}
