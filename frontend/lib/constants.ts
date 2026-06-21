export const PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Gilgit-Baltistan",
  "Azad Jammu & Kashmir",
] as const;

export const CITIES_BY_PROVINCE: Record<string, string[]> = {
  Punjab: [
    "Lahore", "Faisalabad", "Rawalpindi", "Gujranwala", "Multan",
    "Sialkot", "Bahawalpur", "Sargodha", "Sheikhupura", "Jhang",
    "Rahim Yar Khan", "Gujrat", "Sahiwal", "Wah Cantonment", "Kasur",
  ],
  Sindh: [
    "Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah",
    "Mirpur Khas", "Jacobabad", "Shikarpur", "Khairpur", "Thatta",
  ],
  "Khyber Pakhtunkhwa": [
    "Peshawar", "Mardan", "Mingora", "Kohat", "Abbottabad",
    "Mansehra", "Charsadda", "Nowshera", "Dera Ismail Khan", "Swabi",
  ],
  Balochistan: [
    "Quetta", "Gwadar", "Turbat", "Khuzdar", "Hub",
    "Chaman", "Zhob", "Loralai", "Dera Murad Jamali", "Sibi",
  ],
  "Islamabad Capital Territory": ["Islamabad"],
  "Gilgit-Baltistan": ["Gilgit", "Skardu", "Chilas", "Ghanche"],
  "Azad Jammu & Kashmir": ["Muzaffarabad", "Mirpur", "Rawalakot", "Bagh"],
};

export const PAYMENT_METHODS = [
  { value: "cod", label: "Cash on Delivery", discount: 0 },
  { value: "easypaisa", label: "EasyPaisa", discount: 15 },
  { value: "jazzcash", label: "JazzCash", discount: 15 },
  { value: "bank_transfer", label: "Bank Transfer", discount: 15 },
] as const;

export const FREE_SHIPPING_THRESHOLD = 3000;
export const SHIPPING_FEE = 200;
export const ONLINE_PAYMENT_DISCOUNT_PERCENT = 15;

export const BRAND = {
  navy: "#1B2B5E",
  navyDark: "#0f1829",
  navyLight: "#EEF1FA",
  gold: "#C9A84C",
  goldDark: "#A8893A",
  goldLight: "#FDF6E3",
  whatsapp: "#25d366",
} as const;

export const SITE_MAX_WIDTH = "1500px";

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export const PRODUCT_CATEGORIES = [
  { value: "eyeglasses", label: "Eyeglasses" },
  { value: "sunglasses", label: "Sunglasses" },
  { value: "contact-lenses", label: "Contact Lenses" },
  { value: "accessories", label: "Accessories" },
] as const;

export const PRODUCT_GENDERS = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "unisex", label: "Unisex" },
  { value: "kids", label: "Kids" },
] as const;

export const WHATSAPP_NUMBER = "923001234567";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
