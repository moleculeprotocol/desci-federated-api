import { defineConfig, loadGraphQLHTTPSubgraph } from '@graphql-mesh/compose-cli'
import { loadJSONSchemaSubgraph } from '@omnigraph/json-schema'

export const composeConfig = defineConfig({
  subgraphs: [
    {
      sourceHandler: loadGraphQLHTTPSubgraph('IPSeeds', {
        endpoint: 'https://subgraph.satsuma-prod.com/742d8952ab24/molecule--4039244/moleculexyz_ipseed/api'
      })
    },
    {
      sourceHandler: loadJSONSchemaSubgraph('CatalystProjects', {
        endpoint: 'https://catalyst.molecule.xyz/api/',
        operations: [
          {
            type: 'Query',
            field: 'catalystMetadata',
            path: '/projects?tokenId={args.id}',
            method: 'GET',
            responseSample: './jsons/CatalystProject.response.json',
            responseTypeName: 'CatalystProject',
            argTypeMap: {
              id: {
                type: 'string'
              }
            }
          }
        ]
      })
    }
  ],
  additionalTypeDefs: `
    extend type IPSeed {
      projectData: CatalystProject
         @resolveTo(
          sourceName: "CatalystProjects"
          sourceTypeName: "Query"
          sourceFieldName: "catalystMetadata"
          requiredSelectionSet: "{ id }"
          sourceArgs: { id: "{root.id}" }
        )
    }
  `
})