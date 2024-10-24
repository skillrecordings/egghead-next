import {NonRetriableError} from 'inngest'
import {z} from 'zod'

export async function syncWithSearchProvider(
  schema: z.ZodSchema,
  data: any,
  syncFunction: (data: any) => Promise<any>,
  transformerFunction?: (data: any) => any,
) {
  try {
    const result = schema.safeParse(data)

    if (!result.success) {
      throw new NonRetriableError(`Resource is not valid`, {
        cause: result.error,
      })
    }

    const transformedData = transformerFunction
      ? transformerFunction(result.data)
      : result.data

    await syncFunction(transformedData)

    return transformedData
  } catch (error) {
    console.error('Error upserting course to Typesense', error)
    throw error
  }
}
