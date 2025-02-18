import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { cloneElement, Elements, Row } from '../app.model';
import {
  CdkDragDrop,
  CdkDropList,
  copyArrayItem,
  DragDropModule,
  DropListRef,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { TEMPLATES } from '../app.constant';

@Component({
  selector: 'app-row',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './row.component.html',
  styleUrl: './row.component.scss',
})
export class RowComponent implements AfterViewInit {
  @Input({ required: true }) row!: Row;
  @Input({ required: true }) id!: string;
  @Input() connectedTo: string[] = [];

  @Output() columnListChanged = new EventEmitter<void>();

  @ViewChild(CdkDropList)
  cdkDropList?: CdkDropList;

  templates = TEMPLATES;

  ngAfterViewInit() {
    const dropListRef = this.cdkDropList?._dropListRef;
    if (!dropListRef) return;

    const originalConnectedTo = dropListRef.connectedTo;

    dropListRef['connectedTo'] = ((connectedTo: DropListRef[]) => {
      originalConnectedTo.apply(dropListRef, [connectedTo]);

      const targetIndex = this.connectedTo.findIndex((id) => id === this.id);
      dropListRef['_siblings'].splice(targetIndex, 0, dropListRef);
      return dropListRef;
    }) as any;
  }

  onColumnDropped(event: CdkDragDrop<Elements[]>): void {
    if (event.previousContainer.data === this.templates) {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // copyArrayItem doesn't deep clone nested objects.
      // so, we re-assign the template with new element with same type
      const clonedElement = cloneElement(
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
      this.columnListChanged.emit();
    }

    if (event.container === event.previousContainer) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
