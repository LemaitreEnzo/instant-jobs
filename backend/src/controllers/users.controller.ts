import type { Request, Response } from "express";
import { User } from "src/models/users.model";

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