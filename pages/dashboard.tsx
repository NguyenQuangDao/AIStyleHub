'use client'

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { staggerContainer, staggerItem } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
    BarChart3,
    Bell,
    Brain,
    Camera,
    Filter,
    Home,
    Menu,
    MoreHorizontal,
    Search,
    Settings,
    ShoppingBag,
    TrendingUp,
    Users,
    X
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const sidebarItems = [
  { icon: Home, label: 'Tổng Quan', href: '/dashboard', active: true },
  { icon: Camera, label: 'Thử Đồ', href: '/try-on' },
  { icon: Brain, label: 'Gợi Ý', href: '/recommend' },
  { icon: Users, label: 'Cộng Đồng', href: '/community' },
  { icon: BarChart3, label: 'Phân Tích', href: '/analytics' },
  { icon: Settings, label: 'Cài Đặt', href: '/settings' },
];

const stats = [
  {
    title: 'Tổng Trang Phục',
    value: '1,234',
    change: '+12%',
    trend: 'up',
    icon: ShoppingBag,
  },
  {
    title: 'Người Dùng Hoạt Động',
    value: '5,678',
    change: '+8%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Phiên Thử Đồ',
    value: '9,012',
    change: '+23%',
    trend: 'up',
    icon: Camera,
  },
  {
    title: 'Doanh Thu',
    value: '$45,678',
    change: '+15%',
    trend: 'up',
    icon: TrendingUp,
  },
];

const recentActivities = [
  { id: 1, user: 'Sarah Chen', action: 'hoàn thành thử đồ ảo', time: '2 phút trước', type: 'try-on' },
  { id: 2, user: 'Marcus Johnson', action: 'nhận gợi ý trang phục', time: '5 phút trước', type: 'recommendation' },
  { id: 3, user: 'Emily Rodriguez', action: 'chia sẻ phong cách mới', time: '12 phút trước', type: 'share' },
  { id: 4, user: 'David Kim', action: 'mua sản phẩm được gợi ý', time: '18 phút trước', type: 'purchase' },
  { id: 5, user: 'Lisa Wang', action: 'bắt đầu bài kiểm tra phong cách', time: '25 phút trước', type: 'quiz' },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border lg:relative lg:translate-x-0"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-bold text-primary">AIStyleHub</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="lg:hidden"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <nav className="flex-1 p-4 space-y-2">
                {sidebarItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant={item.active ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      asChild
                    >
                      <a href={item.href}>
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.label}
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Bảng Điều Khiển</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            {/* Stats Grid */}
            <motion.div
              variants={staggerItem}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.title}
                  variants={staggerItem}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {stat.change} so với tháng trước
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Charts and Tables */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Activity */}
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Hoạt Động Gần Đây</CardTitle>
                        <CardDescription>
                          Tương tác người dùng mới nhất trên nền tảng
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">
                              {activity.user} {activity.action}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {activity.time}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle>Hành Động Nhanh</CardTitle>
                    <CardDescription>
                      Các tác vụ và phím tắt thông dụng
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <Button variant="outline" className="justify-start" asChild>
                        <Link href="/try-on">
                          <Camera className="mr-3 h-4 w-4" />
                          Bắt Đầu Thử Đồ Ảo
                        </Link>
                      </Button>
                      <Button variant="outline" className="justify-start" asChild>
                        <Link href="/recommend">
                          <Brain className="mr-3 h-4 w-4" />
                          Nhận Gợi Ý Trang Phục
                        </Link>
                      </Button>
                      <Button variant="outline" className="justify-start" asChild>
                        <a href="/analytics">
                          <BarChart3 className="mr-3 h-4 w-4" />
                          Xem Phân Tích
                        </a>
                      </Button>
                      <Button variant="outline" className="justify-start" asChild>
                        <a href="/settings">
                          <Settings className="mr-3 h-4 w-4" />
                          Cài Đặt Tài Khoản
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Data Table */}
            <motion.div variants={staggerItem}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Phân Tích Người Dùng</CardTitle>
                      <CardDescription>
                        Các chỉ số tương tác người dùng chi tiết
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Lọc
                      </Button>
                      <Button variant="outline" size="sm">
                        Xuất
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <SkeletonTable rows={5} columns={4} />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium">Người Dùng</th>
                            <th className="text-left py-3 px-4 font-medium">Hoạt Động</th>
                            <th className="text-left py-3 px-4 font-medium">Thời Gian</th>
                            <th className="text-left py-3 px-4 font-medium">Trạng Thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentActivities.map((activity, index) => (
                            <motion.tr
                              key={activity.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="border-b border-border hover:bg-muted/50 transition-colors"
                            >
                              <td className="py-3 px-4">{activity.user}</td>
                              <td className="py-3 px-4">{activity.action}</td>
                              <td className="py-3 px-4">{activity.time}</td>
                              <td className="py-3 px-4">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  Hoạt Động
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
