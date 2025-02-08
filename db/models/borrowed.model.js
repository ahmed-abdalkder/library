
import mongoose from 'mongoose';

const borrowedBookSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  

    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },    

    Borrowingtimeperday: {type:String},

    status: { type: String, enum: ['borrowed', 'returned'], default: 'borrowed' }  

},{
    timestamps:true,
    versionKey:false
});

const BorrowedBook = mongoose.model('BorrowedBook', borrowedBookSchema);
export default BorrowedBook;