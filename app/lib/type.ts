import {
  type LucideIcon,
  User,
  Users,
  Calendar,
  MapPin,
  Flag,
  UserCheck,
} from "lucide-react";

export enum SchemaField {
  FirstName = "first_name",
  LastName = "last_name",
  Gender = "gender",
  Age = "age",
  AccountName = "account_name",
  City = "city",
  State = "state",
}

export const SchemaLabels: Record<SchemaField, string> = {
  [SchemaField.FirstName]: "First Name",
  [SchemaField.LastName]: "Last Name",
  [SchemaField.Gender]: "Gender",
  [SchemaField.Age]: "Age",
  [SchemaField.AccountName]: "Account Name",
  [SchemaField.City]: "City",
  [SchemaField.State]: "State",
};

export const SchemaIcons: Record<SchemaField, LucideIcon> = {
  [SchemaField.FirstName]: User,
  [SchemaField.LastName]: UserCheck,
  [SchemaField.Gender]: Users,
  [SchemaField.Age]: Calendar,
  [SchemaField.AccountName]: UserCheck,
  [SchemaField.City]: MapPin,
  [SchemaField.State]: Flag,
};

export type TraitType = "user" | "group";

export type Option = {
  label: string;
  value: SchemaField;
  type: TraitType;
};

const FIELD_TYPES: Record<SchemaField, TraitType> = {
  [SchemaField.FirstName]: "user",
  [SchemaField.LastName]: "user",
  [SchemaField.Gender]: "user",
  [SchemaField.Age]: "user",
  [SchemaField.AccountName]: "group",
  [SchemaField.City]: "group",
  [SchemaField.State]: "group",
};

export const ALL_OPTIONS: Option[] = Object.entries(SchemaLabels).map(
  ([key, label]) => {
    const value = key as SchemaField;
    return {
      label,
      value,
      type: FIELD_TYPES[value],
    };
  }
);

export type SegmentPayload = {
  segment_name: string;
  schema: Record<string, string>[];
};
