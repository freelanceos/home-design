import { Box, PenTool, Palette, Ruler } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import threeDImage from "@/assets/3d-design.jpg";
import twoDImage from "@/assets/2d-plans.jpg";
import finishingImage from "@/assets/finishing-services.jpg";

const Services = () => {
  const services = [
    {
      icon: Box,
      title: "التصميم ثلاثي الأبعاد",
      description: "تصاميم واقعية ومذهلة للشقق والفيلات مع إمكانية جولة افتراضية كاملة",
      image: threeDImage,
      features: ["تصميم واقعي بدقة عالية", "جولات افتراضية تفاعلية", "تصور دقيق للألوان والمواد", "عروض بصرية احترافية"]
    },
    {
      icon: PenTool,
      title: "الرسم الهندسي والمخططات",
      description: "مخططات معمارية دقيقة ومفصلة تلبي أعلى المعايير الهندسية",
      image: twoDImage,
      features: ["مخططات معمارية مفصلة", "رسوم تنفيذية دقيقة", "مقاسات وأبعاد محددة", "مطابقة للمعايير الهندسية"]
    },
    {
      icon: Palette,
      title: "خدمات التشطيب والديكور",
      description: "حلول تشطيب متكاملة من التصميم حتى التنفيذ بأعلى مستويات الجودة",
      image: finishingImage,
      features: ["تشطيبات فاخرة ومبتكرة", "اختيار المواد والألوان", "إشراف على التنفيذ", "ضمان الجودة والتسليم في الموعد"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
            <Ruler className="h-4 w-4 text-primary" />
            <span className="text-primary font-medium">خدماتنا المميزة</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            نحول أحلامك إلى
            <span className="block text-primary">واقع معماري</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            نقدم مجموعة شاملة من الخدمات المعمارية والهندسية عالية الجودة
          </p>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-architectural transition-smooth border-0 bg-card overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <service.icon className="h-8 w-8 text-background" />
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                  اطلب استشارة مجانية
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;