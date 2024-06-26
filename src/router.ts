import express from 'express'
import { fetchDataFromPage } from './services/tjmgCrawlerService'

const router = express.Router()

router.get('/get-name', async (req, res) => {
  try {
    const DadosDoProcesso = await fetchDataFromPage()
    res.json({ DadosDoProcesso })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
