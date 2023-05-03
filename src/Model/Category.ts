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
  image: string;
}

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isNew: {
      type: Boolean,
      default: false, // set default value to false
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const categorySchema: Schema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Menu: Model<IMenu> = mongoose.model<IMenu>("Menu", menuSchema);
const Category: Model<ICategory> = mongoose.model<ICategory>(
  "Category",
  categorySchema
);

export {Menu, Category};
