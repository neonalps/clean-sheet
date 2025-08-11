import { Component } from '@angular/core';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { SearchComponent } from '@src/app/icon/search/search.component';
import { COLOR_LIGHT } from '@src/styles/constants';

@Component({
  selector: 'app-header',
  imports: [UiIconComponent, SearchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  colorLight = COLOR_LIGHT;

}
