import { Component, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'app-accordion',
    imports: [MatButtonModule, MatIconModule],
    templateUrl: './accordion.component.html',
    styleUrl: './accordion.component.scss',
})
export class AccordionComponent {
    @Input() label: string = '';

    protected opened: boolean = true;

    public toggleAccordion(): void {
        this.opened = !this.opened;
    }
}