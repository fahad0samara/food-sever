import mongoose, {Schema, Document, Model} from "mongoose";

interface IMenu extends Document {
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
}

interface ICategory extends Document {
  name: string;
  description: string;
  items: IMenu[];
}

const menuSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const categorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Menu",
    },
  ],
});

const Menu: Model<IMenu> = mongoose.model<IMenu>("Menu", menuSchema);
const Category: Model<ICategory> = mongoose.model<ICategory>(
  "Category",
  categorySchema
);

export {Menu, Category};
