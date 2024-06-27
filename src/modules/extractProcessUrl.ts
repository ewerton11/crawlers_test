import cheerio from 'cheerio'

export async function extractProcessUrl(
  html: string
): Promise<string | undefined> {
  const $ = cheerio.load(html)
  const tdElement = $('.rich-table-cell').find('a')

  if (tdElement.length > 0) {
    const onclickValue: string | undefined = tdElement.attr('onclick')
    const match = onclickValue?.match(
      /\/pje\/ConsultaPublica\/DetalheProcessoConsultaPublica\/listView\.seam\?ca=[^'"]+/
    )
    if (match) {
      const filteredUrl = match[0]
      return filteredUrl
    } else {
      console.log('URL não encontrada.')
    }
  } else {
    console.log('Elemento não encontrado.')
  }

  return undefined
}
