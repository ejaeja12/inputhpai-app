export { cn } from "cn"

export const formatRupiah = (cur: string | number) => {
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
export const removeNonDigits = (str: string | number) => {
  str = String(str)
  const formatted = str.replace(/[^0-9]/g, "")

  if (formatted === null || formatted === "") {
    return "0"
  }

  return formatted
}

export const formatSetRupiah = (v: string | number) =>
  formatRupiah(removeNonDigits(v))
