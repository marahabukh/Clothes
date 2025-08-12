"use client"

import { useState } from "react"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  LayoutDashboard,
  Package,
  List,
  Layers,
  User,
  ShoppingCart,
  Tag,
  MessageCircle,
} from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import CategoriesDashboard from "./categories"
import ProductsDashboard from "./ProductsDashboard"
import HeroDashboard from "./HeroDash"
import HeroDash from "./HeroDash"

// هنا استورد باقي الصفحات التي تريد عرضها مثل DashboardPage, ProductsPage, etc.
// على سبيل المثال:
// import DashboardPage from "./dashboard"
// import ProductsPage from "./products"

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  // صحح الخطأ الإملائي
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")

  // قم بتوسيع الدالة لعرض المحتوى حسب القسم المختار
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <div>Dashboard Content</div>
        // أو <DashboardPage /> لو موجودة لديك
      case "products":
        return <ProductsDashboard/>
      case "categories":
        return <CategoriesDashboard />
      case "hero":
        return <HeroDash/>
      case "users":
        return <div>Users Content</div>
      case "orders":
        return <div>Orders Content</div>
      case "discounts":
        return <div>Discount Codes Content</div>
      case "chat":

      default:
        return <div>Select a section</div>
    }
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen">
        <motion.div
          initial={false}
          animate={{ width: isCollapsed ? 80 : 240 }}
          className={cn(
            "relative flex h-screen flex-col border-r bg-background p-4",
            className
          )}
        >
          <div className="flex items-center justify-between">
            {!isCollapsed && <h2 className="text-lg font-semibold">Admin</h2>}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
          <nav className="mt-8 flex flex-col space-y-2">
            {/* اضبط الـ activeSection وحافظ على الحروف صغيرة */}
            <SidebarItem
              icon={LayoutDashboard}
              title="Dashboard"
              isActive={activeSection === "dashboard"}
              onClick={() => setActiveSection("dashboard")}
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              icon={Package}
              title="Products"
              isActive={activeSection === "products"}
              onClick={() => setActiveSection("products")}
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              icon={List}
              title="Categories"
              isActive={activeSection === "categories"}
              onClick={() => setActiveSection("categories")}
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              icon={Layers}
              title="Hero"
              isActive={activeSection === "hero"}
              onClick={() => setActiveSection("hero")}
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              icon={User}
              title="Users"
              isActive={activeSection === "users"}
              onClick={() => setActiveSection("users")}
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              icon={ShoppingCart}
              title="Orders"
              isActive={activeSection === "orders"}
              onClick={() => setActiveSection("orders")}
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              icon={Tag}
              title="Discounts Codes"
              isActive={activeSection === "discounts"}
              onClick={() => setActiveSection("discounts")}
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              icon={MessageCircle}
              title="Chat"
              isActive={activeSection === "chat"}
              onClick={() => setActiveSection("chat")}
              isCollapsed={isCollapsed}
            />
          </nav>
        </motion.div>
        <main className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>
    </TooltipProvider>
  )
}

interface SidebarItemProps {
  icon: React.ElementType
  title: string
  isActive: boolean
  onClick: () => void
  isCollapsed: boolean
}

function SidebarItem({ icon: Icon, title, isActive, onClick, isCollapsed }: SidebarItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "flex items-center rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800",
            isActive ? "bg-gray-100 dark:bg-gray-800" : "",
            isCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <Icon className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">{title}</span>}
        </button>
      </TooltipTrigger>
      {isCollapsed && <TooltipContent side="right">{title}</TooltipContent>}
    </Tooltip>
  )
}
