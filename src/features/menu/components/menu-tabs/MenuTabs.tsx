import { Hamburger, PlusCircle, Tag } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export type Tab = "products" | "additions" | "promotions";

type MenuTabsProps = {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
};

const tabs: { id: Tab; label: string; icon: typeof Hamburger }[] = [
  { id: "products", label: "Productos", icon: Hamburger },
  { id: "additions", label: "Toppings", icon: PlusCircle },
  { id: "promotions", label: "Promociones", icon: Tag },
];

export function MenuTabs({ activeTab, onChange }: MenuTabsProps) {
  return (
    <nav
      aria-label="Secciones del menú"
      className="sticky top-0 z-20 border-b border-border bg-background/95 py-2 backdrop-blur"
    >
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="mx-auto flex max-w-6xl gap-2 px-4 sm:px-6 lg:px-8"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`menu-tabpanel-${tab.id}`}
              id={`menu-tab-${tab.id}`}
              onClick={() => onChange(tab.id)}
              className={cn(
                "group inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-black transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex-initial sm:px-5 sm:py-3",
                isActive
                  ? "bg-primary text-primary-foreground shadow-elevated"
                  : "bg-surface text-muted-foreground hover:bg-surface-muted hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-4 transition-transform duration-200 group-hover:scale-110 sm:size-5",
                  isActive && "scale-110",
                )}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
