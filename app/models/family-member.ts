import mongoose from "mongoose";

export interface FamilyMember extends mongoose.Document {
  patient_id: mongoose.Schema.Types.ObjectId;
  name: string;
  relation: 'spouse' | 'child' | 'parent' | 'sibling' | 'other';
  age: number;
  gender: 'male' | 'female' | 'other';
  contact?: string;
  is_active: boolean;
}

const familyMemberSchema = new mongoose.Schema(
  {
    patient_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Patient' },
    name: { type: String, required: true, trim: true },
    relation: { 
      type: String, 
      required: true,
      enum: ['spouse', 'child', 'parent', 'sibling', 'other']
    },
    age: { type: Number, required: true, min: 1, max: 120 },
    gender: { 
      type: String, 
      required: true,
      enum: ['male', 'female', 'other']
    },
    contact: { type: String, trim: true },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.FamilyMember ||
  mongoose.model<FamilyMember>("FamilyMember", familyMemberSchema);