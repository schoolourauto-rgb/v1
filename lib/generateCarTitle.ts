type CarTitleInput = {
  year?: string
  make?: string
  model?: string
  version?: string
  fuel?: string
  transmission?: string
}

export function generateCarTitle({
  year = "",
  make = "",
  model = "",
  version = "",
  fuel = "",
  transmission = "",
}: CarTitleInput) {
  return `${year} ${make} ${model} ${version} ${fuel} ${transmission}`
    .replace(/\s+/g, " ")
    .trim()
}

export function generateTitleFromDescription(description: string) {
  const extract = (label: string, regex: RegExp) =>
    description.match(regex)?.[1]?.trim() || ""

  return `
${extract("Year", /Year\s*:-\s*(\d{4})/i)}
${extract("Make", /Make\s*:-\s*(.*)/i)}
${extract("Model", /Model\s*:-\s*(.*)/i)}
${extract("Version", /Version\s*:-\s*(.*)/i)}
${extract("Fuel", /Fuel\s*:-\s*(.*)/i)}
${extract("Transmission", /Transmission\s*:-\s*(.*)/i)}
`
    .replace(/\s+/g, " ")
    .trim()
}
