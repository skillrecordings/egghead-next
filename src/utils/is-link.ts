export function isLink(item: any) {
  return item.hasOwnProperty('label') && item.hasOwnProperty('url')
}
