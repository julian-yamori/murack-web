import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Checkbox, FormControlLabel } from "@mui/material";

/**
 * Checkbox 共通化 (MUI と React Hook Form の統合)
 */
export function FormCheckbox<TFieldValues extends FieldValues>(
  { control, name, label }: {
    control: Control<TFieldValues>;
    name: FieldPath<TFieldValues>;
    label?: string;
  },
) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          }
          label={label}
        />
      )}
    />
  );
}
