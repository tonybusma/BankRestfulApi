import { model, Schema, Document } from "mongoose";

export interface OperationInterface extends Document {
  operationType: string;
  amount: number;
  operationDate: Date;
  to: string;
  from: string;
}

const OperationSchema = new Schema({
  operationType: {
    type: String,
    enum: ["deposit", "withdraw", "transferIn", "transferOut"],
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
  to: {
    type: String,
  },
  from: {
    type: String,
  },
});

export default model<OperationInterface>("Operation", OperationSchema);
