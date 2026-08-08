import { Component, input, OnDestroy, OnInit, output, signal } from "@angular/core";
import { Observable, Subject, takeUntil } from "rxjs";
import { SelectOption } from "@src/app/component/select/option";
import { ClickOutsideDirective } from "@src/app/directive/click-outside/click-outside.directive";

@Component({
  selector: 'app-multi-select',
  imports: [ClickOutsideDirective],
  templateUrl: './select-multi.component.html',
})
export class MultiSelectComponent implements OnInit, OnDestroy {

    readonly optionsSource = input.required<Observable<SelectOption[]>>();
    readonly selectedValue = input.required<Observable<SelectOption[]>>();

    readonly hideChevron = input<boolean>(false);

    readonly onSelected = output<SelectOption[]>();

    readonly currentOptions = signal<SelectOption[]>([]);
    readonly currentSelected = signal<SelectOption[]>([]);
    readonly isOpen = signal(false);

    readonly destroy$ = new Subject<void>();
    
    ngOnInit(): void {
        this.optionsSource().pipe(takeUntil(this.destroy$)).subscribe(value => {
            console.log('options are', value)
            this.currentOptions.set([...value]);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    handleOutsideClick() {
        this.hideDropdown();
    }

    hideDropdown() {
        this.isOpen.set(false);
    }

}