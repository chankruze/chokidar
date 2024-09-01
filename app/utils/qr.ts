import QRCode from "qrcode";

interface JsonData {
  [key: string]: any;
}

export const generateQRCode = async (jsonData: JsonData) => {
  try {
    const jsonString = JSON.stringify(jsonData);
    const qrCodeDataUrl = await QRCode.toDataURL(jsonString);
    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    return "";
  }
};
