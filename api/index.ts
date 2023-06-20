import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import jsonServer from 'json-server'
import { VercelRequest, VercelResponse } from '@vercel/node'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const server = jsonServer.create()
const middlewares = jsonServer.defaults()

const rewrite = jsonServer.rewriter({
  '/api/*': '/$1',
})

const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')).toString())
const router = jsonServer.router(db)

server.use(middlewares)
server.use(rewrite)
server.use(router)

export default (req: VercelRequest, res: VercelResponse) => {
  const { url } = req

  if (url && url.startsWith('/api')) {
    server(req, res)
  } else {
    res.status(404).send('Not Found')
  }
}
