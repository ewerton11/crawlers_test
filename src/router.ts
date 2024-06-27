import express from 'express'
import { searchProcessControllerAsync } from './controllers/searchProcessController'

const router = express.Router()

router.post('/process', searchProcessControllerAsync)

export default router
