import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectComponent, NG_SELECT_DEFAULT_CONFIG } from './components/ng-select/ng-select.component';
import { VirtualScrollModule } from './components/virtual-scroll/virtual-scroll.component';
import { ngSelectComponents, ngSelectDirectives } from './ng-select.include';

@NgModule({
    imports: [
        CommonModule,
        VirtualScrollModule
    ],
    declarations: [...ngSelectComponents, ...ngSelectDirectives],
    exports:  [...ngSelectComponents, ...ngSelectDirectives],
    providers: [
        {
            provide: NG_SELECT_DEFAULT_CONFIG,
            useValue: {
                notFoundText: '',
                typeToSearchText: '',
                addTagText: '',
                loadingText: '...',
                clearAllText: '',
                disableVirtualScroll: false
            }
        }
    ]
})
export class NgSelectModule { }
