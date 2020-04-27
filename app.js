const express = require('express')
const bodyParser = require('body-parser')
const graphQlHttp = require('express-graphql')
const { buildSchema } = require('graphql')


const app = express()
const PORT = 3000

app.use('/graphql', graphQlHttp({ //graphQl end-point
    schema: buildSchema(`
        type RootQuery {
            events: [String!]! 
        }

        type RootMutation {
             createEvents(name: String): String
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: { //Resolver
        events: () => {
            return
        }
    },
}))


app.use(bodyParser.json())
app.listen(PORT, () => console.log(`APP: Server running on port ${PORT}`))  