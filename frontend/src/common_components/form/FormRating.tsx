import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Rating } from "@mui/material";

/**
 * Rating 共通化 (MUI と React Hook Form の統合)
 */
export function FormRating<TFieldValues extends FieldValues>(
  { control, name }: {
    control: Control<TFieldValues>;
    name: FieldPath<TFieldValues>;
  },
) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Rating
          {...field}
          value={field.value ?? 0}
          onChange={(_, value) => field.onChange(value ?? 0)}
          max={5}
          size="large"
        />
      )}
    />
  );
}
