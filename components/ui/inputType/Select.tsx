"use client";

import { useState } from "react";
import Input from "@/components/ui/inputType/Input";
import Button from "@/components/ui/Button";

export interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  required?: boolean;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;

  /** placeholder */
  placeholder?: string;

  /** optional thêm mới */
  allowCreate?: boolean;
  onCreate?: (label: string) => void;
}

export default function Select({
  label,
  required,
  options,
  value,
  onChange,
  placeholder = "Chọn",
  allowCreate = false,
  onCreate,
}: SelectProps) {
  const [creating, setCreating] = useState(false);
  const [newValue, setNewValue] = useState("");

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {!creating ? (
        <select
          value={value ?? ""}
          onChange={(e) => {
            if (e.target.value === "__create__") {
              setCreating(true);
              return;
            }
            onChange?.(e.target.value);
          }}
          className="w-full rounded-xl border px-3 py-2 text-sm bg-white
                     focus:outline-none focus:ring-2 focus:ring-[#518581]/40"
        >
           {/* placeholder */}
            <option value="" disabled hidden>
            {`-- ${placeholder} --`}
            </option>

        {allowCreate && (
            <option value="__create__" className="font-semibold">+ Thêm mới</option>
          )}

          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="flex gap-2 items-center">
          <Input
            autoFocus
            placeholder="Nhập giá trị mới"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />

          <Button
            variant="primary"
            className="px-3 py-2"
            onClick={() => {
              if (!newValue.trim()) return;
              onCreate?.(newValue.trim());
              setCreating(false);
              setNewValue("");
            }}
          >
            Lưu
          </Button>

          <Button
            variant="ghost"
            className="px-3 py-2"
            onClick={() => {
              setCreating(false);
              setNewValue("");
            }}
          >
            Hủy
          </Button>
        </div>
      )}
    </div>
  );
}
