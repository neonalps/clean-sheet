import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take } from "rxjs";
import { environment } from "@src/environments/environment";
import { ChatMessage, ChatMessageType, MagicSearchResponseDto } from "@src/app/model/chat";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

    private readonly messages: ChatMessage[] = [];

    messages$ = new BehaviorSubject<ChatMessage[]>([]);

    constructor(private http: HttpClient) { }

    createUserMessage(content: string) {
        const message = this.createMessage('text', content, true);

        this.messages.push(message);
        this.messages$.next(this.messages);

        // TODO we could do some batching here in case the user typed several messages
        this.requestResponse([message]);
    }

    createPersonaMessage(content: string) {
        const message = this.createMessage('text', content, true);

        this.messages.push(message);
        this.messages$.next(this.messages);
    }

    resetMessages(): void {
        this.messages.length = 0;
        this.messages$.next(this.messages);
    }

    private createMessage(type: ChatMessageType, content: string, byUser: boolean): ChatMessage {
        return {
            id: this.getNextMessageId(),
            byUser,
            timestamp: new Date(),
            type,
            content,
            isSubsequent: this.getLastMessage()?.byUser === byUser,
        };
    }

    private requestResponse(messages: ChatMessage[]) {
        const inquiry = messages.map(message => message.content).join(" ");

        const magicSearchResponse = this.postMagicSearchQuery(inquiry).pipe(take(1)).subscribe({
            next: (response) => {

            },
            error: (error) => {

            },
        })
    }

    private postMagicSearchQuery(inquiry: string): Observable<MagicSearchResponseDto> {
        return this.http.post<MagicSearchResponseDto>(`${environment.apiBaseUrl}/v1/search/magic`, { inquiry: inquiry });
    }

    private getNextMessageId(): number {
        return this.messages.length + 1;
    }

    private getLastMessage(): ChatMessage | null {
        if (this.messages.length === 0) {
            return null;
        }

        return this.messages[this.messages.length - 1];
    }

}