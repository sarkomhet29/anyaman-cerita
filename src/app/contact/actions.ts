"use server";

import { sendEmail, emailContactSubmission } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export type ContactState = {
  error: string | null;
  success: boolean;
};

export async function contactAction(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();

  // Validasi
  if (!name || !email || !subject || !message) {
    return { error: "Semua field wajib diisi", success: false };
  }

  if (message.length < 10) {
    return { error: "Pesan minimal 10 karakter", success: false };
  }

  try {
    // Simpan ke database untuk inbox admin
    await prisma.contactMessage.create({
      data: { nama: name, email, subjek: subject, pesan: message },
    });

    // Send email ke admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@anyamancerita.com";
    await sendEmail({
      to: adminEmail,
      subject: `[Contact Form] ${subject}`,
      html: emailContactSubmission(adminEmail, name, email, subject, message),
    });

    // Send auto-reply ke user
    await sendEmail({
      to: email,
      subject: "Kami terima pesan Anda - Anyaman Cerita",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Halo ${name},</p>
          <p>Terima kasih telah menghubungi kami. Kami telah menerima pesan Anda dan akan merespons sesegera mungkin.</p>
          <p>Tim Anyaman Cerita</p>
        </div>
      `,
    });

    return { error: null, success: true };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      error: "Gagal mengirim pesan. Coba lagi nanti.",
      success: false,
    };
  }
}
