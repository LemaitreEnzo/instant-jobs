import type { Request, Response } from "express";
import { User } from "src/models/users.model";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import getEnv from "../../utils/envHelper"; 

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        res.status(200);
        res.json({users});
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getOneUser = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const user = await User.findOne({where: {id: id}});
        res.status(200);
        res.json({user});
    } catch (error) {
        res.status(500).json(error);
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const user = await User.create(data);  
        res.status(201);
        res.json({user});
    } catch (error) {
        res.status(500).json(error);
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const user = await User.update(data, {where: {id: req.params.id}});
        res.status(206);
        res.json({user});
    } catch (error) {
        res.status(500).json(error);
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.destroy({where: {id: req.params.id}});
        res.status(204);
        res.json();
    } catch (error) {
        res.status(500).json(error);
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        // Get request's data for the token
        const email: string = req.body.email;
        const password: string = req.body.password;
        const user = await User.findOne({where: {email}});
        //Check if à user with the email exist
        if (user) {
            const passwordCheck = await bcrypt.compare(password, user.password_hash);
            if (passwordCheck) {
                const secret = getEnv('SECRET');
                const payload = {id: user.id};
                const jwtToken = jwt.sign(payload, secret);
                res.cookie('token', jwtToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 24 * 60 * 60 * 1000
                });
                res.status(200).json("Création du cookie");
            }else{
                return res.status(401).json("Mot de passe incorrecte");
            }
        }else{
            return res.status(401).json("Aucun compte avec cette email n'a était trouvé");
        }
    } catch (error) {
        res.status(500).json(error);
    }
}