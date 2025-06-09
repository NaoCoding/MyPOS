// src/components/Customization/CustomizationModal.tsx
import React, { useState, useEffect } from 'react';
import { MenuItemWithCustomizations, SelectedCustomization, CustomizationGroupUI } from '../../types/menu';

interface CustomizationModalProps {
  item: MenuItemWithCustomizations | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItemWithCustomizations, selections: SelectedCustomization[], quantity: number, note: string) => void;
}

export default function CustomizationModal({ item, isOpen, onClose, onAddToCart }: CustomizationModalProps) {
  const [selectedCustomizations, setSelectedCustomizations] = useState<SelectedCustomization[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<{ [groupId: number]: string }>({});

  // 重置狀態
  useEffect(() => {
    if (isOpen && item) {
      setSelectedCustomizations([]);
      setQuantity(1);
      setNote('');
      setErrors({});
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  // 處理加料選擇
  const handleCustomizationToggle = (customization: any, groupId: number, isMultipleChoice: boolean) => {
    setSelectedCustomizations(prev => {
      if (isMultipleChoice) {
        // 多選群組
        const exists = prev.find(s => s.customization_id === customization.id);
        if (exists) {
          // 移除選擇
          return prev.filter(s => s.customization_id !== customization.id);
        } else {
          // 新增選擇
          return [...prev, {
            customization_id: customization.id,
            customization: customization,
            price_delta: customization.price_delta
          }];
        }
      } else {
        // 單選群組 - 移除同群組的其他選擇，再加入新的
        const newSelections = prev.filter(s => {
          // 找到這個 customization 屬於哪個群組
          for (const group of item.customization_groups) {
            if (group.customizations?.some(c => c.id === s.customization_id)) {
              return group.id !== groupId;
            }
          }
          return true;
        });
        
        return [...newSelections, {
          customization_id: customization.id,
          customization: customization,
          price_delta: customization.price_delta
        }];
      }
    });

    // 清除該群組的錯誤
    setErrors(prev => ({ ...prev, [groupId]: '' }));
  };

  // 驗證必選群組
  const validateRequiredGroups = (): boolean => {
    const newErrors: { [groupId: number]: string } = {};
    let isValid = true;

    item.customization_groups.forEach(group => {
      if (group.is_required) {
        const hasSelection = selectedCustomizations.some(s => 
          group.customizations?.some(c => c.id === s.customization_id)
        );
        if (!hasSelection) {
          newErrors[group.id] = `請選擇${group.name}`;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // 計算總價
  const calculateTotalPrice = () => {
    const addonsTotal = selectedCustomizations.reduce((sum, s) => sum + s.price_delta, 0);
    return (item.base_price + addonsTotal) * quantity;
  };

  // 處理加入購物車
  const handleAddToCart = () => {
    if (!validateRequiredGroups()) {
      return;
    }

    onAddToCart(item, selectedCustomizations, quantity, note);
    onClose();
  };

  // 檢查是否已選擇某個加料
  const isCustomizationSelected = (customizationId: number) => {
    return selectedCustomizations.some(s => s.customization_id === customizationId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative">
          <img 
            src={item.images[0]} 
            alt={item.item.product?.name} 
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <h3 className="text-2xl font-bold text-white mb-1">{item.item.product?.name}</h3>
            <p className="text-gray-200 text-sm">{item.item.product?.description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          {/* 價格顯示 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">基本價格</span>
              <span className="text-xl font-bold text-blue-600">${item.base_price}</span>
            </div>
            {selectedCustomizations.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                {selectedCustomizations.map(s => (
                  <div key={s.customization_id} className="flex justify-between text-sm text-gray-600">
                    <span>+ {s.customization.name}</span>
                    <span>+${s.price_delta}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 加料群組 */}
          {item.customization_groups.map(group => (
            <div key={group.id} className="mb-6">
              <div className="flex items-center mb-3">
                <h4 className="text-lg font-semibold text-gray-800">{group.name}</h4>
                {group.is_required ? (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">必選</span>
                ) : <></>}
                {group.is_multiple_choice ? (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">可多選</span>
                ) : <></>}
              </div>
              
              {group.description && (
                <p className="text-sm text-gray-500 mb-3">{group.description}</p>
              )}

              {errors[group.id] && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{errors[group.id]}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {group.customizations?.map(customization => (
                  <button
                    key={customization.id}
                    onClick={() => handleCustomizationToggle(customization, group.id, group.is_multiple_choice)}
                    disabled={!customization.is_available}
                    className={`
                      p-3 rounded-xl border-2 transition-all duration-200 text-left
                      ${isCustomizationSelected(customization.id)
                        ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }
                      ${!customization.is_available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-800">{customization.name}</div>
                        {customization.description && (
                          <div className="text-xs text-gray-500 mt-1">{customization.description}</div>
                        )}
                      </div>
                      <div className="text-right">
                        {customization.price_delta > 0 && (
                          <div className="text-sm font-semibold text-green-600">
                            +${customization.price_delta}
                          </div>
                        )}
                        {customization.price_delta === 0 && (
                          <div className="text-sm text-gray-400">免費</div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* 備註 */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 mb-2">備註</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="特殊需求或備註..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* 數量選擇 */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 mb-3">數量</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-xl transition-colors"
              >
                −
              </button>
              <span className="text-2xl font-bold text-gray-800 min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-xl transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-gray-700">總計</span>
            <span className="text-2xl font-bold text-blue-600">${calculateTotalPrice()}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold transition-colors shadow-lg"
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  );
}