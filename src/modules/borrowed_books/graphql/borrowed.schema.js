import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import BorrowedBook from "../../../../db/models/borrowed.model.js";
import { authgraphql } from './../../../middleware/graphqlauth.js';


export const borrowedschema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name:"query",
        fields:{
            getborroweds:{
                type:new GraphQLList(new GraphQLObjectType({
                    name:"borroweds",
                    fields:{
                        userId:{type:GraphQLID},
                        bookId:{type:GraphQLID},
                        Borrowingtimeperday: { type: GraphQLString },
                        status: { type: GraphQLString }
                    }
                })),
                resolve:async()=>{

                    const borrowed = await BorrowedBook.find({})

                    return borrowed
                }
            }
        }
    }),
     mutation : new GraphQLObjectType({
        name: "mutation",
        fields: {
            createBorrowed: {  
                type: new GraphQLObjectType({
                    name: "borrowed",
                    fields: {
                        userId: { type: GraphQLID },
                        bookId: { type: GraphQLID },
                        Borrowingtimeperday: { type: GraphQLInt },
                        status: { type: GraphQLString }
                    }
                }),
                args: {
                    userId: { type: GraphQLID },
                    bookId: { type: GraphQLID },
                    Borrowingtimeperday: { type: GraphQLInt },
                    status: { type: GraphQLString },
                    token: { type: GraphQLString }
                },
                resolve: async (_, args) => {
                    const { userId, bookId, Borrowingtimeperday, status } = args;
    
                    const user = await authgraphql(args.token, ["admin", "member"]);
    
                    const borrowedex = await BorrowedBook.findOne({ bookId, status: "borrowed" });
    
                    if (borrowedex) {
                        throw new Error("Book is already borrowed");
                    }
    
                    const borrowed = await BorrowedBook.create({
                        userId,
                        bookId,
                        Borrowingtimeperday,
                        status
                    });
    
                    return borrowed;
                }
            },
        
   
     updateborrowed:{
                type:new GraphQLObjectType({
                    name:"updateborrowed",
                    fields:{
                        
                        status: { type: GraphQLString }
                    }
                }),
                args:{
                         
                        id:{type:GraphQLID},
                        token: { type: GraphQLString }

                 },
                resolve:async(_,args)=>{

                    const{ id } = args

                     const user = await authgraphql(args.token, ['admin', 'member'])
                     
                     const borrowedex = await BorrowedBook.findOne({_id:id, status: "returned" });
                     if(borrowedex){

                        throw new Error( "book is returned ")
                   }
                     const borrowed = await BorrowedBook.findByIdAndUpdate(

                        {_id: id,userId: user.id},{status: "returned"

                        },{new:true});

                    
                    return borrowed
                }
            }
        }
    })
 
})