
import express from 'express'
import connectionDB from './db/connectiondb.js'
import { createHandler } from 'graphql-http/lib/use/express';
import  Playground from 'graphql-playground-middleware-express'
import { bookschema } from './src/modules/books/graphql/book.schema.js';
import { userschema } from './src/modules/users/graphql/user.schema.js';
import { borrowedschema } from './src/modules/borrowed_books/graphql/borrowed.schema.js';
  const expressPlayground = Playground.default

const app = express()
const port = 3000

app.use(express.json())

connectionDB()

app.use('/user/graphql', createHandler({ schema: userschema }));
 app.use('/book/graphql', createHandler({ schema:bookschema }));
 app.use('/borrowed/graphql', createHandler({ schema:borrowedschema }));
 app.get('/user/playground', expressPlayground({ endpoint: '/user/graphql' }))
 app.get('/book/playground', expressPlayground({ endpoint: '/book/graphql' }))
 app.get('/borrowed/playground', expressPlayground({ endpoint: '/borrowed/graphql' }))

app.use('*', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))