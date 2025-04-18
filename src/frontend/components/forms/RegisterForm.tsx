import { useState, FormEvent } from "react";
import Link from "next/link";
import PasswordInput from "@/frontend/components/common/PasswordInput";

interface RegisterFormProps {
  onSubmit: (formData: {
    email: string;
    password: string;
    confirmPassword: string;
    role: "prisoner" | "partner";
    acceptTerms: boolean;
  }) => void;
  isSubmitting: boolean;
}

export default function RegisterForm({
  onSubmit,
  isSubmitting,
}: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"prisoner" | "partner">("partner");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, confirmPassword, role, acceptTerms });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Adres email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="twoj@email.com"
        />
      </div>

      <PasswordInput
        id="password"
        label="Hasło"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Minimum 8 znaków"
        minLength={8}
        autoComplete="new-password"
        helpText="Hasło musi mieć co najmniej 8 znaków"
      />

      <PasswordInput
        id="confirm-password"
        label="Potwierdź hasło"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Powtórz hasło"
        minLength={8}
        autoComplete="new-password"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jestem:
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="partner"
              checked={role === "partner"}
              onChange={() => setRole("partner")}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="ml-2 text-gray-700">Partnerem</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="prisoner"
              checked={role === "prisoner"}
              onChange={() => setRole("prisoner")}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="ml-2 text-gray-700">Więźniarką</span>
          </label>
        </div>
      </div>

      <div className="flex items-start">
        <input
          id="terms"
          type="checkbox"
          required
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          Akceptuję{" "}
          <Link href="/regulamin" className="text-primary hover:underline">
            regulamin serwisu
          </Link>{" "}
          i{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            politykę prywatności
          </Link>
        </label>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white py-2 px-4 rounded-md transition-colors ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
          style={{ backgroundColor: "#1e50a0" }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Przetwarzanie...
            </span>
          ) : (
            "Zarejestruj się"
          )}
        </button>
      </div>
    </form>
  );
}
