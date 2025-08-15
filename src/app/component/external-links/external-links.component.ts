import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ExternalProviderLinkDto } from '@src/app/model/external-provider';
import { UiIconComponent } from '@src/app/component/ui-icon/icon.component';

@Component({
  selector: 'app-external-links',
  imports: [CommonModule, UiIconComponent],
  templateUrl: './external-links.component.html',
  styleUrl: './external-links.component.css'
})
export class ExternalLinksComponent {

  @Input() externalLinks: ExternalProviderLinkDto[] = [];

  externalLinkClicked(link: string) {
    window.open(link, '_blank');
  }

}
