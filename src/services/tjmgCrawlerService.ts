import axios from 'axios'
import cheerio from 'cheerio'

interface Participant {
  participant: string
  status: string
}

interface Movements {
  movement: string
  document: string | null
}

interface Documents {
  documentName: string
  documentLink: string | undefined
  receiptName: string
  receiptLink: string | undefined
}

export async function fetchDataFromPage(): Promise<object> {
  const url = `https://pje-consulta-publica.tjmg.jus.br/pje/ConsultaPublica/DetalheProcessoConsultaPublica/listView.seam?ca=d82c8105945561022939edd03612be078d57c87d0ea45b44`

  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    function extractText($: cheerio.Root, selector: string): string {
      return $(selector).text().trim()
    }

    const processo = extractText(
      $,
      '#j_id134\\:processoTrfViewView\\:j_id140 > div > div.value.col-sm-12 > div'
    )
    const dataAtribuicao = extractText(
      $,
      '#j_id134\\:processoTrfViewView\\:j_id152 > div > div.value.col-sm-12'
    )
    const classeJuridica = extractText(
      $,
      '#j_id134\\:processoTrfViewView\\:j_id163 > div > div.value.col-sm-12'
    )
    const assunto = extractText(
      $,
      '#j_id134\\:processoTrfViewView\\:j_id174 > div > div.value.col-sm-12 > div'
    )
    const jurisdição = extractText(
      $,
      '#j_id134\\:processoTrfViewView\\:j_id187 > div > div.value.col-sm-12'
    )
    const orgaoJulgador = extractText(
      $,
      '#j_id134\\:processoTrfViewView\\:j_id211 > div > div.value.col-sm-12'
    )

    const activePoleParticipants: Participant[] = []

    $('#j_id134\\:processoPartesPoloAtivoResumidoList\\:tb > tr').each(
      (_, element) => {
        const participant = $(element)
          .find('span[id*="j_id281"] > div > span')
          .text()
          .trim()
        const status = $(element)
          .find('span[id*="j_id317"] > div')
          .text()
          .trim()

        if (participant && status) {
          activePoleParticipants.push({ participant, status })
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
        const status = $(element)
          .find('td:nth-child(2) .col-sm-12')
          .text()
          .trim()

        if (participant && status) {
          passivePoleParticipants.push({ participant, status })
        }
      }
    )

    const processMovements: Movements[] = []

    $('#j_id134\\:processoEvento tbody tr').each((_, row) => {
      const movement = $(row).find('td div div span').text().trim()
      const document = $(row).find('td:nth-child(2) > a').text().trim()

      processMovements.push({ movement, document })
    })

    const documents: Documents[] = []

    $('#j_id134\\:processoDocumentoGridTab tbody tr').each((_, row) => {
      const documentName = $(row).find('td span a').eq(0).text().trim()
      const documentLink = $(row).find('td span a').eq(0).attr('href')

      const receiptName = $(row)
        .find('td:nth-child(2) span form div div a')
        .text()
        .trim()
      const receiptLink = $(row)
        .find('td:nth-child(2) span form div div a')
        .attr('href')

      documents.push({ documentName, documentLink, receiptName, receiptLink })
    })

    return {
      'Dados do Processo': {
        'Número Processo': processo,
        'Data da Distribuição': dataAtribuicao,
        'Classe Judicial': classeJuridica,
        Assunto: assunto,
        Jurisdição: jurisdição,
        'Órgão Julgador': orgaoJulgador,
      },
      'Polo Ativo': {
        Participants: activePoleParticipants,
      },
      'Polo Passivo': {
        Participantes: passivePoleParticipants,
      },
      'Movimentações do Processo': {
        Movements: processMovements,
      },
      'Documentos Juntados ao Processo': {
        Documents: documents,
      },
    }
  } catch (error: any) {
    throw new Error('Erro ao buscar nome na página do TJMG: ' + error.message)
  }
}
