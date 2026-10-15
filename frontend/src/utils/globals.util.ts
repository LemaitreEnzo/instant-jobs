export const sliceItem = (item: string, length: number) => {
  return item.length > 15 ? `${item.slice(0, length)}...` : item;
}
