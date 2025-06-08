import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, User, Search, Menu } from 'lucide-react';

const ButtonDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">eBay Skin 按钮组件</h1>
        
        {/* 基础按钮 */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">基础按钮</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="default">Default Button</Button>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="tertiary">Tertiary Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="borderless">Borderless Button</Button>
          </div>
        </section>

        {/* 尺寸变体 */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">尺寸变体</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="small" variant="primary">Small</Button>
            <Button size="default" variant="primary">Default</Button>
            <Button size="large" variant="primary">Large</Button>
          </div>
        </section>

        {/* 带图标的按钮 */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">带图标的按钮</h2>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="primary" 
              icon={<ShoppingCart className="w-4 h-4" />}
              iconPosition="left"
            >
              加入购物车
            </Button>
            <Button 
              variant="secondary" 
              icon={<Heart className="w-4 h-4" />}
              iconPosition="left"
            >
              收藏
            </Button>
            <Button 
              variant="tertiary" 
              icon={<User className="w-4 h-4" />}
              iconPosition="right"
            >
              登录
            </Button>
            <Button 
              variant="borderless" 
              icon={<Search className="w-4 h-4" />}
              iconPosition="left"
            >
              搜索
            </Button>
          </div>
        </section>

        {/* 仅图标按钮 */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">仅图标按钮</h2>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="primary" 
              icon={<ShoppingCart className="w-4 h-4" />}
              aria-label="添加到购物车"
            />
            <Button 
              variant="secondary" 
              icon={<Heart className="w-4 h-4" />}
              aria-label="收藏"
            />
            <Button 
              variant="tertiary" 
              icon={<User className="w-4 h-4" />}
              aria-label="用户资料"
            />
            <Button 
              variant="borderless" 
              icon={<Menu className="w-4 h-4" />}
              aria-label="菜单"
            />
          </div>
        </section>

        {/* 链接按钮 (Fake Buttons) */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">链接按钮 (Fake Buttons)</h2>
          <div className="flex flex-wrap gap-4">
            <Button href="https://www.ebay.com" variant="primary">
              Primary Link
            </Button>
            <Button href="https://www.ebay.com" variant="secondary">
              Secondary Link
            </Button>
            <Button href="https://www.ebay.com" variant="tertiary">
              Tertiary Link
            </Button>
            <Button href="https://www.ebay.com" variant="destructive">
              Destructive Link
            </Button>
          </div>
        </section>

        {/* 状态 */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">按钮状态</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">正常状态</Button>
              <Button variant="primary" disabled>禁用状态</Button>
            </div>
            
            {/* Loading 状态 */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Loading 状态</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" loading>
                  Primary Loading
                </Button>
                <Button variant="secondary" loading>
                  Secondary Loading
                </Button>
                <Button variant="primary" loading size="large">
                  Large Primary Loading
                </Button>
                <Button variant="secondary" loading size="small">
                  Small Secondary Loading
                </Button>
              </div>
            </div>
            
            {/* Loading 状态 - 自定义文本 */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Loading 状态 - 自定义文本</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" loading>
                  处理中...
                </Button>
                <Button variant="secondary" loading>
                  正在加载...
                </Button>
                <Button variant="primary" loading size="large">
                  正在提交订单...
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* eBay 典型用法示例 */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">eBay 典型用法</h2>
          <div className="space-y-6">
            {/* 正常状态 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-md font-medium text-gray-700 mb-4">商品页面按钮</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="primary" 
                  size="large" 
                  className="flex-1"
                  icon={<ShoppingCart className="w-4 h-4" />}
                >
                  立即购买
                </Button>
                <Button 
                  variant="secondary" 
                  size="large" 
                  className="flex-1"
                >
                  加入购物车
                </Button>
                <Button 
                  variant="tertiary" 
                  size="large"
                  icon={<Heart className="w-4 h-4" />}
                >
                  收藏
                </Button>
              </div>
            </div>

            {/* Loading 状态示例 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-md font-medium text-gray-700 mb-4">处理中状态</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="primary" 
                  size="large" 
                  className="flex-1"
                  loading
                >
                  正在处理订单...
                </Button>
                <Button 
                  variant="secondary" 
                  size="large" 
                  className="flex-1"
                  loading
                >
                  添加到购物车中...
                </Button>
                <Button 
                  variant="tertiary" 
                  size="large"
                  disabled
                >
                  收藏
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 破坏性操作按钮组合 */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">破坏性操作按钮组合</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button variant="primary">确认</Button>
              <Button variant="secondary">取消</Button>
            </div>
            <div className="flex gap-2">
              <Button variant="destructive">删除项目</Button>
              <Button variant="tertiary">取消</Button>
            </div>
          </div>
        </section>

        {/* 表单按钮 */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">表单按钮</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="form">Form Button</Button>
            <Button variant="form" size="large">Large Form Button</Button>
            <Button variant="form" size="small">Small Form Button</Button>
          </div>
        </section>

        {/* 使用 asChild 的示例 */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">使用 asChild 的示例</h2>
          <div className="flex flex-wrap gap-4">
            <Button asChild variant="primary">
              <a href="/tree">查看 Domain Tree</a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/">返回首页</a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ButtonDemo; 