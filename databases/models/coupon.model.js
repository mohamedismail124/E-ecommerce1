import  mongoose  from 'mongoose';


const couponSchema = mongoose.Schema({
    code: {
        type:String,
        trim:true,
        required: [true,'coupon code required'],
        unique:true
    },
    discount: {
        type: Number,
        min:"product",
        required: [true,'coupon discount required']
    },
    expires: {
        type: Date,
        required: [true,'coupon date required']
    }

}, { Timestamps:true })

export const couponModel=mongoose.model('coupon',couponSchema)