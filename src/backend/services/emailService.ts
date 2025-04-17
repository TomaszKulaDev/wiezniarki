import nodemailer from "nodemailer";
import { User } from "../models/User";

// Typy dla konfiguracji
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Typy dla opcji wiadomości
interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html: string;
}

/**
 * Konfiguracja transportera dla Nodemailer
 * Dostosowana do różnych środowisk: deweloperskiego i produkcyjnego
 */
const createTransporter = () => {
  // Sprawdzanie czy potrzebne zmienne środowiskowe są dostępne
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (!host || !user || !pass) {
    console.warn("Brak pełnej konfiguracji email w zmiennych środowiskowych");

    // W trybie deweloperskim zwracamy ethereal.email (testowy serwis email)
    if (process.env.NODE_ENV === "development") {
      return createEtherealTransporter();
    }

    throw new Error("Brak konfiguracji email - sprawdź zmienne środowiskowe");
  }

  const config: EmailConfig = {
    host,
    port,
    secure: port === 465, // Automatyczne rozpoznawanie czy port wymaga SSL
    auth: {
      user,
      pass,
    },
  };

  return nodemailer.createTransport(config);
};

/**
 * Tworzy tymczasowe konto testowe Ethereal dla celów deweloperskich
 * Pozwala na testowanie wysyłki emaili bez potrzeby prawdziwego serwera
 */
const createEtherealTransporter = async () => {
  // Generowanie testowego konta Ethereal
  const testAccount = await nodemailer.createTestAccount();

  // Logowanie danych testowego konta
  console.log("📧 Testowe konto email (ethereal.email):");
  console.log(`📧 Użytkownik: ${testAccount.user}`);
  console.log(`📧 Hasło: ${testAccount.pass}`);
  console.log(
    `📧 Sprawdź wysłane wiadomości na: https://ethereal.email/messages`
  );

  // Konfiguracja transportera
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

/**
 * Główna usługa email pozwalająca na wysyłanie różnych typów wiadomości
 */
export const emailService = {
  /**
   * Wysyła email weryfikacyjny do nowo zarejestrowanego użytkownika
   * @param email Adres email odbiorcy
   * @param verificationCode Kod weryfikacyjny
   * @returns Promise<boolean> Informacja o sukcesie operacji
   */
  async sendVerificationEmail(
    email: string,
    verificationCode: string
  ): Promise<boolean> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyUrl = `${appUrl}/verify-email?email=${encodeURIComponent(
      email
    )}&code=${verificationCode}`;

    const mailOptions: EmailOptions = {
      to: email,
      subject: "Weryfikacja konta w serwisie Więźniarki",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #1e50a0; margin-bottom: 10px;">Weryfikacja konta</h2>
            <p style="color: #555; font-size: 16px;">Dziękujemy za rejestrację w serwisie Więźniarki.pl</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin-bottom: 15px;">Aby aktywować swoje konto, kliknij w poniższy przycisk lub użyj kodu weryfikacyjnego:</p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${verifyUrl}" 
                style="background-color: #1e50a0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                Aktywuj konto
              </a>
            </div>
            
            <p style="margin-bottom: 5px;">Twój kod weryfikacyjny:</p>
            <div style="background-color: #e9f0f9; padding: 10px; border-radius: 4px; text-align: center; font-family: monospace; font-size: 18px; letter-spacing: 2px; margin-bottom: 15px;">
              ${verificationCode}
            </div>
            
            <p style="font-size: 14px; color: #777;">Kod weryfikacyjny jest ważny przez 24 godziny.</p>
          </div>
          
          <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">
            Jeśli nie zakładałeś/aś konta w serwisie Więźniarki, zignoruj tę wiadomość.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e1e1e1; margin: 20px 0;">
          
          <div style="text-align: center; font-size: 12px; color: #999;">
            &copy; ${new Date().getFullYear()} Więźniarki. Wszystkie prawa zastrzeżone.
          </div>
        </div>
      `,
    };

    return await this.sendEmail(mailOptions);
  },

  /**
   * Wysyła email z linkiem do resetowania hasła
   * @param email Adres email odbiorcy
   * @param resetToken Token resetowania hasła
   * @returns Promise<boolean> Informacja o sukcesie operacji
   */
  async sendPasswordResetEmail(
    email: string,
    resetToken: string
  ): Promise<boolean> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?email=${encodeURIComponent(
      email
    )}&token=${resetToken}`;

    const mailOptions: EmailOptions = {
      to: email,
      subject: "Resetowanie hasła w serwisie Więźniarki",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #1e50a0; margin-bottom: 10px;">Resetowanie hasła</h2>
            <p style="color: #555; font-size: 16px;">Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin-bottom: 15px;">Kliknij w poniższy przycisk, aby zresetować swoje hasło:</p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${resetUrl}" 
                style="background-color: #1e50a0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                Resetuj hasło
              </a>
            </div>
            
            <p style="font-size: 14px; color: #777;">Link do resetowania hasła jest ważny przez 1 godzinę.</p>
            <p style="font-size: 14px; color: #777;">Jeśli link przestanie działać, możesz wygenerować nowy na stronie logowania.</p>
          </div>
          
          <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">
            Jeśli nie prosiłeś/aś o reset hasła, zignoruj tę wiadomość. Twoje konto jest bezpieczne.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e1e1e1; margin: 20px 0;">
          
          <div style="text-align: center; font-size: 12px; color: #999;">
            &copy; ${new Date().getFullYear()} Więźniarki. Wszystkie prawa zastrzeżone.
          </div>
        </div>
      `,
    };

    return await this.sendEmail(mailOptions);
  },

  /**
   * Ogólna metoda do wysyłania emaili
   * @param options Opcje wiadomości email
   * @returns Promise<boolean> Informacja o sukcesie operacji
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // Tworzenie transportera
      const transporter = await (process.env.NODE_ENV === "development" &&
      !process.env.EMAIL_HOST
        ? createEtherealTransporter()
        : createTransporter());

      // Uzupełnienie opcji wiadomości
      const mailOptions = {
        from:
          process.env.EMAIL_FROM || '"Więźniarki" <noreply@wiezniarki.gov.pl>',
        ...options,
        // Dodanie prostej wersji tekstowej jeśli nie została dostarczona
        text: options.text || options.html.replace(/<[^>]*>/g, ""),
      };

      // Wysyłanie wiadomości
      const info = await transporter.sendMail(mailOptions);

      // W trybie deweloperskim wyświetl URL do przeglądania wiadomości (dla Ethereal)
      if (process.env.NODE_ENV === "development" && info.messageId) {
        console.log(
          `📧 Podgląd wiadomości: ${nodemailer.getTestMessageUrl(info)}`
        );
      }

      return true;
    } catch (error) {
      console.error("Błąd wysyłania emaila:", error);
      // W środowisku deweloperskim nie rzucamy błędu, aby nie blokować procesu
      if (process.env.NODE_ENV === "production") {
        throw new Error(
          `Nie udało się wysłać emaila: ${
            error instanceof Error ? error.message : "Nieznany błąd"
          }`
        );
      }
      return false;
    }
  },
};
