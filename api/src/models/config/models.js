import * as schemas  from "./schemas.js";
import mongoose from "mongoose";

const roleModel = mongoose.model('Role', schemas.RoleSchema);
const userModel = mongoose.model('User', schemas.UserSchema);
const apartmentModel = mongoose.model('Apartment', schemas.ApartmentSchema);
const paymentModel = mongoose.model('Payment', schemas.PaymentSchema);
const clientModel = mongoose.model('Client', schemas.ClientSchema);

export {userModel, roleModel, apartmentModel, paymentModel, clientModel}