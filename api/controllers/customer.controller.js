const { create, getCustomerByMobile, getCustomerByCustomerId, getCustomerList, updateCustomer, deleteCustomer, updateAllBookingCustomer } = require("../services/customer.service")
const AppError = require('../../utils/appError');
module.exports = {
    createCustomer: async (req, res, next) => {
        try {
            const body = req.body;
            // check if customer already exist
            // Validate if customer exist in our database
            const oldCustomer = await getCustomerByMobile(body.customerMobile);
            if (oldCustomer) {
                // throw new Error("Customer Already Exist.");
                return res.status(200).json({
                    success: 0,
                    message: "Customer Already Exist.",
                    customerId: oldCustomer?.customerId ?? ""
                });
            }
            const result = await create(body);
            if (!result.affectedRows) {
                throw new Error('Failed! Create Customer');
            }
            console.log(result);
            return res.status(200).json({
                success: 1,
                message: "Customer created successfully",
                customerId: body?.customerId ?? ""
            });
        } catch (e) {
            next(e);
        }
    },

    getCustomerByCustomerId: async (req, res, next) => {
        try {
            const customerId = req.params.customerId;
            const result = await getCustomerByCustomerId(customerId);
            if (!result) {
                throw new AppError('Customer Record not found!', 404);
            }
            return res.json({
                success: 1,
                customer: result,
            });
        } catch (e) {
            next(e);
        }
    },

    getCustomerByCustomerMobile: async (req, res, next) => {
        try {
            const customerMobile = req.query.customerMobile;
            const result = await getCustomerByMobile(customerMobile);
            if (!result) {
                throw new AppError('Customer Record not found!', 404);
            }
            return res.json({
                success: 1,
                customer: result,
            });
        } catch (e) {
            next(e);
        }
    },

    getCustomerList: async (req, res, next) => {
        try {
            let limit = parseInt(req.query.limit);
            if(!limit){
                limit = 5
            }
            let offset = parseInt(req.query.offset);
            if(!offset){
                offset = 0
            }
            let searchQuery = req.query.searchQuery;
            if(!searchQuery){
                searchQuery = ""
            }
            const result = await getCustomerList(offset,limit,searchQuery);
            return res.json({
                success: 1,
                customerList: result,
            });
        } catch (e) {
            next(e);
        }
    },

    updateCustomer: async (req, res, next) => {
        try {
            const id = req.params.id;
            const body = req.body;
            // const salt = genSaltSync(10);
            // body.password = hashSync(body.password, salt);
            const result = await updateCustomer(id, body);
            if (!result.affectedRows) {
                throw new Error(`Failed to update customer record!`);
            }
            if(body.customerMobile){
                console.log(`Updating All Bookings By Customer Mobile :: ${body.customerMobile}`);
                updateAllBookingCustomer(body.customerMobile);
            }
            return res.json({
                success: 1,
                message: "customer updated successfully",
            });
        } catch (e) {
            next(e);
        }
    },

    deleteCustomer: async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await deleteCustomer(id);
            if (!result.affectedRows) {
                throw new Error(`Failed to delete customer record!`);
            }
            return res.json({
                success: 1,
                message: "customer deleted successfully",
            });
        } catch (e) {
            next(e);
        }
    },
}