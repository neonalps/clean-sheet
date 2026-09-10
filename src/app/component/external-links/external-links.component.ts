import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ExternalProviderLinkDto } from '@src/app/model/external-provider';
import { UiIconComponent } from '@src/app/component/ui-icon/icon.component';

@Component({
  selector: 'app-external-links',
  imports: [CommonModule, UiIconComponent],
  templateUrl: './external-links.component.html'
})
export class ExternalLinksComponent {

  readonly externalLinks = input<ExternalProviderLinkDto[]>([]);

  externalLinkClicked(link: string) {
    window.open(link, '_blank');
  }

}
