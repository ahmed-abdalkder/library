
import {GraphQLSchema,GraphQLObjectType,GraphQLString, GraphQLList, GraphQLID,} from 'graphql';
import User from '../../../../db/models/user.model.js';
  import bcrypt from 'bcrypt'
import { graphqlvalidate } from '../../../util/validationschema.js';
import { createuservalidate } from '../user.validte.js';
import  jwt  from 'jsonwebtoken';

  export const userschema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'query',
      fields: {
        findusers: {
          type: new GraphQLList(new GraphQLObjectType({
            name:"findusers",
            fields:{
              name:{type:GraphQLString},
              email:{type:GraphQLString},
              password:{type:GraphQLString},
              role:{type:GraphQLString},
         },
       })),
          resolve:async()=>{

            const users = await User.find()
            
            return users
          }
        },
      },
    }),
        getuser: {
          type: new GraphQLObjectType({
            name:"getuser",
            fields:{
              name:{type:GraphQLString},
              email:{type:GraphQLString},
              password:{type:GraphQLString},
              role:{type:GraphQLString},
         },
       }),
       args:{
        id: { type: GraphQLID },
         
    },
    resolve:async(_,args)=>{
        const{id} = args
        const user = await User.findById(id)
        if(!user){
          throw new Error( "user does not exist")
        }
        return user
          }
        },
    
      mutation: new GraphQLObjectType({
        name: 'mutation',
        fields: {
      createuser: {
        type: new GraphQLObjectType({
          name:"postuser",
          fields:{
               name:{type:GraphQLString},
               email:{type:GraphQLString},
               password:{type:GraphQLString},
               role:{type:GraphQLString},
          },
        }),
       args:{
               name:{type:GraphQLString},
               email:{type:GraphQLString},
               password:{type:GraphQLString},
               role:{type:GraphQLString},
       },
         
           resolve:async(_,args)=>{
           const{name,email,password,role} = args

           await graphqlvalidate(createuservalidate,args)

           const userexist = await User.findOne({email})

           if(userexist){

            throw new Error( "user lready exist")
           }

           const hash = bcrypt.hashSync(password, 12)

           const user = await User.create({
            name,email,password:hash,role
           })

           return user
   
        },
      }
    }
  }),
  
  mutation: new GraphQLObjectType({
    name: 'mutation',
    fields: {
  updateuser: {
    type: new GraphQLObjectType({
      name:"update",
      fields:{
           name:{type:GraphQLString},
           email:{type:GraphQLString},
           password:{type:GraphQLString},
           role:{type:GraphQLString},
      },
    }),
   args:{
           name:{type:GraphQLString},
           email:{type:GraphQLString},
           password:{type:GraphQLString},
           role:{type:GraphQLString},
           id:{type:GraphQLID},
   },
     
       resolve:async(_,args)=>{
       const{name,email,password,role,id} = args

       const userexist = await User.findById(id)

       if(!userexist){

        throw new Error( "user does not exist")
       }

       const hash = bcrypt.hashSync(password, 12)

       const user = await User.findByIdAndUpdate({_id: id},{

        name, email, password:hash, role
       },{new: true})

       return user

    },
  }
}
}),
mutation: new GraphQLObjectType({
  name: 'mutation',
  fields: {
signin: {
  type: GraphQLString,
    
 args:{
         
     email:{type:GraphQLString},
     password:{type:GraphQLString},
 },
   
     resolve:async(_,args)=>{

     const{ email,password } = args

     const userexist = await User.findOne({email})

     if(!userexist || !bcrypt.compareSync(password,userexist.password)){

      throw new Error( "user does not exist or password invalied")
     }

     const token = jwt.sign({id:userexist._id,role:userexist.role},"tokenkey")


     return token

  },
}
}
})
})
 