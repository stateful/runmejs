import type {
    Code, BlockContentMap, ListContent, TableContent, RowContent, PhrasingContent,
    FrontmatterContent, DefinitionContent, Root
} from 'https://esm.sh/v102/@types/mdast@3.0.10/index.d.ts'

export interface Metadata {
    id: string
    name?: string
    background: boolean
    closeOnSuccess: boolean
    timeout: number
}

export interface ParsedCode extends Omit<Code, 'meta'> {
    meta: Metadata
}

export interface RunmeBlockContentMap extends Omit<BlockContentMap, 'code'> {
    code: ParsedCode;
}
export type RunmeContent = TopLevelContent | ListContent | TableContent | RowContent | PhrasingContent
export type TopLevelContent = BlockContent | FrontmatterContent | DefinitionContent
export type BlockContent = RunmeBlockContentMap[keyof BlockContentMap]
export interface RunmeRoot extends Omit<Root, 'children'> {
    children: RunmeContent[]
}
