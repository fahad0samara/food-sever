const Joi = require("joi");
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
// new menu validation
const menuValidation = (data: MenuData) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
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

export {menuValidation, categoryValidation};
