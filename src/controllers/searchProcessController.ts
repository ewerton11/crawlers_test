import { Request, Response } from 'express'
import { searchProcess } from '../config/searchProcess'
import { extractProcessUrl } from '../modules/extractProcessUrl'
import { URLBase } from '../config/axiosInstance'
import { fetchDataFromPage } from '../modules/fetchDataFromPage'

export const searchProcessControllerAsync = async (
  req: Request,
  res: Response
) => {
  const { processNumber }: { processNumber: string } = req.body

  const htmlProcess = await searchProcess(processNumber)

  const filteredUrl = await extractProcessUrl(htmlProcess)

  const fullUrl = URLBase + filteredUrl

  const process = await fetchDataFromPage(fullUrl)

  res.json({ dadosDoProcesso: process })
}
