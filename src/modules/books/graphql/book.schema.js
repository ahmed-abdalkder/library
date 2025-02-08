import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import Book from './../../../../db/models/book.model.js';
import { authgraphql } from "../../../middleware/graphqlauth.js";
 



export const bookschema = new GraphQLSchema({
    query:new GraphQLObjectType({
        name:"query",
        fields:{
            getbooks:{
            type:new GraphQLList( new GraphQLObjectType({
                name:"getbooks",
                fields:{
                    title: { type: GraphQLString },
                    author: { type: GraphQLString },
                    genre: { type: GraphQLString },
                    publishedYear: { type: GraphQLInt },
                    copiesAvailable: { type: GraphQLInt }            

                },
            })),
            resolve:async()=>{

                const book = await Book.find({})

                return book
            }
          }
        }
    }),
      getbook:{
            type: new GraphQLObjectType({
                name:"getbook",
                fields:{
                    
                    title: { type: GraphQLString },
                    author: { type: GraphQLString },
                    genre: { type: GraphQLString },
                    publishedYear: { type: GraphQLInt },
                    copiesAvailable: { type: GraphQLInt }            

                },
            }),
            args:{

                id: { type: GraphQLID },
                 
            },
            resolve:async(_,args)=>{

                const book = await Book.findById({_id: args.id})

                if(!book){

                    throw new Error( "book does not exist")
                }

                return book
            }
          },
    mutation:new GraphQLObjectType({
        name:"mutation",
        fields:{
            createBook:{

            type: new GraphQLObjectType({
                name:"addbook",
                fields:{

                    title: { type: GraphQLString },
                    author: { type: GraphQLString },
                    genre: { type: GraphQLString },
                    publishedYear: { type: GraphQLInt },
                    copiesAvailable: { type: GraphQLInt },          
                 },
            }),
            args:{
                
                title: { type: GraphQLString },
                author: { type: GraphQLString },
                genre: { type: GraphQLString },
                publishedYear: { type: GraphQLInt },
                copiesAvailable: { type: GraphQLInt },
                token: { type: GraphQLString },

            },
            resolve:async(_,args)=>{

                const{title,author,genre,publishedYear,copiesAvailable} = args

                const user = await authgraphql(args.token, ['admin', 'member'])

                const bookexist = await Book.findOne({title})

                if(bookexist){

                    throw new Error( "book already exist")
                }

                const book = await Book.create({

                    title, author, genre, publishedYear, copiesAvailable

                });

                return book
            }
          }
        }
    }),
})