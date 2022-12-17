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

export type Notebook = {
  cells: Cell[]
}

export type Cell = {
  metadata?: Metadata
  languageId?: string
  value: string
  kind: number
} | {
  metadata?: Metadata
  languageId?: string
  value: string
  kind: number
}

export interface Serializer {
  Runme: {
    deserialize: (content: string) => Promise<Notebook>
    serialize: (content: string) => Promise<string>
  }
}

export interface Metadata {
  background?: string
  interactive?: string
  closeTerminalOnSuccess?: string
  mimeType?: string
  ['runme.dev/name']?: string
}
