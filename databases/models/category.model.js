import  mongoose  from 'mongoose';

const categorySchema = mongoose.Schema({
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
    image:String,
}, { Timestamps:true })

categorySchema.post("init", (doc) => {
    doc.image = process.env.BASE_URL + "/category/" + doc.image;
  });
  

export const categoryModel=mongoose.model('category',categorySchema)