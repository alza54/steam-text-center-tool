import './env'
import Koa from 'koa'
import json from 'koa-json'
import logger from 'koa-logger'
import api from './server/routes/api.js'
import jwt from 'koa-jwt'
import path from 'path'
import serve from 'koa-static'
import historyApiFallback from 'koa2-history-api-fallback'
import koaRouter from 'koa-router'
import koaBodyparser from 'koa-bodyparser'

const app = new Koa()
const router = koaRouter()

let port = process.env.PORT

app.use(koaBodyparser())
app.use(json())
app.use(logger())

app.use(async function (ctx, next) {
  let start = new Date()
  await next()
  let ms = new Date() - start
  console.log('%s %s - %s', ctx.method, ctx.url, ms)
})

app.use(async function (ctx, next) {
  try {
    await next()
  } catch (err) {
    if (err.status === 401) {
      ctx.status = 401
      ctx.body = {
        success: false,
        token: null,
        info: 'Protected resource, use Authorization header to get access'
      }
    } else {
      throw err
    }
  }
})

app.on('error', function (err, ctx) {
  console.log('server error', err)
})

router.use('/api', api.routes())

app.use(router.routes())
app.use(historyApiFallback())
app.use(serve(path.resolve('dist')))

export default app.listen(port, () => {
  console.log(`Koa is listening in ${port}`)
})
