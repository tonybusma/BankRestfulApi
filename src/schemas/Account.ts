import mongoose, { model, Schema, Document } from "mongoose";
import Operation, { OperationInterface } from "./Operation";

export interface AccountInterface extends Document {
  cpf: string;
  password: string;
  name: string;
  email: string;
  phoneNumber: string;
  birthDate: Date;
  balance: Number;
  operationsHistory: Array<OperationInterface>;
}

const AccountSchema = new Schema({
  cpf: {
    type: String,
    unique: true,
    required: [true, "CPF is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  birthDate: {
    type: Date,
    required: [true, "Birth date is required"],
  },
  balance: {
    type: Number,
    default: 0,
  },
  operationsHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Operation,
    },
  ],
});

export default model<AccountInterface>("Account", AccountSchema);
