import { MessageCircle, Users, Clock, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ChatSection = () => {
  return (
    <section id="chat" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
            <MessageCircle className="h-4 w-4 text-primary" />
            <span className="text-primary font-medium">تواصل مباشر</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            تحدث مع خبرائنا
            <span className="block text-primary">مباشرة</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            احصل على استشارة فورية من فريق الخبراء لدينا وناقش تفاصيل مشروعك
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Users, title: "خبراء متخصصون", desc: "فريق من المهندسين والمصممين المحترفين" },
            { icon: Clock, title: "متاح 24/7", desc: "خدمة عملاء على مدار الساعة" },
            { icon: Shield, title: "استشارة مجانية", desc: "استشارة أولية مجانية لجميع المشاريع" },
            { icon: MessageCircle, title: "رد فوري", desc: "الحصول على إجابات سريعة ودقيقة" }
          ].map((feature, index) => (
            <Card key={index} className="text-center border-0 bg-background/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <feature.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chat iframe */}
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-0 shadow-architectural">
            <CardContent className="p-0">
              <div className="bg-gradient-primary p-4 text-center">
                <h3 className="text-xl font-bold text-background mb-2">
                  ابدأ محادثة مع خبير التصميم
                </h3>
                <p className="text-background/90">
                  شارك أفكارك واحصل على نصائح احترافية فورية
                </p>
              </div>
              <div className="relative">
                <iframe 
                  src="https://chatvip.lovable.app" 
                  width="100%" 
                  height="600px"
                  className="border-0"
                  title="تحدث مع خبير التصميم"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ChatSection;