/** One picture of the Contact Sheet lightbox: an index item or a contact sheet frame */
export interface LightboxEntry {
  kind: 'index' | 'sheet'
  /** Counter shown above the title, e.g. `Frame 03 / 18` */
  frame: string
  title: string
  text: string
  imageUrl: string
}
