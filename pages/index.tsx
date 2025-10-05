'use client'

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { staggerContainer, staggerItem } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Camera, Sparkles, Star, Users } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Camera,
    title: "Thử Đồ Ảo",
    description: "Tải lên ảnh của bạn và hình dung sản phẩm với độ chính xác cao sử dụng quy trình Stable Diffusion image-to-image.",
    href: "/try-on",
  },
  {
    icon: Brain,
    title: "Gợi Ý Trang Phục AI",
    description: "Mô tả phong cách mong muốn và để GPT-4o tạo ra những bộ trang phục phù hợp từ danh mục sản phẩm của chúng tôi.",
    href: "/recommend",
  },
  {
    icon: Users,
    title: "Cộng Đồng Thời Trang",
    description: "Kết nối với những người đam mê thời trang, chia sẻ phong cách của bạn và lấy cảm hứng từ lựa chọn của người khác.",
    href: "/community",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Blogger Thời Trang",
    content: "AIStyleHub đã cách mạng hóa cách tôi lên kế hoạch trang phục. Những gợi ý AI thật sự chính xác!",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Chuyên Gia Công Nghệ",
    content: "Tính năng thử đồ ảo thật tuyệt vời. Tôi có thể xem quần áo trông như thế nào trên mình trước khi mua.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Sinh Viên",
    content: "Hoàn hảo cho những ai muốn trông thời trang mà không cần dành hàng giờ để chọn trang phục.",
    rating: 5,
  },
];

export default function HomePage() {
  const { toast } = useToast();

  const handleGetStarted = () => {
    toast({
      title: "Chào mừng đến với AIStyleHub!",
      description: "Hãy bắt đầu hành trình phong cách của bạn cùng chúng tôi.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl bg-gradient-to-br from-primary to-purple-600 p-12 text-white shadow-2xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-2 mb-4"
          >
            <Sparkles className="h-6 w-6" />
            <span className="text-sm font-medium opacity-90">Nền Tảng Thời Trang AI</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Nâng tầm
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              tủ quần áo
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-white/90 mb-8 max-w-2xl"
          >
            Khám phá những gợi ý trang phục AI và trải nghiệm thử đồ ảo được điều khiển bởi
            Stable Diffusion và GPT-4o. Biến đổi phong cách của bạn với công nghệ tiên tiến.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
              onClick={handleGetStarted}
            >
              Bắt Đầu
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              asChild
            >
              <Link href="/try-on">
                Thử Thử Đồ Ảo
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={staggerItem}
            className="text-4xl font-bold mb-4"
          >
            Tính Năng Mạnh Mẽ
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Trải nghiệm tương lai của thời trang với nền tảng AI của chúng tôi
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={staggerItem}>
              <Card className="h-full group cursor-pointer">
                <Link href={feature.href} className="block h-full">
                  <CardHeader>
                    <motion.div
                      className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={staggerItem}
            className="text-4xl font-bold mb-4"
          >
            Người Dùng Nói Gì
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="text-xl text-muted-foreground"
          >
            Tham gia cùng hàng nghìn người dùng hài lòng đã biến đổi phong cách của họ
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-3"
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.name} variants={staggerItem}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <Card className="bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/20">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold mb-4">
              Sẵn Sàng Biến Đổi Phong Cách Của Bạn?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Tham gia cùng hàng nghìn người dùng đang sử dụng AI để khám phá phong cách hoàn hảo của họ.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="gradient" asChild>
                <Link href="/try-on">
                  Bắt Đầu Hành Trình
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/recommend">
                  Nhận Gợi Ý
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}
