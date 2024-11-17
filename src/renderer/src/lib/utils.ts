import { z, ZodEffects, ZodObject, ZodTypeAny } from 'zod'
import { DefaultValues, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import confetti from 'canvas-confetti'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

const unicode_lookup = {
  // 0
  '𝟘': '0',  // U+1D7D8
  // 1
  '𝟙': '1',  // U+1D7D9
  // 2
  '𝟚': '2',  // U+1D7DA
  // 3
  '𝟛': '3',  // U+1D7DB
  // 4
  '𝟜': '4',  // U+1D7DC
  // 5
  '𝟝': '5',  // U+1D7DD
  // 6
  '𝟞': '6',  // U+1D7DE
  // 7
  '𝟟': '7',  // U+1D7DF
  // 8
  '𝟠': '8',  // U+1D7E0
  // 9
  '𝟡': '9',  // U+1D7E1
  // a
  '𝐚': 'a',  // U+1D41A
  // A
  'Λ': 'A',  // U+039B
  'ʌ': 'A',  // U+028C
  'Ⱥ': 'A',  // U+023A
  'ᴬ': 'A',  // U+1D2C
  '₳': 'A',  // U+20B3
  '𝔸': 'A',  // U+1D538
  '𝐀': 'A',  // U+1D400
  // b
  '𝐛': 'b',  // U+1D41B
  // B
  'ᴮ': 'B',  // U+1D2E
  '𝔹': 'B',  // U+1D539
  '𝐁': 'B',  // U+1D402
  // c
  '𝐜': 'c',  // U+1D41C
  // C
  '᱑': 'C',  // U+1C51
  '𝐂': 'C',  // U+1D403
  'ℂ': 'C',  // U+2102

  // d
  '𝐝': 'd',  // U+1D41D
  // D
  '𝔻': 'D',  // U+1D53B
  '𝐃': 'D',  // U+1D404
  // e
  '𝐞': 'e',  // U+1D41E
  // E
  '𝔼': 'E',  // U+1D53C
  '€': 'E',  // U+20AC
  'є': 'E',  // U+0454
  'Ξ': 'E',  // U+039E
  '𝐄': 'E',  // U+1D405
  // f
  '𝐟': 'f',  // U+1D41F
  // F
  '𝔽': 'F',  // U+1D53D
  '𝐅': 'F',  // U+1D406
  'Ƒ': 'F',  // U+0191
  // g
  '𝐠': 'g',  // U+1D420
  // G
  '𝔾': 'G',  // U+1D53E
  '𝐆': 'G',  // U+1D407
  'ᴳ': 'G',  // U+1D2B
  // h
  'ʰ': 'h',  // U+02B0
  '𝐡': 'h',  // U+1D421
  // H
  '𝐇': 'H',  // U+1D408
  'ℍ': 'H',  // U+210D
  'н': 'H',  // U+043D
  'ℌ': 'H',  // U+210C
  // i
  '𝐢': 'i',  // U+1D422
  // I
  '𝕀': 'I',  // U+1D540
  '𝐈': 'I',  // U+1D409
  // j
  '𝐣': 'j',  // U+1D423
  '𝐥': 'l',  // U+1D42C
  // J
  '𝕁': 'J',  // U+1D541
  '𝐉': 'J',  // U+1D40A
  'ل': 'J',  // U+0644
  // k
  '𝐤': 'k',  // U+1D424
  // K
  'к': 'K',  // U+043A
  'κ': 'K',  // U+03BA
  '𝕂': 'K',  // U+1D542
  'Ҡ': 'K',  // U+0500
  '𝐊': 'K',  // U+1D40B
  // l
  // L
  'Ⱡ': 'L',  // U+2C60
  '𝕃': 'L',  // U+1D543
  'ʟ': 'L',  // U+02E0
  '𝐋': 'L',  // U+1D40C
  // m
  '𝐦': 'm',  // U+1D425
  // M
  'м': 'M',  // U+043C
  '𝕄': 'M',  // U+1D544
  'ᵐ': 'M',  // U+1D50C
  '𝐌': 'M',  // U+1D40D
  // n
  '𝐧': 'n',  // U+1D426
  // N
  '𝐍': 'N',  // U+1D40E
  'ℕ': 'N',  // U+2115
  'ℵ': 'N',  // U+2135
  'Ŋ': 'N',  // U+014A
  'ᴺ': 'N',  // U+1D1C
  // o
  '𝐨': 'o',  // U+1D427
  // O
  'ø': 'O',  // U+00F8
  'ᵒ': 'O',  // U+1D52C
  '𝐎': 'O',  // U+1D40F
  '𝕆': 'O',  // U+1D546
  // p
  '𝐩': 'p',  // U+1D428
  // P
  '𝐏': 'P',  // U+1D410
  '₽': 'P',  // U+20BD
  'ℙ': 'P',  // U+2119
  // q
  '𝐪': 'q',  // U+1D429
  // Q
  '𝐐': 'Q',  // U+1D411
  'ℚ': 'Q',  // U+211A
  // r
  '𝐫': 'r',  // U+1D42A
  // R
  '𝐑': 'R',  // U+1D412
  'ℝ': 'R',  // U+211D
  'ᴿ': 'R',  // U+1D2F
  'я': 'R',  // U+044F
  // s
  '𝐬': 's',  // U+1D42B
  // S
  '𝕊': 'S',  // U+1D54A
  '𝐒': 'S',  // U+1D413
  // t
  '𝐭': 't',  // U+1D42C
  // T
  '𝐓': 'T',  // U+1D414
  '𝕋': 'T',  // U+1D54B
  'т': 'T',  // U+0442
  '✟': 'T',  // U+271F

  // u
  '𝐮': 'u',  // U+1D42D
  // U
  '𝐔': 'U',  // U+1D415
  'ᵘ': 'U',  // U+1D50F
  '𝕌': 'U',  // U+1D54C
  // v
  '𝐯': 'v',  // U+1D42E
  // V
  '𝐕': 'V',  // U+1D416
  '𝕍': 'V',  // U+1D54D
  'ᴠ': 'V',  // U+1D60
  // w
  '𝐰': 'w',  // U+1D42F
  // W
  '𝐖': 'W',  // U+1D417
  '𝕎': 'W',  // U+1D54E
  // x
  '𝐱': 'x',  // U+1D430
  // X
  '𝐗': 'X',  // U+1D418
  '𝕏': 'X',  // U+1D54F
  // y
  '𝐲': 'y',  // U+1D431
  '𝕐': 'Y',  // U+1D550
  // Y
  '𝐘': 'Y',  // U+1D419
  // z
  '𝐳': 'z',  // U+1D432
  // Z
  '𝐙': 'Z',  // U+1D41A
  'ℤ': 'Z',  // U+2124
}



export const convertUnicode = (str: string) => {
  return str.replace(/./g, (char) => unicode_lookup[char] || char)
}

// #region Credit to Report (chivalry2stats.com)
const XPTable: number[] = [
  0, 200, 470, 875, 1415, 2090, 2900, 3845, 4925, 6140, 7240, 8450, 9770, 11200, 12740, 14390,
  16150, 18020, 20000, 22090, 24290, 26600, 29020, 31550, 34190
]

const MAX_TABLE_LEVEL = XPTable.length - 1
const MAX_XP_IN_TABLE = XPTable[MAX_TABLE_LEVEL]

export function GetLevelFromXP(XP: number): number {
  if (XP <= MAX_XP_IN_TABLE) {
    return XPTable.findIndex((_, index) => XP < XPTable[index + 1]) ?? 0
  }
  return CalculateLevel(XP)
}

export function CalculateLevel(XP: number): number {
  const [a, b, c] = [0.873, 2653.9, -30677 - XP]

  const discrim = b ** 2 - 4 * a * c
  if (discrim < 0) return -1

  return Math.floor((-b + Math.sqrt(discrim)) / (2 * a))
}

export const truncateAliasHistory = (aliasHistory: string, searchTerm: string) => {
  const aliases = aliasHistory.split(',')
  const matchIndex = aliases.findIndex(
    (alias) => alias.localeCompare(searchTerm, undefined, { sensitivity: 'base' }) === 0
  )

  if (matchIndex === -1) {
    return aliasHistory
  }

  const start = Math.max(0, matchIndex - 1)
  const end = Math.min(aliases.length, matchIndex + 2)

  const before = start > 0 ? '...' : ''
  const after = end < aliases.length ? '...' : ''

  return {
    matchedAlias: aliases[matchIndex],
    truncatedAliasHistory: `${before} ${aliases.slice(start, end).join(', ')} ${after}`.trim()
  }
}
// #endregion

export const formatSeconds = (num: number) => {
  return `${Math.floor(num)}s`
}

export function ConstructToastMessage(command: Command) {
  switch (command.type) {
    case 'ban':
      return `Banned ${command.player.playfabId} - ${command.reason} (${command.duration}h)`
    case 'kick':
      return `Kicked ${command.player.playfabId} - ${command.reason}`
    case 'list_players':
      return 'Refreshed List'
    case 'admin':
      return `Admin Say: ${command.message}`
    case 'server':
      return `Server Say: ${command.message}`
    default:
      return 'Unknown Command'
  }
}

const ConfettiOptions = {
  default: {
    particleCount: 100,
    angle: -90,
    spread: 100,
    startVelocity: 25,
    decay: 1,
    gravity: 1,
    drift: 0,
    flat: true,
    ticks: 200,
    origin: {
      x: 0.5,
      y: -1
    },
    scalar: 2
  }
}
ConfettiOptions['ban'] = {
  ...ConfettiOptions.default,
  shapes: [confetti.shapeFromText({ text: '🔨', scalar: 2 })]
}
ConfettiOptions['kick'] = {
  ...ConfettiOptions.default,
  shapes: [confetti.shapeFromText({ text: '🥾', scalar: 2 })]
}

export { ConfettiOptions }

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
    defaultValues: defaultValues || getDefaults(schema)
  })
}

function parseDateString(dateString: string): number | null {
  const [day, month, year] = dateString.split('/').map(Number)
  const date = new Date(year, month - 1, day)
  return isNaN(date.getTime()) ? null : date.getTime()
}

export function isTimestampInDayRange(timestamp: number, dateString: string): boolean {
  const dayStart = parseDateString(dateString)
  if (dayStart === null) return false
  const dayEnd = dayStart + 24 * 60 * 60 * 1000 - 1
  return timestamp >= dayStart && timestamp <= dayEnd
}
