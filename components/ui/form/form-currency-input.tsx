import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DollarSign, Euro } from "lucide-react";
import { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { NumericFormat } from "react-number-format";

type Currency = "USD" | "EUR";

const CURRENCY_CONFIG = {
  USD: { icon: DollarSign, separator: ",", decimal: "." },
  EUR: { icon: Euro, separator: ",", decimal: "." },
} as const;

interface FormCurrencyInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  defaultCurrency?: Currency;
}

export function FormCurrencyInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  className,
  required,
  defaultCurrency = "EUR",
}: FormCurrencyInputProps<T>) {
  const [currency, setCurrency] = useState<Currency>(defaultCurrency);
  const config = CURRENCY_CONFIG[currency];
  const CurrencyIcon = config.icon;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-0">
          <FormLabel>
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <div className={cn("flex", className)}>
              <Select
                value={currency}
                onValueChange={(value) => setCurrency(value as Currency)}
              >
                <SelectTrigger className="w-18 rounded-r-none border-r-0 p-2 focus:ring-0">
                  <SelectValue>
                    <CurrencyIcon className="h-2 w-2" />
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-2 w-2" />
                      <span>USD</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="EUR">
                    <div className="flex items-center gap-2">
                      <Euro className="h-2 w-2" />
                      <span>EUR</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <NumericFormat
                value={field.value}
                onValueChange={(values) => field.onChange(values.value)}
                thousandSeparator={config.separator}
                decimalSeparator={config.decimal}
                decimalScale={2}
                placeholder={placeholder}
                customInput={Input}
                className="rounded-l-none"
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
