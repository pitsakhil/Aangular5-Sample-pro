import { Directive, HostListener, Renderer, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[appShowHideElement]'
})
export class ShowHideElementDirective {
    @HostListener('mouseenter', ['$event']) onMouseEnter(event: Event) { this.isShowHide(true); }
    @HostListener('mouseleave') onMouseLeave(event: Event) { this.isShowHide(false); }

    constructor(private el: ElementRef, private renderer: Renderer) { }

    /**
     * @author Akhil K <akhil.kn@pitsolutions.com>
     *
     * Function to toggle opacity of clone options on hover
     *
     * @param value
     *
     */
    private isShowHide(value: boolean) {
        const btnClassList = this.el.nativeElement.querySelector('.btn-options').classList;
        !!value ? btnClassList.add('visible') : btnClassList.remove('visible');
    }

}
