import api from '../controllers/api.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.post('/text/center', api.center)
// router.get('/text/measure', api.hello)

export default router
