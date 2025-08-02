import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { ChevronRightComponent } from "@src/app/icon/chevron-right/chevron-right.component";

@Component({
  selector: 'app-collapsible',
  imports: [ChevronRightComponent, CommonModule],
  templateUrl: './collapsible.component.html',
  styleUrl: './collapsible.component.css'
})
export class CollapsibleComponent implements AfterViewInit {

  @Input() collapsed!: boolean;

  @ViewChild('content') contentEl!: ElementRef;

  private contentHeight = 0;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.setInitialHeight();
  }

  toggle() {
    this.collapsed = !this.collapsed;
    this.updateHeight();
  }

  private setInitialHeight() {
    this.contentHeight = this.contentEl.nativeElement.scrollHeight;
    this.renderer.setStyle(this.contentEl.nativeElement, 'height', this.collapsed ? '0px' : `${this.contentHeight}px`);
  }

  private updateHeight() {
    this.contentHeight = this.contentEl.nativeElement.scrollHeight;

    requestAnimationFrame(() => {
      this.renderer.setStyle(this.contentEl.nativeElement, 'height', this.collapsed ? '0px' : `${this.contentHeight}px`);
    });
  }

}
