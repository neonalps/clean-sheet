import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface FilePickOptions {
  accept?: string;     // e.g. '.json,.txt' or 'image/*'
  multiple?: boolean;
}

@Injectable({ providedIn: 'root' })
export class FilePickerService {

  private document = inject(DOCUMENT);

  pick(options: FilePickOptions = {}): Observable<File[]> {
    return new Observable<File[]>(subscriber => {
      const input = this.document.createElement('input');
      input.type = 'file';
      input.accept = options.accept ?? '';
      input.multiple = options.multiple ?? false;

      const onChange = () => {
        const files = Array.from(input.files ?? []);
        if (files.length) {
            subscriber.next(files);
        }
        subscriber.complete();
      };
      const onCancel = () => subscriber.complete();

      input.addEventListener('change', onChange);
      input.addEventListener('cancel', onCancel);
      input.click();

      return () => {
        input.removeEventListener('change', onChange);
        input.removeEventListener('cancel', onCancel);
      };
    });
  }
}