import Joi from "joi";
interface MenuData {
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

interface CategoryData {
  name: string;
  description: string;
  image: string;
}

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

interface IAdmin extends IUser {}

// new menu validation
const menuValidation = (data: MenuData) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
  });
  return schema.validate(data);
};

// new category validation
const categoryValidation = (data: CategoryData) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().required(),
  });
  return schema.validate(data);
};

const userValidation = (data: IUser) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),

    role: Joi.string().valid("user", "admin").required(),
  });
  return schema.validate(data);
};

const adminValidation = (data: IAdmin) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    role: Joi.string().valid("user", "admin").required(),
  });
  return schema.validate(data);
};

const Loginadmin = (data: IAdmin) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

export {
  menuValidation,
  categoryValidation,
  Loginadmin,
  userValidation,
  adminValidation,
};
