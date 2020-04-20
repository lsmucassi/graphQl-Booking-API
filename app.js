const express = require('express')
const bodyParser = require('body-parser')
const graphQlHttp = require('express-graphql')
const { buildSchema } = require('graphql')


const app = express()
const PORT = 3000

app.use('/graphql', graphQlHttp({
    schema: buildSchema(`
        type RootQuery {
            event: [String!]
        }
        type RootMutation {
             createEvents(name: String): String
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {},
}))


app.use(bodyParser.json())
app.listen(PORT, () => console.log(`APP: Server running on port ${PORT}`))  