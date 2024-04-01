const { create, getAdminByMobile, updateAdmin, deleteAdmin, getAdminList, getAdminByAdminId } = require('../services/admin.service');
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require('jsonwebtoken');
const AppError = require('../../utils/appError');
module.exports = {

    createAdmin: async (req, res, next) => {
        try {
            const body = req.body;
            // check if user already exist
            // Validate if user exist in our database
            const oldUser = await getAdminByMobile(body.mobile);
            if (oldUser) {
                throw new Error("Admin Already Exist. Please Login");
            }
            const salt = genSaltSync(10);
            body.password = hashSync(body.password, salt);
            const result = await create(body);
            if (!result.affectedRows) {
                throw new Error('Failed! Create Admin');
            }
            // delete body.password;
            // Create token
            const token = sign(
                { result: body },
                process.env.TOKEN_KEY,
                { expiresIn: "30d" }
            );
            return res.status(200).json({
                success: 1,
                message: "Admin created successfully",
                adminId : result?.insertId ?? "",
                password: body.password,
                token: token
            });
        } catch (e) {
            next(e);
        }
    },

    login: async (req, res, next) => {
        try {
            const body = req.body;
            const user = await getAdminByMobile(body.mobile);
            console.log("user++>",user);
            if (user === null || user === undefined) {
                throw new Error('Invalid mobile or password');
            }
            const result = compareSync(body?.password, user?.password);
            if (result) {
                // delete user?.password;
                const token = sign({
                    result: user,
                },
                    process.env.TOKEN_KEY, {
                    expiresIn: "30d",
                }
                );
                return res.json({
                    success: 1,
                    message: "login successfully",
                    userId: user.id.toString(),
                    userName: user.userName,
                    userRole: user.userRole,
                    password: user.password,
                    email: user.email,
                    mobile: user.mobile,
                    token: token
                });
            } else {
                throw new Error("Invalid contact or password");
            }
        } catch (e) {
            next(e);
        }
    },

    getAdminByAdminId: async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await getAdminByAdminId(id);
            if (!result) {
                throw new AppError('Record not found!', 404);
            }
            return res.json({
                success: 1,
                admin: result,
            });
        } catch (e) {
            next(e);
        }
    },

    getAdminList: async (req, res, next) => {
        try {
            const result = await getAdminList();
            return res.json({
                success: 1,
                adminList: result,
            });
        } catch (e) {
            next(e);
        }
    },

    updateAdmin: async (req, res, next) => {
        try {
            const id = req.params.id;
            const body = req.body;
            const salt = genSaltSync(10);
            body.password = hashSync(body.password, salt);
            const result = await updateAdmin(id, body);
            if (!result.affectedRows) {
                throw new Error(`Failed to update admin record!`);
            }
            return res.json({
                success: 1,
                password: body.password,
                message: "admin updated successfully",
            });
        } catch (e) {
            next(e);
        }
    },

    deleteAdmin: async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await deleteAdmin(id);
            if (!result.affectedRows) {
                throw new Error(`Failed to delete admin record!`);
            }
            return res.json({
                success: 1,
                message: "admin deleted successfully",
            });
        } catch (e) {
            next(e);
        }
    },
}