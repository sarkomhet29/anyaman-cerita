import nodemailer from "nodemailer";

// Setup transporter (sesuaikan dengan email provider Anda)
// Untuk development, bisa pakai Gmail atau Mailtrap
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send email
 */
export async function sendEmail(params: EmailParams) {
  try {
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@anyamancerita.com",
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    console.log("Email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

/**
 * Email template: Undangan dibagikan
 */
export function emailUndanganDibagikan(
  tamuNama: string,
  undanganNama: string,
  undanganUrl: string
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px;">
        <h1 style="color: #333; margin: 0;">Anda Diundang!</h1>
        <p style="color: #666; font-size: 16px;">${undanganNama}</p>
      </div>

      <div style="padding: 20px; background-color: #fff;">
        <p>Halo ${tamuNama},</p>
        <p>Anda diundang untuk menghadiri acara "${undanganNama}".</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${undanganUrl}" style="display: inline-block; background-color: #333; color: white; padding: 12px 30px; text-decoration: none; border-radius: 24px; font-weight: bold;">
            Lihat Undangan
          </a>
        </p>
        <p>Silakan klik tombol di atas untuk melihat detail undangan dan konfirmasi kehadiran Anda.</p>
      </div>

      <div style="padding: 20px; background-color: #f8f9fa; border-top: 1px solid #e9ecef; text-align: center; font-size: 12px; color: #666;">
        <p>© 2026 Anyaman Cerita. Semua hak cipta dilindungi.</p>
      </div>
    </div>
  `;
}

/**
 * Email template: Payment confirmation
 */
export function emailPaymentConfirmation(
  userName: string,
  paketNama: string,
  amount: number
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #d4edda; padding: 20px; text-align: center; border-radius: 8px;">
        <h1 style="color: #155724; margin: 0;">Pembayaran Berhasil!</h1>
        <p style="color: #155724; font-size: 16px;">Terima kasih telah upgrade</p>
      </div>

      <div style="padding: 20px; background-color: #fff;">
        <p>Halo ${userName},</p>
        <p>Pembayaran Anda untuk paket <strong>${paketNama}</strong> telah berhasil diproses.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Ringkasan Pembayaran:</strong></p>
          <p style="margin: 10px 0;">Paket: ${paketNama}</p>
          <p style="margin: 10px 0; font-size: 18px; font-weight: bold;">
            Rp${amount.toLocaleString("id-ID")}
          </p>
        </div>

        <p>Anda sekarang memiliki akses penuh ke semua fitur paket ${paketNama}.</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background-color: #333; color: white; padding: 12px 30px; text-decoration: none; border-radius: 24px; font-weight: bold;">
            Buka Dashboard
          </a>
        </p>
      </div>

      <div style="padding: 20px; background-color: #f8f9fa; border-top: 1px solid #e9ecef; text-align: center; font-size: 12px; color: #666;">
        <p>© 2026 Anyaman Cerita. Semua hak cipta dilindungi.</p>
      </div>
    </div>
  `;
}

/**
 * Email template: Contact form submission
 */
export function emailContactSubmission(
  adminEmail: string,
  senderName: string,
  senderEmail: string,
  subject: string,
  message: string
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #e7f3ff; padding: 20px; text-align: center; border-radius: 8px;">
        <h1 style="color: #0066cc; margin: 0;">Pesan Baru dari Kontak</h1>
      </div>

      <div style="padding: 20px; background-color: #fff;">
        <p><strong>Dari:</strong> ${senderName}</p>
        <p><strong>Email:</strong> ${senderEmail}</p>
        <p><strong>Subjek:</strong> ${subject}</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Pesan:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>

        <p style="text-align: center; margin: 30px 0;">
          <a href="mailto:${senderEmail}" style="display: inline-block; background-color: #333; color: white; padding: 12px 30px; text-decoration: none; border-radius: 24px; font-weight: bold;">
            Balas Email
          </a>
        </p>
      </div>
    </div>
  `;
}
