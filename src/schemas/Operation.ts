import { model, Schema, Document } from "mongoose";

export interface OperationInterface extends Document {
  operationType: string;
  amount: number;
  operationDate: Date;
}

const OperationSchema = new Schema({
  operationType: {
    type: String,
    enum: ["deposit", "withdraw", "transfer"],
    required: [true, "Operation type is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  operationDate: {
    type: Date,
    default: Date.now,
  },
});

export default model<OperationInterface>("Operation", OperationSchema);
