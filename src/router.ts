import express from 'express'
import { fetchDataFromPage } from './services/tjmgCrawlerService'

const router = express.Router()

router.get('/client/123456789', async (req, res) => {
  try {
    const DadosDoProcesso = await fetchDataFromPage(
      'https://pje-consulta-publica.tjmg.jus.br/pje/ConsultaPublica/DetalheProcessoConsultaPublica/listView.seam?ca=d82c8105945561022939edd03612be078d57c87d0ea45b44'
    )
    res.json({ DadosDoProcesso })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/client/987654321', async (req, res) => {
  try {
    const DadosDoProcesso = await fetchDataFromPage(
      'https://pje-consulta-publica.tjmg.jus.br/pje/ConsultaPublica/DetalheProcessoConsultaPublica/listView.seam?ca=2402bd8244b84fc5602703d4477f7af88d57c87d0ea45b44'
    )
    res.json({ DadosDoProcesso })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
