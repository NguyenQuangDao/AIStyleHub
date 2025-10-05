'use client'

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Bell,
    Camera,
    Check,
    CreditCard,
    Edit3,
    Mail,
    Palette,
    Save,
    Settings,
    Shield,
    User,
    X
} from 'lucide-react';
import { useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  dateOfBirth: string;
  website: string;
  preferences: {
    notifications: boolean;
    marketing: boolean;
    darkMode: boolean;
  };
}

const initialFormData: FormData = {
  firstName: 'Sarah',
  lastName: 'Chen',
  email: 'sarah.chen@example.com',
  phone: '+1 (555) 123-4567',
  bio: 'Người đam mê thời trang và khám phá phong cách AI. Thích khám phá xu hướng mới và chia sẻ ý tưởng trang phục với cộng đồng.',
  location: 'San Francisco, CA',
  dateOfBirth: '1990-05-15',
  website: 'https://sarahchen.style',
  preferences: {
    notifications: true,
    marketing: false,
    darkMode: true,
  },
};

const settingsSections = [
  {
    id: 'profile',
    title: 'Thông Tin Hồ Sơ',
    icon: User,
    description: 'Quản lý thông tin cá nhân và chi tiết hồ sơ của bạn',
  },
  {
    id: 'preferences',
    title: 'Tùy Chọn',
    icon: Settings,
    description: 'Tùy chỉnh trải nghiệm ứng dụng và cài đặt thông báo',
  },
  {
    id: 'privacy',
    title: 'Quyền Riêng Tư & Bảo Mật',
    icon: Shield,
    description: 'Kiểm soát cài đặt quyền riêng tư và bảo mật tài khoản',
  },
  {
    id: 'billing',
    title: 'Thanh Toán & Đăng Ký',
    icon: CreditCard,
    description: 'Quản lý đăng ký và phương thức thanh toán của bạn',
  },
];

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Tên là bắt buộc';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Họ là bắt buộc';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: 'Lỗi Xác Thực',
        description: 'Vui lòng sửa các lỗi trước khi lưu.',
        variant: 'error',
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    setIsEditing(false);
    
    toast({
      title: 'Hồ Sơ Đã Cập Nhật',
      description: 'Hồ sơ của bạn đã được cập nhật thành công.',
      variant: 'success',
    });
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setErrors({});
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handlePreferenceChange = (preference: keyof FormData['preferences'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value,
      },
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Hồ Sơ & Cài Đặt</h1>
        <p className="text-xl text-muted-foreground">
          Quản lý cài đặt tài khoản và tùy chọn của bạn
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle>Cài Đặt</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <section.icon className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{section.title}</div>
                      <div className="text-xs opacity-70">{section.description}</div>
                    </div>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <AnimatePresence mode="wait">
            {activeSection === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Thông Tin Hồ Sơ</CardTitle>
                        <CardDescription>
                          Cập nhật thông tin cá nhân và chi tiết hồ sơ của bạn
                        </CardDescription>
                      </div>
                      <Button
                        variant={isEditing ? 'outline' : 'default'}
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? (
                          <>
                            <X className="mr-2 h-4 w-4" />
                            Hủy
                          </>
                        ) : (
                          <>
                            <Edit3 className="mr-2 h-4 w-4" />
                            Chỉnh Sửa
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                          {formData.firstName[0]}{formData.lastName[0]}
                        </div>
                        {isEditing && (
                          <Button
                            size="icon"
                            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {formData.firstName} {formData.lastName}
                        </h3>
                        <p className="text-muted-foreground">{formData.email}</p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Tên *
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.firstName ? 'border-red-500' : 'border-border'
                          } ${!isEditing ? 'bg-muted' : 'bg-background'}`}
                        />
                        {errors.firstName && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors.firstName}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Họ *
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.lastName ? 'border-red-500' : 'border-border'
                          } ${!isEditing ? 'bg-muted' : 'bg-background'}`}
                        />
                        {errors.lastName && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors.lastName}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.email ? 'border-red-500' : 'border-border'
                          } ${!isEditing ? 'bg-muted' : 'bg-background'}`}
                        />
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Số Điện Thoại *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.phone ? 'border-red-500' : 'border-border'
                          } ${!isEditing ? 'bg-muted' : 'bg-background'}`}
                        />
                        {errors.phone && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors.phone}
                          </motion.p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">
                          Tiểu Sử
                        </label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          disabled={!isEditing}
                          rows={3}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                            !isEditing ? 'bg-muted' : 'bg-background'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Địa Chỉ
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                            !isEditing ? 'bg-muted' : 'bg-background'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Trang Web
                        </label>
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                            !isEditing ? 'bg-muted' : 'bg-background'
                          }`}
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 pt-4"
                      >
                        <Button
                          onClick={handleSave}
                          loading={loading}
                          disabled={loading}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Lưu Thay Đổi
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>
                          Hủy
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeSection === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Tùy Chọn</CardTitle>
                    <CardDescription>
                      Tùy chỉnh trải nghiệm ứng dụng và cài đặt thông báo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">Thông Báo Đẩy</h4>
                            <p className="text-sm text-muted-foreground">
                              Nhận thông báo về gợi ý mới và cập nhật
                            </p>
                          </div>
                        </div>
                        <Button
                          variant={formData.preferences.notifications ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePreferenceChange('notifications', !formData.preferences.notifications)}
                        >
                          {formData.preferences.notifications ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">Email Marketing</h4>
                            <p className="text-sm text-muted-foreground">
                              Nhận email quảng cáo và mẹo phong cách
                            </p>
                          </div>
                        </div>
                        <Button
                          variant={formData.preferences.marketing ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePreferenceChange('marketing', !formData.preferences.marketing)}
                        >
                          {formData.preferences.marketing ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Palette className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">Chế Độ Tối</h4>
                            <p className="text-sm text-muted-foreground">
                              Sử dụng chủ đề tối để có trải nghiệm xem tốt hơn
                            </p>
                          </div>
                        </div>
                        <Button
                          variant={formData.preferences.darkMode ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePreferenceChange('darkMode', !formData.preferences.darkMode)}
                        >
                          {formData.preferences.darkMode ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeSection === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Quyền Riêng Tư & Bảo Mật</CardTitle>
                    <CardDescription>
                      Kiểm soát cài đặt quyền riêng tư và bảo mật tài khoản
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Bảo Mật Tài Khoản</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Tài khoản của bạn được bảo mật bằng mã hóa tiêu chuẩn ngành.
                        </p>
                        <Button variant="outline" size="sm">
                          Đổi Mật Khẩu
                        </Button>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Quyền Riêng Tư Dữ Liệu</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Chúng tôi tôn trọng quyền riêng tư của bạn và chỉ sử dụng dữ liệu để cải thiện trải nghiệm của bạn.
                        </p>
                        <Button variant="outline" size="sm">
                          Tải Dữ Liệu Của Tôi
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeSection === 'billing' && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Thanh Toán & Đăng Ký</CardTitle>
                    <CardDescription>
                      Quản lý đăng ký và phương thức thanh toán của bạn
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Gói Hiện Tại</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Gói Premium - $9.99/tháng
                        </p>
                        <Button variant="outline" size="sm">
                          Đổi Gói
                        </Button>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Phương Thức Thanh Toán</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          **** **** **** 1234
                        </p>
                        <Button variant="outline" size="sm">
                          Cập Nhật Thanh Toán
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
