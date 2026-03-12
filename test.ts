import { useDocument } from './src'

type Person = {
  name: string
  age: number
}

const person = useDocument<Person>(
  {
    databaseId: 'db1',
    collectionId: 'col1',
    documentId: 'doc1',
    fields: ['name', 'age'],
  },
  {
    staleTime: 1000 * 60, // 1 minute
  },
)
