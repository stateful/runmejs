export declare namespace Runme {
  export interface MarkdownSection {
    name?: string
    content?: string
    description?: string
    markdown?: string
    language?: string
    lines?: string[]
    attributes?: Metadata
  }

  export type Notebook = {
    cells: Cell[]
  }

  interface CommonCell {
    metadata?: Metadata
    languageId: string
    value: string
  }
  interface MarkdownCell extends CommonCell {
    kind: 1
  }
  interface CodeCell extends CommonCell {
    kind: 2
  }

  export type Cell = CodeCell | MarkdownCell

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
}
