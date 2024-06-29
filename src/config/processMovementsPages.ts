import axios, { AxiosResponse } from 'axios'

export async function processMovementsPages(pageId: number): Promise<string> {
  try {
    const processMovementsPage =
      'https://pje-consulta-publica.tjmg.jus.br/pje/ConsultaPublica/DetalheProcessoConsultaPublica/listView.seam'

    const headers = {
      accept: '*/*',
      'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'sec-ch-ua':
        '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      cookie:
        'JSESSIONID=oFFQdjAs8m2X9Asr3DzDfPeQXYg0bIX7BLNNHVD-.pje1gconsulta-poapp01.intra.tjmg.gov.br; BIGipServerpje_21_cons_pub=rd1o00000000000000000000ffffac1b1e3eo8443',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    }

    const body = `AJAXREQUEST=j_id134%3Aj_id458&j_id134%3Aj_id531%3Aj_id532=${pageId}&j_id134%3Aj_id531=j_id134%3Aj_id531&autoScroll=&javax.faces.ViewState=j_id9&j_id134%3Aj_id531%3Aj_id533=j_id134%3Aj_id531%3Aj_id533&AJAX%3AEVENTS_COUNT=1&`

    const response: AxiosResponse<string> = await axios.post(
      processMovementsPage,
      body,
      { headers }
    )

    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
