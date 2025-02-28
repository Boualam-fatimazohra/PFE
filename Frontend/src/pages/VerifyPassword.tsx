import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VerifyCodeForm } from "@/components/auth/VerifyPasswordForm";
const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <VerifyCodeForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default ForgotPassword;