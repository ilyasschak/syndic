import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name : String,
    email : {
        type : String,
        unique : true
    },
    password : String,
    image : String,
    phoneNumber : String,
    token : String,
    address : String,
    role : {
        type: mongoose.Types.ObjectId,
        ref : "Role"
    },
    isVerified : Boolean
});

const RoleSchema = new mongoose.Schema({
    title : String
});

const ApartmentSchema = new mongoose.Schema({
    number : {type : Number, required : true},
    building : {type : Number, required : true},
    currentClient : {type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
    status : {type : String, enum : ['occupied', 'available'], required : true},
    isDeleted : {type : Boolean, required : true}
})

const PaymentSchema = new mongoose.Schema({
    apartmentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true },
    clientID : { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    month: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Cash', 'Bank'], required: true },
});

const ClientSchema = new mongoose.Schema({
    fullName : {type : String, required : true},
    cin : {type : String, required : true},
    isReside : {type : Boolean, required : true},
    isDeleted : {type : Boolean, required : true}
});

export {UserSchema, RoleSchema, ApartmentSchema, PaymentSchema, ClientSchema}