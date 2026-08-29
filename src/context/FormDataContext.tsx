"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type FormDataContextType = {
  formData: Record<string, string>;
  updateFormData: (data: Record<string, string>) => void;
};

const FormDataContext = createContext<FormDataContextType | undefined>(
  undefined
);

export function FormDataProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<Record<string, string>>({
    namaUtama: "Ayu & Bagas",
    jenisAcara: "Pernikahan",
    tanggalAcara: new Date().toISOString().split("T")[0],
    waktuAcara: "09.00 - selesai",
    lokasi: "Gedung Serbaguna Anggrek",
    alamatLengkap: "Jl. Contoh No. 10, Bogor",
    pesanUndangan: "Dengan penuh syukur, kami mengundang Bapak/Ibu...",
  });

  const updateFormData = (data: Record<string, string>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <FormDataContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormDataContext.Provider>
  );
}

export function useFormData() {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error("useFormData must be used within FormDataProvider");
  }
  return context;
}
