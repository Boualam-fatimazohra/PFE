import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LoginForm } from "@/components/auth/LoginForm";
import black from '@/assets/images/odc_workflow.png';

const Index = () => {
  return (
    <div className="flex flex-col pt-16"> {/* Ajout de pt-16 pour éviter que le header cache le contenu */}
      <Header />
      
      <div className="flex flex-1">
        {/* Left side - Image */}
        <div className="w-1/2 h-[800px] flex items-center justify-end bg-white pr-4">
          <img
            src={black}
            alt="Illustration"
            className="w-[550px] max-w-l h-auto"
          />
        </div>
        
        {/* Right side - Login form */}
        <div className="w-1/2 flex items-center bg-white pl-4">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-bold mb-2">Bienvenue Formateur</h1>
            <p className="text-gray-600 mb-6">
              Connectez-vous pour accéder à votre espace.
            </p>
            
            <LoginForm />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};
export default Index;