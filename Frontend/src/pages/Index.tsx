import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LoginForm } from "@/components/auth/LoginForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
        <div className="hidden md:block">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/32942b86facf465bad688d8f78f5f3fb/ed2c86458d897cb5162df4b728c8c0bbca362adb71c1405441300d7a1f625429?placeholderIfAbsent=true"
          alt="Login illustration"
          className="max-w-l mx-auto h-auto"
        />
      </div>


          
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Bienvenue Formateur
              </h1>
              <p className="text-gray-600 mb-8">
                Connectez-vous pour accéder à votre espace.
              </p>
              <LoginForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
