const express = require('express')
const bodyParser = require('body-parser')
const graphQlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')

const app = express()
const events = [];

const PORT = 3000

app.use(bodyParser.json())

app.use('/graphql', graphQlHttp({ //graphQl end-point
    //Define
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float
            date: String!
        }

        type RootQuery {
            events: [Event!]! 
        }

        type RootMutation {
             createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: { //Resolver
        //Implement
        events: () => { //resolver for querying events 
            return events;
        },
        createEvent: args => { //resolver for mutating/creating events
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date().toISOString()
            }
            events.push(event)
            return event
        }
    },
    graphiql: true //debug tool
  })
)

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${
                    process.env.MONGO_PASS
                }@cruizelabs-rmkwy.mongodb.net/test?authSource=admin&replicaSet=cruizeLabs-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`)
                .then(() => {
                    app.listen(PORT, () => console.log(`APP: Server running on port ${PORT}`))
                }).catch(err => {
                    console.log('APP: Errorr [error starting server, connection to DB error!')
                })
