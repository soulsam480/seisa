/**
 * This is from {@see https://github.com/mphill/kysely-expo/blob/main/src/driver.ts#L143C1-L144C1}
 */

import type { KyselyPlugin, PluginTransformQueryArgs, PluginTransformResultArgs, QueryResult, RootOperationNode, UnknownRow } from 'kysely'

export class DataTypePlugin implements KyselyPlugin {
  transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
    return args.node
  }

  async transformResult(
    args: PluginTransformResultArgs,
  ): Promise<QueryResult<UnknownRow>> {
    if (Array.isArray(args.result.rows)) {
      return {
        ...args.result,
        // all properties that end with _at are converted to Date objects, there may be a better way to do this
        rows: args.result.rows.map((row) => {
          for (const key in row) {
            // check if the row has a property any properties that end with _at
            if (key.endsWith('_at') && row[key] !== null && row[key] !== undefined)
              row[key] = new Date(row[key] as string)

            if (
              key.startsWith('is_')
              || key.startsWith('has_')
              || key.endsWith('_flag')
            )
              row[key] = Boolean(row[key])
          }

          return row
        }),
      }
    }

    return args.result
  }
}
