"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Field, FieldContent, FieldLabel } from "../ui/field"
import { Button } from "../ui/button"
import InputCurrency from "../input-currency"
import InputNumber from "../input-number"
import { Input } from "../ui/input"
import { formatSetRupiah } from "@/lib/utils"
import { getWibTime } from "@/lib/utils"

type inputItems = {
  id: number
  name: string
  count: number
  price: number
  sum: number
}

export default function HomeContainer() {
  const [member, setMember] = useState({
    name: "",
    id: "",
    phone: "",
    total: 0,
  })

  const [items, setItems] = useState<inputItems[]>([
    {
      id: 0,
      name: "",
      count: 0,
      price: 0,
      sum: 0,
    },
  ])

  useEffect(() => {
    setMember((prev) => ({
      ...prev,
      total: items.reduce((acc, item) => acc + item.count * item.price, 0),
    }))
  }, [items])

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        id: prev.length,
        name: "",
        count: 0,
        price: 0,
        sum: 0,
      },
    ])
  }
  function updateItem(id: number, patch: Partial<inputItems>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)))
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, sum: i.count * i.price } : i))
    )
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const adaKosong = items.some((i) => i.count === 0 || i.price === 0)
    if (adaKosong) {
      alert("Ada field yang kosong")
      return
    }

    const bonHeader = `*=== Belanja HPAI  \u2014  ${getWibTime()} ====*`
    const bonMember = `Name \t: ${member.name} \nId \t\t: ${member.id} ${member.phone && `\nphone :  ${member.phone}`}\n\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014`
    const bonItem = items
      .map(
        (i) =>
          i.name &&
          i.count > 0 &&
          i.price > 0 &&
          `*${i.name}${i.name.length < 5 ? "\t\t\t" : "\t"} ${i.count}* \t\u2022\`\`\`${formatSetRupiah(i.price).split("Rp")[1].split(".")[0]}\`\`\` = \`\`\`${formatSetRupiah(i.sum)}\`\`\``
      )
      .join("\n")

    const finalBon = `${bonHeader}\n\n${bonMember}\n${bonItem} \n\n\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\n *Total : ${formatSetRupiah(member.total)}*`
    const url = `https://wa.me/${process.env.NEXT_PUBLIC_HP}?text=${encodeURIComponent(finalBon)}`
    window.open(url, "_blank")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold">Member</h1>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-5">
          <Field className="">
            <FieldLabel>Name</FieldLabel>
            <FieldContent>
              <Input
                required
                placeholder="Nama member"
                value={member.name}
                onChange={(e) => setMember({ ...member, name: e.target.value })}
              ></Input>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Id</FieldLabel>
            <FieldContent>
              <Input
                required
                placeholder="Id Member"
                value={member.id}
                onChange={(e) => setMember({ ...member, id: e.target.value })}
              ></Input>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Phone</FieldLabel>
            <FieldContent>
              <Input
                value={member.phone}
                placeholder="08xxxxxxxx"
                onChange={(e) =>
                  setMember({ ...member, phone: e.target.value })
                }
              ></Input>
            </FieldContent>
          </Field>
        </CardContent>
      </Card>

      {/* ==== ITEM ==== */}

      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold">Items</h1>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {items.map((item, index) => (
            <div key={item.id} className="flex gap-5">
              <Field>
                {index === 0 && <FieldLabel>Name</FieldLabel>}

                <FieldContent className="flex flex-col">
                  <Input
                    required
                    placeholder="Nama item"
                    onChange={(val) => {
                      updateItem(item.id, { name: val.target.value })
                    }}
                    value={item.name}
                  ></Input>
                </FieldContent>
              </Field>

              <InputNumber
                label="Count"
                index={index}
                displayValue={item.count}
                handleInput={(val) =>
                  updateItem(item.id, {
                    count:
                      item.count === 0 ? item.count + Number(val) : Number(val),
                  })
                }
              />

              <InputCurrency
                label="Price"
                index={index}
                handleInput={(val) =>
                  updateItem(item.id, { price: Number(val) })
                }
              />

              <InputCurrency
                label="Sum"
                index={index}
                displayValue={item.count * item.price}
                disabled
              />
              <Field className="flex w-fit flex-col justify-end">
                <Button
                  onClick={() => removeItem(item.id)}
                  className="w-fit"
                  tabIndex={-1}
                >
                  Delete
                </Button>
              </Field>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ==== Button add item ===== */}

      <div className="flex justify-between">
        <div className="flex gap-5">
          <Button onClick={() => addItem()} className="w-24">
            Add item
          </Button>
          <Button type="submit" className="w-24 bg-blue-600">
            Submit
          </Button>
        </div>
        <div>
          Total:{" "}
          <span className="font-bold">
            {formatSetRupiah(
              items.reduce((acc, item) => acc + item.count * item.price, 0)
            )}
          </span>
        </div>
      </div>
    </form>
  )
}
