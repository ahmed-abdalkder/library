 


export const graphqlvalidate = (schema,data)=>{

    const{error} = schema.validate(data,{abortErly:false})

    if(error){

        throw new Error(error.details[0].message)
    }

    return true
    
}