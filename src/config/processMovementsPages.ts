import { AxiosResponse } from 'axios'
import { axiosInstance } from './axiosInstance'

export async function processMovementsPages(): Promise<string> {
  try {
    const processMovementsPage =
      'https://pje-consulta-publica.tjmg.jus.br/pje/ConsultaPublica/DetalheProcessoConsultaPublica/listView.seam'

    const responseBase = await axiosInstance.get(processMovementsPage)
    const cookies = responseBase.headers['set-cookie']

    const payload = {
      AJAXREQUEST: 'j_id134:j_id458',
      'j_id134:j_id531:j_id532': '3',
      'j_id134:j_id531': 'j_id134:j_id531',
      autoScroll: '',
      'javax.faces.ViewState': 'j_id14',
      'j_id134:j_id531:j_id533': 'j_id134:j_id531:j_id533',
      'AJAX:EVENTS_COUNT': '1',
    }

    const options = {
      headers: {
        Cookie: cookies,
      },
    }

    const response: AxiosResponse<string> = await axiosInstance.post(
      processMovementsPage,
      payload,
      options
    )

    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
