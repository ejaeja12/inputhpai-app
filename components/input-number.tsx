import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "./ui/field"

type InputFieldProps = {
  hidden?: boolean
  label: string
  className?: string
  index?: number
  initialValue?: string | number
  displayValue?: string | number | undefined
  disabled?: boolean
  required?: boolean
  placeHolder?: string
  handleInput?: ((e: string) => void) | undefined
}

const formatRupiah = (cur: string | number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(typeof cur === "string" ? parseInt(cur) : cur)
}

/**
 * mengembalikan value berupa angka (nominal) tanpa character2 selain angka dalam bentuk string
 * @param str
 * @returns string
 */
const removeNonDigits = (str: string | number) => {
  str = String(str)
  const formatted = str.replace(/[^0-9]/g, "")

  if (formatted === null || formatted === "") {
    return "0"
  }

  return formatted
}

export default function InputNumber({
  hidden = false,
  label,
  initialValue = "0",
  displayValue = undefined,
  index = 0,
  className = "",
  required = false,
  disabled = false,
  placeHolder = "",
  handleInput = undefined,
}: InputFieldProps) {
  const [nominal, setNominal] = useState(String(initialValue))
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNominal(e.target.value)

    if (handleInput !== undefined) {
      handleInput(removeNonDigits(e.target.value))
    }
  }

  return (
    <>
      <Field className={`${className}`} hidden={hidden}>
        {index === 0 && (
          <FieldLabel htmlFor="username">
            {label}

            {required && <span className="text-red-600">*</span>}
          </FieldLabel>
        )}
        <Input
          id="username"
          disabled={disabled}
          type="text"
          hidden={hidden}
          required
          maxLength={14}
          value={removeNonDigits(displayValue ?? nominal)}
          placeholder={placeHolder}
          onChange={handleChange}
        />
        <input type="hidden" />
      </Field>
    </>
  )
}
