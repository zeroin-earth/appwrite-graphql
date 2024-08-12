import { Models } from '../types'

export type Document<T> = T & Models.Document
export type Collection<T> = Models.DocumentList<Document<T>>
