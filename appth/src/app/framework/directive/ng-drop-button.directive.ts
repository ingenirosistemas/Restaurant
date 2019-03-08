import {
  Directive, EventEmitter, ElementRef,
  HostListener, Input, Output, Renderer
} from '@angular/core';

@Directive({
  selector: '[appNgDropButton]'
})
export class NgDropButtonDirective {

  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();
  @Input() index = -1;

  constructor(private el: ElementRef, private renderer: Renderer) {

  }

  @HostListener('mouseover') onMouseOver() {
    const part = this.el.nativeElement.querySelector('.card-text-' + this.index);
    this.renderer.setElementStyle(part, 'display', 'block');
    this.renderer.setElementStyle(this.el.nativeElement, 'color', '#f39c12');
    // this._prevenirDetener(event);
  }

  @HostListener('mouseout') onMouseOut() {
    const part = this.el.nativeElement.querySelector('.card-text-' + this.index);
    this.renderer.setElementStyle(part, 'display', 'none');
    this.renderer.setElementStyle(this.el.nativeElement, 'color', '');
    // this._prevenirDetener(event);
  }

  private _prevenirDetener(event) {
    event.preventDefault();
    event.stopPropagation();
  }

}
