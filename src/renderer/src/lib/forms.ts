import { z, ZodEffects, ZodObject, ZodTypeAny } from 'zod'
import { DefaultValues, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

type UnwrapZodEffects<T extends ZodTypeAny> =
  T extends ZodEffects<infer U> ? UnwrapZodEffects<U> : T

// Ensure the final type is a ZodObject
type EnsureZodObject<T> = T extends ZodObject<any> ? T : never

export function getBaseObject<T extends ZodTypeAny>(
  schema: T
): EnsureZodObject<UnwrapZodEffects<T>> {
  let currentSchema = schema

  while (currentSchema instanceof ZodEffects) {
    currentSchema = currentSchema._def.schema
  }

  if (currentSchema instanceof ZodObject) {
    return currentSchema as EnsureZodObject<UnwrapZodEffects<T>>
  } else {
    throw new Error('Base schema is not a ZodObject')
  }
}

function getDefaults<Schema extends z.AnyZodObject>(
  schema: Schema
): DefaultValues<z.infer<Schema>> {
  return Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault) {
        return [key, value._def.defaultValue()]
      }
      return [key, undefined]
    })
  ) as DefaultValues<z.infer<Schema>>
}

export function createForm<Schema extends z.AnyZodObject>(
  schema: Schema,
  defaultValues?: DefaultValues<z.infer<Schema>>
) {
  return useForm<z.infer<Schema>>({
    resolver: zodResolver(schema),
    values: defaultValues || getDefaults(schema),
    defaultValues: defaultValues || getDefaults(schema),
    resetOptions: {
      keepDirtyValues: true
    }
  })
}
