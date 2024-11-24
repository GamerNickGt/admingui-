import unicode_data from '../../../../tools/lookup_table/output/lookuptable.json'

const unicode_lookup = Object.fromEntries(
  Object.entries(unicode_data).flatMap(([key, values]) => values.map(([char]) => [char, key]))
)

export const convertUnicode = (str: string) => {
  return Array.from(str)
    .map((char) => unicode_lookup[char] || char)
    .join('')
}
