import { Component, ElementRef, input, OnDestroy, output, signal, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { OptionId, SelectOption } from "@src/app/component/select/option";
import { ClickOutsideDirective } from "@src/app/directive/click-outside/click-outside.directive";
import { CommonModule } from "@angular/common";
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";

@Component({
  selector: 'app-multi-select',
  imports: [CommonModule, ClickOutsideDirective, UiIconComponent],
  templateUrl: './select-multi.component.html',
})
export class MultiSelectComponent implements OnDestroy {

    @ViewChild('main', { static: false }) mainElement!: ElementRef;

    readonly options = input.required<SelectOption[]>();
    readonly selected = input<OptionId[]>([]);
    readonly hideChevron = input<boolean>(false);

    readonly onSelectedChange = output<OptionId[]>();

    readonly currentOptions = signal<SelectOption[]>([]);
    readonly isOpen = signal(false);
    readonly optionsWidth = signal('0');

    readonly destroy$ = new Subject<void>();

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    handleOutsideClick() {
        this.hideDropdown();
    }

    getSelectedString() {
        return JSON.stringify(this.selected());
    }

    hideDropdown() {
        this.isOpen.set(false);
    }

    isOptionCurrentlySelected(optionId: OptionId) {
        return this.selected().includes(optionId);
    }

    toggleDropdown() {
        this.isOpen.update(currentlyOpen => {
            if (!currentlyOpen) {
                const mainElementWidth = this.mainElement.nativeElement.getBoundingClientRect().width;
                this.optionsWidth.set(`${mainElementWidth}px`);
            }

            return !currentlyOpen;
        });
    }

    toggleOption(optionId: OptionId) {
        const currentSelected = [...this.selected()];
        const toggledOptionIndex = currentSelected.findIndex(item => item === optionId);
        
        if (toggledOptionIndex === -1) {
            this.publishUpdate([...currentSelected, optionId]);
        } else {
            currentSelected.splice(toggledOptionIndex, 1);
            this.publishUpdate([...currentSelected]);
        }
    }

    private publishUpdate(updatedSelected: OptionId[]) {
        this.onSelectedChange.emit(updatedSelected);
    }

}