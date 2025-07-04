import { Building2, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-architectural-dark text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-8 w-8 text-accent" />
              <div>
                <h3 className="text-xl font-bold">استوديو التصميم المعماري</h3>
                <p className="text-sm text-background/70">خدمات هندسية متكاملة</p>
              </div>
            </div>
            <p className="text-background/90 leading-relaxed">
              نحن متخصصون في تقديم حلول معمارية مبتكرة وعصرية تلبي احتياجات عملائنا 
              وتحقق رؤيتهم بأعلى معايير الجودة والاحترافية.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <Button key={index} variant="ghost" size="icon" className="hover:bg-background/10">
                  <Icon className="h-5 w-5" />
                </Button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">خدماتنا</h4>
            <ul className="space-y-3">
              {[
                "التصميم ثلاثي الأبعاد",
                "الرسم الهندسي",
                "المخططات المعمارية",
                "خدمات التشطيب",
                "الديكور الداخلي",
                "الاستشارات الهندسية"
              ].map((service, index) => (
                <li key={index}>
                  <a href="#" className="text-background/80 hover:text-accent transition-smooth">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">روابط سريعة</h4>
            <ul className="space-y-3">
              {[
                "الرئيسية",
                "عن الشركة",
                "أعمالنا",
                "العملاء",
                "المدونة",
                "اتصل بنا"
              ].map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-background/80 hover:text-accent transition-smooth">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">تواصل معنا</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-background/90">+966 50 123 4567</p>
                  <p className="text-sm text-background/70">متاح 24/7</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-background/90">info@architect-studio.com</p>
                  <p className="text-sm text-background/70">استجابة سريعة</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-background/90">الرياض، المملكة العربية السعودية</p>
                  <p className="text-sm text-background/70">مكتب رئيسي</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-background/70 text-sm">
            © 2024 استوديو التصميم المعماري. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-background/70 hover:text-accent text-sm transition-smooth">
              سياسة الخصوصية
            </a>
            <a href="#" className="text-background/70 hover:text-accent text-sm transition-smooth">
              شروط الاستخدام
            </a>
            <a href="#" className="text-background/70 hover:text-accent text-sm transition-smooth">
              ملفات تعريف الارتباط
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;