'use client'

import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { staggerContainer, staggerItem } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Eye,
    Grid,
    Heart,
    List,
    Search,
    ShoppingBag,
    SlidersHorizontal,
    Star
} from 'lucide-react';
import { useState } from 'react';

const products = [
  {
    id: 1,
    name: 'Áo Sơ Mi Trắng Cổ Điển',
    price: '$89.99',
    originalPrice: '$120.00',
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
    category: 'Áo Sơ Mi',
    colors: ['Trắng', 'Đen', 'Xanh'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Áo sơ mi trắng cổ điển vượt thời gian được làm từ cotton cao cấp. Hoàn hảo cho cả dịp thường ngày và trang trọng.',
    inStock: true,
  },
  {
    id: 2,
    name: 'Áo Khoác Denim',
    price: '$129.99',
    originalPrice: '$159.99',
    rating: 4.6,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop',
    category: 'Áo Khoác',
    colors: ['Xanh', 'Đen'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Áo khoác denim lấy cảm hứng từ vintage với kiểu dáng hiện đại. Có các chi tiết cổ điển và cấu trúc denim cao cấp.',
    inStock: true,
  },
  {
    id: 3,
    name: 'Váy Hè',
    price: '$79.99',
    originalPrice: '$99.99',
    rating: 4.9,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop',
    category: 'Váy',
    colors: ['Hoa', 'Xanh Đậm', 'Hồng Đậm'],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Váy hè nhẹ nhàng hoàn hảo cho thời tiết ấm. Có đường cắt tôn dáng và vừa vặn thoải mái.',
    inStock: true,
  },
  {
    id: 4,
    name: 'Giày Thể Thao',
    price: '$149.99',
    originalPrice: '$179.99',
    rating: 4.7,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop',
    category: 'Giày',
    colors: ['Trắng', 'Đen', 'Xám'],
    sizes: ['7', '8', '9', '10', '11'],
    description: 'Giày thể thao thoải mái và thời trang với thiết kế hiện đại. Hoàn hảo cho việc mặc hàng ngày và các hoạt động nhẹ.',
    inStock: false,
  },
  {
    id: 5,
    name: 'Áo Len Len',
    price: '$99.99',
    originalPrice: '$129.99',
    rating: 4.5,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop',
    category: 'Áo Len',
    colors: ['Xám', 'Xanh Navy', 'Kem'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Áo len len cao cấp với kiểu dáng thoải mái. Mềm mại và ấm áp, hoàn hảo cho thời tiết mát mẻ.',
    inStock: true,
  },
  {
    id: 6,
    name: 'Túi Xách Da',
    price: '$199.99',
    originalPrice: '$249.99',
    rating: 4.8,
    reviews: 92,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
    category: 'Phụ Kiện',
    colors: ['Nâu', 'Đen', 'Nâu Nhạt'],
    sizes: ['Một Size'],
    description: 'Túi xách da thủ công với vật liệu cao cấp. Nội thất rộng rãi và thiết kế thanh lịch.',
    inStock: true,
  },
];

const categories = ['Tất Cả', 'Áo Sơ Mi', 'Áo Khoác', 'Váy', 'Giày', 'Áo Len', 'Phụ Kiện'];
const sortOptions = ['Mới Nhất', 'Giá: Thấp đến Cao', 'Giá: Cao đến Thấp', 'Đánh Giá', 'Phổ Biến'];

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('Tất Cả');
  const [sortBy, setSortBy] = useState('Mới Nhất');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Tất Cả' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Sản Phẩm Của Chúng Tôi</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Khám phá bộ sưu tập thời trang được tuyển chọn của chúng tôi với sức mạnh của gợi ý AI
        </p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-6"
      >
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Bộ Lọc
            </Button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className={viewMode === 'grid' 
          ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' 
          : 'space-y-4'
        }
      >
        <AnimatePresence mode="wait">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={staggerItem}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              layout
            >
              <Card className="group cursor-pointer overflow-hidden">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-white/80 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          favorites.includes(product.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-600'
                        }`} 
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-white/80 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Hết Hàng
                      </span>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="text-right">
                      <p className="font-bold text-lg">{product.price}</p>
                      {product.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                          {product.originalPrice}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      className="flex-1"
                      disabled={!product.inStock}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      {product.inStock ? 'Thêm Vào Giỏ' : 'Hết Hàng'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Quick View Modal */}
      <Modal
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
        size="lg"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(selectedProduct.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-3xl font-bold">{selectedProduct.price}</span>
                    {selectedProduct.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        {selectedProduct.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-muted-foreground">{selectedProduct.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Màu Sắc:</h4>
                    <div className="flex gap-2">
                      {selectedProduct.colors.map((color) => (
                        <Button key={color} variant="outline" size="sm">
                          {color}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Kích Thước:</h4>
                    <div className="flex gap-2">
                      {selectedProduct.sizes.map((size) => (
                        <Button key={size} variant="outline" size="sm">
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1" disabled={!selectedProduct.inStock}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Thêm Vào Giỏ
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toggleFavorite(selectedProduct.id)}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        favorites.includes(selectedProduct.id) 
                          ? 'fill-red-500 text-red-500' 
                          : ''
                      }`} 
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
