export enum ElementTypes {
  empty = 'empty',
  heading = 'heading',
  text = 'text',
}

export interface Row {
  children: (HeadingElement | TextElement)[]
}

export class Element {
}

export class EmptyElement extends Element {
  type = ElementTypes.empty;

  constructor() {
    super();
  }
}

export class TextElement extends Element {
  type = ElementTypes.text;

  constructor() {
    super();
  }
}

export class HeadingElement extends Element {
  type = ElementTypes.heading;

  constructor() {
    super();
  }
}

export type Elements = EmptyElement | TextElement | HeadingElement;

export function cloneElement(element: HeadingElement | TextElement) {
  switch (element.type) {
    case ElementTypes.heading:
      return new HeadingElement();
    case ElementTypes.text:
      return new TextElement();
    default:
      return new EmptyElement();
  }
}