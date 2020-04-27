const express = require('express')
const bodyParser = require('body-parser')
const graphQlHttp = require('express-graphql')
const { buildSchema } = require('graphql')


const app = express()
const PORT = 3000

app.use('/graphql', graphQlHttp({ //graphQl end-point
    //Define
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float
            data: String!
        }

        type RootQuery {
            events: [Event!]! 
        }

        type RootMutation {
             createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: { //Resolver
        //Implement
        events: () => { //resolver for querying events 
            return ['Romantic', 'Cooking', 'Cuddling', 'All-Night Work', 'Coding', 'Data'];
        },
        createEvent: (args ) => { //resolver for mutating/creating events
            const eventName = args.name;
            return eventName;

        }
    },
    graphiql: true //debug tool
  })
)


app.use(bodyParser.json())
app.listen(PORT, () => console.log(`APP: Server running on port ${PORT}`))  