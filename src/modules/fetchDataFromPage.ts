import axios from 'axios'
import cheerio from 'cheerio'
import { processMovementsPages } from '../config/ProcessMovementsPages'

interface Participant {
  participant: string
  situation: string
}

interface Movements {
  movement: string
  documentName: string | null
  documentLink: string | null
}

interface Documents {
  documentName: string
  documentLink: string | undefined
  receiptName: string
  receiptLink: string | undefined
}

export async function fetchDataFromPage(url: string): Promise<object> {
  try {
    const response = await axios.get(url)

    const $ = cheerio.load(response.data)

    function extractText(selector: string): string {
      return $(selector).text().trim()
    }

    const processo = extractText(
      '#j_id134\\:processoTrfViewView\\:j_id140 > div > div.value.col-sm-12 > div'
    )
    const dataAtribuicao = extractText(
      '#j_id134\\:processoTrfViewView\\:j_id152 > div > div.value.col-sm-12'
    )
    const classeJuridica = extractText(
      '#j_id134\\:processoTrfViewView\\:j_id163 > div > div.value.col-sm-12'
    )
    const assunto = extractText(
      '#j_id134\\:processoTrfViewView\\:j_id174 > div > div.value.col-sm-12 > div'
    )
    const jurisdição = extractText(
      '#j_id134\\:processoTrfViewView\\:j_id187 > div > div.value.col-sm-12'
    )
    const orgaoJulgador = extractText(
      '#j_id134\\:processoTrfViewView\\:j_id211 > div > div.value.col-sm-12'
    )

    const activePoleParticipants: Participant[] = []
    $('#j_id134\\:processoPartesPoloAtivoResumidoList\\:tb > tr').each(
      (_, element) => {
        const participant = $(element)
          .find('span[id*="j_id281"] > div > span')
          .text()
          .trim()
        const situation = $(element)
          .find('span[id*="j_id317"] > div')
          .text()
          .trim()
        if (participant && situation) {
          activePoleParticipants.push({ participant, situation })
        }
      }
    )

    const passivePoleParticipants: Participant[] = []
    $('#j_id134\\:processoPartesPoloPassivoResumidoList\\:tb tr').each(
      (_, element) => {
        const participant = $(element)
          .find('td:nth-child(1) .col-sm-12 span')
          .text()
          .trim()
        const situation = $(element)
          .find('td:nth-child(2) .col-sm-12')
          .text()
          .trim()
        if (participant && situation) {
          passivePoleParticipants.push({ participant, situation })
        }
      }
    )

    const processMovements: Movements[] = []

    // const elements = $(
    //   '#j_id134\\:j_id531\\:j_id532 > tbody > tr:nth-child(1) > td.rich-inslider-right-num'
    // )

    // const totalPage = elements.text().trim()
    // const totalPageNumber = Number(totalPage)

    // const allMovementsPages = await processMovementsPages()

    // const $allPages = cheerio.load(allMovementsPages)

    // $allPages

    // console.log($allPages)

    $('#j_id134\\:processoEvento tbody tr').each((_, row) => {
      const $row = $(row)
      const movement = $row.find('td div div span').text().trim()
      const documentName = $row.find('td:nth-child(2) > a').text().trim()
      let documentLink = ''

      const $tdElement = $row.find('.rich-table-cell a')

      if ($tdElement.length > 0) {
        const onclickValue = $tdElement.attr('onclick')
        if (onclickValue) {
          const match = onclickValue.match(/'([^']+)'(?=\);)/)

          if (match && match[1]) {
            documentLink = match[1]
          }
        }
      }

      processMovements.push({ movement, documentName, documentLink })
    })

    const documents: Documents[] = []
    $('#j_id134\\:processoDocumentoGridTab tbody tr').each((_, row) => {
      const documentNameFull = $(row).find('td span a').eq(0).text().trim()
      const documentName = documentNameFull
        .replace(/^Visualizar documentos/, '')
        .trim()

      const documentLinkFull = $(row).find('td span a').eq(0).attr('onclick')
      let documentLink = ''

      if (documentLinkFull) {
        const match = documentLinkFull.match(/'https:\/\/[^']+'/)

        if (match) {
          documentLink = match[0].replace(/^'(.*)'$/, '$1')
        }
      }

      const receiptName = $(row)
        .find('td:nth-child(2) span form div div a')
        .text()
        .trim()

      const receiptLinkFull = $(row)
        .find('td:nth-child(2) span form div div a')
        .attr('onclick')
      let receiptLink = ''

      if (receiptLinkFull) {
        const match = receiptLinkFull.match(/'\/pje\/[^']+PDF\.seam[^']+'/)
        if (match) {
          receiptLink = match[0].replace(/^'(.*)'$/, '$1')
        }
      }

      documents.push({ documentName, documentLink, receiptName, receiptLink })
    })

    return {
      DadosDoProcesso: {
        NúmeroProcesso: processo,
        DataDaDistribuição: dataAtribuicao,
        ClasseJudicial: classeJuridica,
        Assunto: assunto,
        Jurisdição: jurisdição,
        ÓrgãoJulgador: orgaoJulgador,
      },
      PoloAtivo: { Participants: activePoleParticipants },
      PoloPassivo: { Participantes: passivePoleParticipants },
      MovimentaçõesDoProcesso: { Movements: processMovements },
      DocumentosJuntadosAoProcesso: { Documents: documents },
    }
  } catch (error) {
    throw new Error('Erro ao buscar nome na página do TJMG: ' + error)
  }
}
