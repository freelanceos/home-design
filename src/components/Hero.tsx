import { ArrowLeft, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-architecture.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="التصميم المعماري والهندسي" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-85"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl text-right">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-background/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Star className="h-4 w-4 text-accent" />
            <span className="text-background text-sm font-medium">أكثر من 500 مشروع ناجح</span>
          </div>
          
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-background mb-6 leading-tight">
            تصميم معماري
            <span className="block bg-gradient-accent bg-clip-text text-transparent">
              احترافي ومبتكر
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-xl text-background/90 mb-8 leading-relaxed max-w-2xl">
            نقدم خدمات شاملة في التصميم المعماري والرسم الهندسي للشقق والفيلات، 
            مع تصاميم ثلاثية الأبعاد واقعية وخدمات التشطيب عالية الجودة.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-1">500+</div>
              <div className="text-background/80 text-sm">مشروع مكتمل</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-1">15+</div>
              <div className="text-background/80 text-sm">سنة خبرة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-1">98%</div>
              <div className="text-background/80 text-sm">رضا العملاء</div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-end">
            <Button variant="outline" size="lg" className="bg-background/20 backdrop-blur-sm border-background/30 text-background hover:bg-background/30">
              <Play className="h-5 w-5" />
              شاهد أعمالنا
            </Button>
            <Button variant="hero" size="lg" className="text-lg px-8">
              ابدأ مشروعك الآن
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-1/2 transform translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-background/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-background/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;