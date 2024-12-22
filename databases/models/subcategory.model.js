import  mongoose  from 'mongoose';

const subCategorySchema = new mongoose.Schema({
    name: {
        type:String,
        unique: [true,'name is required'],
        trim:true,
        required:true,
        minLength: [2, 'too short category name']
    },
    slug: {
        type:String,
        lowercase:true,
        required:true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"category"
    }
}, { Timestamps:true })

export const subCategoryModel=mongoose.model('subCategory',subCategorySchema)