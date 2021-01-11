import { UserModel } from "../models/user.model"
import { hash, hashSync } from "bcrypt"

export const SeedSuperadmin = () => {
    const userData = {
        "nickname": "Chef1",
        "password": "123456",
        "emailAddress": "chef1@mail.com"
    }
    return UserModel.findOrCreate({
        where: { nickname: userData.nickname },
        defaults: userData
    })
}