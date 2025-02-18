import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  Row,
  cloneElement,
  Elements,
} from './app.model';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { RowComponent } from './row/row.component';
import { TEMPLATES } from './app.constant';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DragDropModule, RowComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  templates = TEMPLATES;
  rows: Row[] = [];

  elements: Elements[] = [];

  onColumnListChanged(): void {
    this.rows = this.rows.filter((row) => row.children.length);
  }

  onRowDropped(event: CdkDragDrop<any[]>) {
    const element = cloneElement(
      event.previousContainer.data[event.previousIndex]
    );
    let copyRow = this.rows;
    const newRow = {
      children: [element],
    };
    copyRow.splice(event.currentIndex, 0, newRow);
    this.rows = copyRow;

    if (event.previousContainer.data !== this.templates) {
      let copyOriginRowChildren = event.previousContainer.data;
      copyOriginRowChildren.splice(event.previousIndex, 1);
      event.previousContainer.data = copyOriginRowChildren;
    }

    this.rows = this.rows.filter((row) => row.children.length);
  }

  get columnListIds(): string[] {
    return this.rows.map((_, index) => `columnList${index}`);
  }

  get rowListIdAndColumnListIds(): string[] {
    return [...this.columnListIds, 'rowList'];
  }
}
