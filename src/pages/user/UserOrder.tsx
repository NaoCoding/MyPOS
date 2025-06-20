// src/pages/Mobile/Mobile_Order.tsx
import React, { useState , useEffect } from 'react';
import { 
  MenuCategory, 
  MenuItemWithCustomizations, 
  CustomizationGroup, 
  Customization,
  Item,
  Product ,
  SelectedCustomization, 
  CartItem 
} from '../../types/menu';
import { useNavigate } from 'react-router-dom';
import { MOCK_MENU } from '../../data/mockData';
import CustomizationModal from '../../components/Customization/CustomizationModal';
const backendAPI = process.env.REACT_APP_BACKEND_API || 'http://localhost:5000';

export default function UserOrderPage() {

  const [itemData , setItemData] = useState();
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuData, setMenuData] = useState<any[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [customizationGroups, setCustomizationGroups] = useState<CustomizationGroup[]>([]);

  const processMenu = (itemsData: any[]) => {
    // 处理null类别，给默认值
    const itemsWithCategory = itemsData.map(item => ({
      ...item,
      category: item.category || '其他' // 为null的category设置默认值
    }));
    
    const categories = Array.from(new Set(itemsWithCategory.map(item => item.category)));

    return categories.map(category => {
      const categoryItems = itemsWithCategory.filter(
        item => item.category === category
      );
      
      return {
        id: category,      
        name: category, 
        items: categoryItems.map(item => ({
          item: {
            id: item.id,
            store_id: 1,
            description: item.description || '',
            product_id: item.product_id,  
            quantity: item.quantity,
            product: {
              id: item.product_id,
              name: item.name || '未知商品',
              description: item.description || ''
            },
          },
          base_price: (item.discount_type === 'percentage' && item.discount_amount)
            ? item.unit_price * (item.discount_amount) : (item.discount_type === 'fixed' && item.discount_amount)
            ? item.discount_amount : item.unit_price,
          images: ['/images/default.png'], 
          customization_groups: item.customization_groups || []
        }))
      };
    });
  };
  

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 获取商品数据和其他必要数据...
        const itemResponse = await fetch(`${backendAPI}/item`);
        if (!itemResponse.ok) {
          throw new Error(`无法获取菜单: ${itemResponse.statusText}`);
        }
        const items = await itemResponse.json();
        
        console.log('获取到的商品数据:', items);

        
        
        // 处理数据，按分类分组
        const processedCategories = processMenu(items);
        
        setMenuData(items); 
        setCategories(processedCategories);
        
        
        console.log('处理后的菜单数据:', processedCategories);
        
        if (processedCategories.length > 0) {
          setSelectedCategory(processedCategories[0].id);
        }

        
        
      } catch (err) {
        console.error('获取菜单失败:', err);
        setError(err instanceof Error ? err.message : '发生未知错误');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchMenuItems();
  }, []);
  

  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [modalItem, setModalItem] = useState<MenuItemWithCustomizations | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 處理商品點擊
  const handleItemClick = (item: MenuItemWithCustomizations) => {
    setModalItem(item);
    setIsModalOpen(true);
  };

  // 處理加入購物車
  const handleAddToCart = (
    item: MenuItemWithCustomizations, 
    selections: SelectedCustomization[], 
    quantity: number, 
    note: string
  ) => {
    const totalCustomizationPrice = selections.reduce((sum, s) => sum + s.price_delta, 0);
    const totalPrice = (item.base_price + totalCustomizationPrice) * quantity;

    const cartItem: CartItem = {
      item_id: item.item.id,
      item_name: item.item.product?.name || '',
      base_price: item.base_price,
      quantity,
      note: note || undefined,
      selected_customizations: selections,
      total_price: totalPrice
    };

    setCart(prev => [...prev, cartItem]);
    setIsModalOpen(false);
    setModalItem(null);
  };

  // 移除購物車項目
  const handleRemoveFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  // 計算購物車總價
  const cartTotal = cart.reduce((sum, item) => sum + item.total_price, 0);

  // 送出訂單
  const handleSubmitOrder = () => {
    if (cart.length === 0) {
      alert('購物車是空的！');
      return;
    }

    const orderSummary = cart.map(item => {
      const customizations = item.selected_customizations.map(s => s.customization.name).join(', ');
      return `${item.item_name} x${item.quantity}${customizations ? ` (${customizations})` : ''}`;
    }).join('\n');

    console.log(cart)


    if (window.confirm(`確認送出訂單？\n\n${orderSummary}\n\n總價：${cartTotal}`)) {
      
      const tradeFetch = async () => {
        try {
          const response = await fetch(`${backendAPI}/trade`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              trade_items: cart.map(item => ({
                id: item.item_id,
                quantity: item.quantity,
                customizations: item.selected_customizations.map(s => s.customization.id),
              }))
            }),
          });

          console.log(JSON.stringify({
            trade_items: cart.map(item => ({
              id: item.item_id,
              quantity: item.quantity,
              customizations: item.selected_customizations.map(s => s.customization.id),
            }))
          }))
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log(data);
          if( data.success) {
            setCart([]); // 清空購物車
            navigate('/user/History'); // 跳轉到歷史紀錄頁面
          }
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
          // 在這裡處理錯誤
        }
      }
      tradeFetch()
    }
  }
    
  


  // 獲取當前分類的商品
  const currentCategoryItems = categories.find(cat => cat.id === selectedCategory)?.items || [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">手機點餐</h1>
          
          {/* 分類選擇 */}
          <div className="flex gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                className={`
                  flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200
                  ${selectedCategory === category.id 
                    ? 'bg-blue-500 text-white shadow-lg scale-105' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* 商品網格 */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {currentCategoryItems.map((item) => (
            <button
              key={item.item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transform transition-all duration-200 text-left"
              onClick={() => handleItemClick(item)}
            >
              <div className="w-full aspect-[4/3] bg-gray-200 relative overflow-hidden">
                <img 
                  src={item.images[0]} 
                  alt={item.item.product?.name} 
                  className="w-full h-full object-cover"
                />
                {/* 價格標籤 */}
                <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-lg text-sm font-bold shadow-lg">
                  ${item.base_price}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-1">
                  {item.item.product?.name}
                </h3>
                {item.item.product?.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.item.product.description}
                  </p>
                )}
                
                {/* 可客製化標示 */}
                {item.customization_groups.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.customization_groups.slice(0, 2).map(group => (
                      <span key={group.id} className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                        {group.name}
                      </span>
                    ))}
                    {item.customization_groups.length > 2 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        +{item.customization_groups.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* 購物車 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">購物車</h2>
            <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              {cart.length} 項商品
            </div>
          </div>
          
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">🛒</div>
              <p className="text-gray-500">購物車是空的，快去選購商品吧！</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {item.item_name} x{item.quantity}
                      </h3>
                      <div className="text-sm text-gray-600">
                        基本價格：${item.base_price}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-blue-600">
                        ${item.total_price}
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(index)}
                        className="text-red-500 hover:text-red-700 text-sm mt-1 transition-colors"
                      >
                        移除
                      </button>
                    </div>
                  </div>
                  
                  {/* 加料顯示 */}
                  {item.selected_customizations.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">加料：</span>
                        {item.selected_customizations.map((s, idx) => (
                          <span key={s.customization_id} className="ml-1">
                            {s.customization.name}
                            {s.price_delta > 0 && ` (+$${s.price_delta})`}
                            {idx < item.selected_customizations.length - 1 && '、'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* 備註 */}
                  {item.note && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">備註：</span>
                        {item.note}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 結帳按鈕 */}
        <button
          onClick={handleSubmitOrder}
          disabled={cart.length === 0}
          className={`
            w-full py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg
            ${cart.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-xl transform'
            }
          `}
        >
          {cart.length === 0 ? '請選擇商品' : `送出訂單 ($${cartTotal})`}
        </button>
      </div>

      {/* 底部導航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-around py-3 text-sm z-50">
        <button 
          onClick={() => navigate('/user/Home')} 
          className="text-center py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="text-2xl mb-1">🏠</div>
          <div className="text-gray-600">首頁</div>
        </button>
        <button 
          onClick={() => navigate('/user/Order')} 
          className="text-center py-2 px-4 rounded-lg bg-blue-50 text-blue-600"
        >
          <div className="text-2xl mb-1">🧾</div>
          <div className="font-medium">點餐</div>
        </button>
        <button 
          onClick={() => navigate('/user/History')} 
          className="text-center py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="text-2xl mb-1">📜</div>
          <div className="text-gray-600">紀錄</div>
        </button>
      </nav>

      {/* 加料 Modal */}
      <CustomizationModal
        item={modalItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalItem(null);
        }}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}