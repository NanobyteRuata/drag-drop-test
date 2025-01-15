import { Component } from '@angular/core';
import {
  ElementTypes,
  EmptyElement,
  HeadingElement,
  TextElement,
  Row,
} from './app.model';
import { CommonModule } from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  copyArrayItem,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  templates = [new HeadingElement(), new TextElement()];

  rows: Row[] = [
    {
      children: [new HeadingElement(), new TextElement()],
    },
    {
      children: [new TextElement()],
    },
    {
      children: [new TextElement(), new HeadingElement()],
    },
  ];

  elements: (HeadingElement | TextElement)[] = [];

  cloneElement(element: HeadingElement | TextElement) {
    switch (element.type) {
      case ElementTypes.heading:
        return new HeadingElement();
      case ElementTypes.text:
        return new TextElement();
      default:
        return new EmptyElement();
    }
  }

  onColumnDropped(event: CdkDragDrop<(HeadingElement | TextElement)[]>): void {
    if (event.previousContainer.data === this.templates) {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // copyArrayItem doesn't deep clone nested objects.
      // so, we re-assign the template with new element with same type
      const clonedElement = this.cloneElement(
        event.previousContainer.data[event.previousIndex]
      );
      event.previousContainer.data[event.previousIndex] = clonedElement;
      return;
    }

    if (event.container !== event.previousContainer) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.rows = this.rows.filter((row) => row.children.length);
    }

    if (event.container === event.previousContainer) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  onRowDropped(event: CdkDragDrop<any[]>) {
    const element = this.cloneElement(
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

  canDrop(_: CdkDrag<any>, drop: CdkDropList<any>) {
    return drop.data.length < 2;
  }

  get columnListIds(): string[] {
    return this.rows
      .map((row, index) => ({ index, ...row }))
      .filter((row) => row.children.length < 2)
      .map((row) => `columnList${row.index}`);
  }

  get rowListIdAndColumnListIds(): string[] {
    return [...this.columnListIds, 'rowList'];
  }
}
