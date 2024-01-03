import ClientModel from "../models/clientModel.js";
import ApartmentModel from "../models/apartmentModel.js";
import { apartmentModel, clientModel } from "../models/config/models.js";
import validation from "../validations/apartmentValidation.js";
import errorHandler from "../validations/validationsErrorHandler.js";

export default class ApartmentController {
    static async insertApartment(req, res) {
        try {
            let { number, building, currentClient, fullName, cin, status } = req.body;
            
            const validateResult =
                currentClient == "addNew"
                  ? validation.validateApartmentNewClient(req, res)
                  : validation.validateApartment(req, res);
            
            if (validateResult.error) { // 3
              errorHandler(validateResult.error);
            }            
          
            if (currentClient === "addNew") { // 4
                if(await clientModel.findOne({cin : cin , isDeleted : false})){
                    throw "cin already exist";
                }
                const client = { fullName, cin };
                const clientInserted = await ClientModel.Insert(client);
                currentClient = clientInserted._id;
            } else if (currentClient === "") {
                currentClient = null;
            } else {
                await clientModel.findOneAndUpdate(
                    { _id: currentClient, isReside: false },
                    { $set: { isReside: true } }
                );
            }

            const apartment = { number, building, currentClient, status };
            await ApartmentModel.Insert(apartment);//3

            res.status(201).json({
                success: "Apartment Successfully Added!",
            });
        } catch (error) {
            res.status(400).json({
                error: error,
            });
        }
    }

    static async getAllApartments(req, res) {
        try {
            res.send(await ApartmentModel.GetAll());
        } catch (error) {
            res.status(400).json({error : error});
        }
    }

    static async getApartment(req, res) {
        try {
            res.send(await ApartmentModel.GetOne(req.params.id));
        } catch (error) {
            res.status(400).json({ error : error});
        }
    }

    static async updateApartment(req, res) {
        try {
            let {
                _id,
                number,
                building,
                currentClient,
                fullName,
                cin,
                status,
                oldClient,
            } = req.body;

            const validateResult =
            currentClient === "addNew"
              ? validation.validateApartmentNewClient(req, res)
              : validation.validateApartment(req, res);
              
              
            if (validateResult.error) {
            errorHandler(validateResult.error);
            }

            if (currentClient === "addNew") {
                const client = { fullName, cin };
                const clientInserted = await ClientModel.Insert(client);
                currentClient = clientInserted._id;
            } else if (currentClient === "") {
                currentClient = null;
            } else {
                await clientModel.findOneAndUpdate(
                    { _id: currentClient, isReside: false },
                    { $set: { isReside: true } }
                );
            }

            const apartment = { _id, number, building, currentClient, status };

            await ApartmentModel.Update(apartment);

            if (oldClient) {
                (await apartmentModel.find({ currentClient: oldClient, isDeleted : false }))
                    .length === 0
                    ? await clientModel.findByIdAndUpdate(oldClient, {
                          isReside: false,
                      })
                    : "";
            }

            res.status(201).json({ success : "Apartment Successfully Updated !"});
        } catch (error) {
            res.status(400).json({error : error});
        }
    }

    static async deleteApartment(req, res) {
        try {
            const deletedApartment = await ApartmentModel.Delete(req.params.id);

            (
                await apartmentModel.find({
                    currentClient: deletedApartment.currentClient,
                    isDeleted : false
                })
            ).length === 0
                ? await clientModel.findByIdAndUpdate(deletedApartment.currentClient, {
                      isReside: false,
                  })
                : "";

            res.status(200).json({ success : "Apartment deleted successfully !"});
        } catch (error) {
            res.status(400).json({error : error});
        }
    }
}
