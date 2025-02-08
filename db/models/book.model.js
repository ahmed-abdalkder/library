
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({

    title: { type: String, required: true }, 
    
    author: { type: String, required: true },

    genre: { type: String },  

    publishedYear: { type: Number },  

    copiesAvailable: { type: Number, default: 1 }  

},{
    timestamps:true,
    versionKey:false
});

const Book = mongoose.model('Book', bookSchema);

export default Book;