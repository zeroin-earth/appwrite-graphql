import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/schema.graphql',
  documents: ['src/**/*.tsx', 'src/**/*.ts', 'app/**/*.tsx', 'app/**/*.ts'],
  generates: {
    'src/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
        fragmentMasking: {
          unmaskFunctionName: 'getFragmentData',
        },
      },
    },
  },
}

export default config
