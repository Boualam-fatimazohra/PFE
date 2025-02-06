import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <ForgotPasswordForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default ForgotPassword;