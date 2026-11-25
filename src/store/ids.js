/** Next free numeric id for a list of records that each have an `id`. */
export function nextId(items) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}
