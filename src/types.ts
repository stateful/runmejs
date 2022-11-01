export interface MarkdownSection {
  name?: string
  content?: string
  description?: string
  markdown?: string
  language?: string
  lines?: string[]
  attributes?: Metadata
}

export interface ParsedDocument {
  document?: MarkdownSection[]
}

export interface Metadata {
  [key: string]: any
}
