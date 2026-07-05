const BIN_ID = "6a4ac855f5f4af5e2963b97f";
const MASTER_KEY = "$2a$10$CgmEegY2swGwpkEg.t4cZ.mJm7oonTYE.iQuVyfQX4qumPppmHCdi";
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// ─── Cloudinary ────────────────────────────────────────────
const CLOUDINARY_CLOUD = "sfdktww4";
const CLOUDINARY_PRESET = "cukurcofee";

export async function uploadToCloudinary(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", CLOUDINARY_PRESET);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
    { method: "POST", body: fd }
  );
  if (!res.ok) throw new Error("Cloudinary upload failed");
  const data = await res.json();
  return data.secure_url as string;
}

// ─── Types ─────────────────────────────────────────────────
export interface ExtraOffer {
  id: number;
  name: string;
  oldPrice: number;
  newPrice: number;
  items: string[];
  image: string;
  accent?: string;
  tagline?: string;
}

export interface AdminData {
  menuOverrides: Record<string, string>;   // { "Latte": "350" }      — price
  nameOverrides: Record<string, string>;   // { "Latte": "Latte X" }  — name
  promos: Record<string, string>;          // { "Latte": "جديد" }
  extraOffers: ExtraOffer[];
}

export const defaultAdminData: AdminData = {
  menuOverrides: {},
  nameOverrides: {},
  promos: {},
  extraOffers: [],
};

export async function fetchAdminData(): Promise<AdminData> {
  try {
    const res = await fetch(`${BASE_URL}/latest`, {
      headers: { "X-Bin-Meta": "false" },
    });
    if (!res.ok) return defaultAdminData;
    const d = await res.json();
    return { ...defaultAdminData, ...d };
  } catch {
    return defaultAdminData;
  }
}

export async function saveAdminData(data: AdminData): Promise<boolean> {
  try {
    const res = await fetch(BASE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": MASTER_KEY,
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}
