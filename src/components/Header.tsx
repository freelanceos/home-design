import { Building2, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">استوديو التصميم المعماري</h1>
              <p className="text-xs text-muted-foreground">خدمات هندسية متكاملة</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-foreground hover:text-primary transition-smooth">
              الخدمات
            </a>
            <a href="#portfolio" className="text-foreground hover:text-primary transition-smooth">
              أعمالنا
            </a>
            <a href="#chat" className="text-foreground hover:text-primary transition-smooth">
              تواصل معنا
            </a>
          </nav>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Phone className="h-4 w-4" />
              اتصل بنا
            </Button>
            <Button variant="hero" size="sm">
              <Mail className="h-4 w-4" />
              استشارة مجانية
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;