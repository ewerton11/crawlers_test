import { AxiosResponse } from 'axios'
import { URLBase, axiosInstance } from './axiosInstance'

export async function searchProcess(processNumber: string): Promise<string> {
  try {
    const responseBase = await axiosInstance.get(URLBase)

    const cookies = responseBase.headers['set-cookie']

    const payload = {
      AJAXREQUEST: '_viewRoot',
      'fPP:numProcesso-inputNumeroProcessoDecoration:numProcesso-inputNumeroProcesso':
        processNumber,
      mascaraProcessoReferenciaRadio: 'on',
      'fPP:j_id150:processoReferenciaInput': '',
      'fPP:dnp:nomeParte': '',
      'fPP:j_id168:nomeSocial': '',
      'fPP:j_id177:alcunha': '',
      'fPP:j_id186:nomeAdv': '',
      'fPP:j_id195:classeProcessualProcessoHidden': '',
      tipoMascaraDocumento: 'on',
      'fPP:dpDec:documentoParte': '',
      'fPP:Decoration:numeroOAB': '',
      'fPP:Decoration:j_id230': '',
      'fPP:Decoration:estadoComboOAB':
        'org.jboss.seam.ui.NoSelectionConverter.noSelectionValue',
      fPP: 'fPP',
      autoScroll: '',
      'javax.faces.ViewState': 'j_id1',
      'fPP:j_id236': 'fPP:j_id236',
      'AJAX:EVENTS_COUNT': '1',
    }

    // Converte o objeto para formato x-www-form-urlencoded
    const params = new URLSearchParams(payload).toString()

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookies,
      },
    }

    const response: AxiosResponse<string> = await axiosInstance.post(
      URLBase,
      params,
      config
    )

    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
