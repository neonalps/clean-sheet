export function getDragAfterElement(elementList: Element[], y: number): Element | undefined {
  const afterElement = [...elementList].reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY });

  return ('element' in afterElement) ? (afterElement.element as Element) : undefined;
}