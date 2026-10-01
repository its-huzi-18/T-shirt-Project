import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Upload,
  X,
  Check,
  Tag,
  Star,
  Sparkles,
  Package,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { Product, ProductColor } from '../../types';

interface AdminProductsProps {
  isCreateModalOpen?: boolean;
  onCloseCreateModal?: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  isCreateModalOpen: externalCreateOpen,
  onCloseCreateModal,
}) => {
  const { saveProduct, deleteProduct, duplicateProduct } = useAdmin();
  const { products, categories, settings, showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync external create modal trigger
  React.useEffect(() => {
    if (externalCreateOpen) {
      setEditingProduct({
        name: '',
        price: 48,
        salePrice: null,
        sku: `VT-${Math.floor(100 + Math.random() * 900)}`,
        category: categories[0]?.name || 'Printed T-Shirts',
        images: ['/images/product_forest_tee_1790863018752.jpg'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Forest Emerald', code: '#173627' },
          { name: 'Washed Black', code: '#1E1E1E' },
        ],
        stock: 30,
        status: 'active',
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: false,
        tags: ['heavyweight', 'streetwear', 'custom-print'],
        fabricGSM: 260,
        printType: 'Archival Screen Print',
        fit: 'Boxy Drop Shoulder',
        description: '',
        shortDescription: '',
      });
      setIsModalOpen(true);
    }
  }, [externalCreateOpen, categories]);

  // Filtered products
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenCreate = () => {
    setEditingProduct({
      name: '',
      price: 48,
      salePrice: null,
      sku: `VT-${Math.floor(100 + Math.random() * 900)}`,
      category: categories[0]?.name || 'Printed T-Shirts',
      images: ['/images/product_forest_tee_1790863018752.jpg'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Forest Emerald', code: '#173627' },
        { name: 'Washed Black', code: '#1E1E1E' },
      ],
      stock: 25,
      status: 'active',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      tags: ['oversized', 'print'],
      fabricGSM: 240,
      printType: 'Archival Screen Print',
      fit: 'Relaxed Drop Shoulder',
      description: '',
      shortDescription: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) {
      await deleteProduct(id);
    }
  };

  const handleDuplicate = async (product: Product) => {
    await duplicateProduct(product);
  };

  // Image Upload helper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const currentImages = editingProduct.images || [];
      setEditingProduct({
        ...editingProduct,
        images: [...currentImages, dataUrl],
        thumbnail: editingProduct.thumbnail || dataUrl,
      });
      showToast('Image uploaded to product!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    if (!editingProduct || !editingProduct.images) return;
    const updated = editingProduct.images.filter((_, i) => i !== index);
    setEditingProduct({
      ...editingProduct,
      images: updated,
      thumbnail: updated[0] || '',
    });
  };

  // Preset images helper
  const presetImages = [
    '/images/product_forest_tee_1790863018752.jpg',
    '/images/product_black_tee_1790863039839.jpg',
    '/images/product_sand_tee_1790863056583.jpg',
    '/images/hero_tshirt_banner_1790863003479.jpg',
  ];

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editingProduct.name?.trim()) {
      showToast('Please enter a product name', 'error');
      return;
    }
    await saveProduct(editingProduct);
    setIsModalOpen(false);
    setEditingProduct(null);
    if (onCloseCreateModal) onCloseCreateModal();
  };

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, SKU..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-medium focus:outline-hidden focus:border-[#173627]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-700 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add Product Button */}
        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto py-2.5 px-5 bg-[#173627] hover:bg-[#11291E] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New T-Shirt
        </button>
      </div>

      {/* Products Table */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3.5 px-4 rounded-l-xl">Product</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700 font-medium">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                        <img src={p.thumbnail || p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-stone-900 line-clamp-1">{p.name}</div>
                        <div className="text-[11px] text-stone-400">{p.sizes.join(', ')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-600">{p.sku}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-800">{p.category}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-stone-900">
                      {settings.currencySymbol || '$'}{(p.salePrice ?? p.price).toFixed(2)}
                    </div>
                    {p.salePrice && (
                      <span className="text-[10px] text-stone-400 line-through">
                        {settings.currencySymbol || '$'}{p.price.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-bold ${
                        p.stock <= 5 ? 'text-rose-600' : 'text-stone-800'
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {p.isFeatured && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Featured
                        </span>
                      )}
                      {p.isBestSeller && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Best Seller
                        </span>
                      )}
                      {p.isNewArrival && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                          New
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        p.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-stone-950 hover:bg-stone-100"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(p)}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-stone-950 hover:bg-stone-100"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Product Modal */}
      <AnimatePresence>
        {isModalOpen && editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsModalOpen(false);
                if (onCloseCreateModal) onCloseCreateModal();
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-stone-200 z-10 flex flex-col max-h-[92vh] overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 bg-white border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-black text-lg text-[#173627]">
                    {editingProduct.id ? `Edit: ${editingProduct.name}` : 'Create New Printed T-Shirt'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Configure garment blanks, pricing, multiple images, and screen printing details.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    if (onCloseCreateModal) onCloseCreateModal();
                  }}
                  className="p-2 text-stone-400 hover:text-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-6">
                {/* Basic Info */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400">Basic Information</h4>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      placeholder="e.g. Sub-Zero Vintage Acid-Wash Tee"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-[#173627]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                      <select
                        value={editingProduct.category || categories[0]?.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white font-semibold"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Price ({settings.currencySymbol || '$'})</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={editingProduct.price ?? ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Sale Price (Optional)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingProduct.salePrice ?? ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            salePrice: e.target.value ? parseFloat(e.target.value) : null,
                          })
                        }
                        placeholder="Leave blank for regular"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">SKU Code</label>
                      <input
                        type="text"
                        value={editingProduct.sku || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Stock Quantity</label>
                      <input
                        type="number"
                        required
                        value={editingProduct.stock ?? ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Multiple Images Upload & Preset Selector */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400">
                      Product Images Gallery
                    </h4>
                    <label className="cursor-pointer py-1.5 px-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold hover:bg-emerald-200 transition-colors flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" /> Upload File
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>

                  {/* Active Images thumbnails */}
                  <div className="flex flex-wrap gap-3">
                    {editingProduct.images?.map((imgUrl, i) => (
                      <div key={i} className="relative w-20 h-24 rounded-xl overflow-hidden border border-stone-300 group">
                        <img src={imgUrl} alt={`Product ${i}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-md hover:bg-rose-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-[#173627] text-white text-[9px] font-bold text-center py-0.5">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Quick Preset Selector */}
                  <div className="pt-2 border-t border-stone-100">
                    <span className="text-[11px] font-semibold text-stone-500 block mb-2">
                      Or select from studio photo presets:
                    </span>
                    <div className="flex items-center gap-2">
                      {presetImages.map((pImg, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => {
                            const cur = editingProduct.images || [];
                            if (!cur.includes(pImg)) {
                              setEditingProduct({
                                ...editingProduct,
                                images: [...cur, pImg],
                                thumbnail: editingProduct.thumbnail || pImg,
                              });
                            }
                          }}
                          className="w-12 h-14 rounded-lg overflow-hidden border hover:border-emerald-700"
                        >
                          <img src={pImg} alt="Preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sizes and Specifications */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400">Sizes & Fabric Specs</h4>

                  {/* Sizes */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-2">Available Sizes</label>
                    <div className="flex flex-wrap gap-2">
                      {allSizes.map((sz) => {
                        const hasSize = editingProduct.sizes?.includes(sz);
                        return (
                          <button
                            type="button"
                            key={sz}
                            onClick={() => {
                              const cur = editingProduct.sizes || [];
                              const updated = hasSize ? cur.filter((s) => s !== sz) : [...cur, sz];
                              setEditingProduct({ ...editingProduct, sizes: updated });
                            }}
                            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                              hasSize
                                ? 'bg-[#173627] text-white'
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Fabric Weight (GSM)</label>
                      <input
                        type="number"
                        value={editingProduct.fabricGSM || 260}
                        onChange={(e) => setEditingProduct({ ...editingProduct, fabricGSM: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Print Technique</label>
                      <input
                        type="text"
                        value={editingProduct.printType || 'Archival Screen Print'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, printType: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Garment Silhouette / Fit</label>
                      <input
                        type="text"
                        value={editingProduct.fit || 'Boxy Drop Shoulder'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, fit: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                      />
                    </div>
                  </div>

                  {/* Badges / Flags */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-4 text-xs font-bold text-stone-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!editingProduct.isFeatured}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                        className="accent-[#173627] rounded-sm"
                      />
                      Featured on Homepage
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!editingProduct.isBestSeller}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                        className="accent-[#173627] rounded-sm"
                      />
                      Best Seller Badge
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!editingProduct.isNewArrival}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })}
                        className="accent-[#173627] rounded-sm"
                      />
                      New Arrival Tag
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400">Description</h4>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Short Description</label>
                    <input
                      type="text"
                      value={editingProduct.shortDescription || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                      placeholder="e.g. 260 GSM heavyweight organic cotton with Japanese botanical back print."
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Full Description</label>
                    <textarea
                      rows={3}
                      value={editingProduct.description || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      placeholder="Describe the fabric cut, collar ribbing, print resolution, and story..."
                      className="w-full p-3 rounded-xl border border-stone-300 text-xs"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      if (onCloseCreateModal) onCloseCreateModal();
                    }}
                    className="py-3 px-5 rounded-xl border border-stone-300 text-xs font-bold uppercase tracking-wider hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-3 px-7 rounded-xl bg-[#173627] hover:bg-[#11291E] text-white text-xs font-black uppercase tracking-wider shadow-md"
                  >
                    Save & Publish T-Shirt
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
