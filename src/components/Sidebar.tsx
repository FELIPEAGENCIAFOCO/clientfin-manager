import React from "react";
import { NavLink } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  PieChart, 
  GanttChartSquare,
  CalendarDays,
  FileSpreadsheet,
  Receipt
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 fixed top-0 left-0 h-full bg-sidebar border-r border-sidebar-border pt-16">
      <div className="py-4">
        <nav className="mt-5">
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  cn(
                    "flex items-center py-2 px-4 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )
                }
                end
              >
                <BarChart3 className="mr-3 h-5 w-5" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/clients"
                className={({ isActive }) =>
                  cn(
                    "flex items-center py-2 px-4 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )
                }
              >
                <Users className="mr-3 h-5 w-5" />
                <span>Clientes</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/crm"
                className={({ isActive }) =>
                  cn(
                    "flex items-center py-2 px-4 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )
                }
              >
                <PieChart className="mr-3 h-5 w-5" />
                <span>CRM</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/leads"
                className={({ isActive }) =>
                  cn(
                    "flex items-center py-2 px-4 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )
                }
              >
                <GanttChartSquare className="mr-3 h-5 w-5" />
                <span>Leads</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dre"
                className={({ isActive }) =>
                  cn(
                    "flex items-center py-2 px-4 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )
                }
              >
                <Receipt className="mr-3 h-5 w-5" />
                <span>DRE</span>
              </NavLink>
            </li>
            
            <li>
              <NavLink
                to="/calendar"
                className={({ isActive }) =>
                  cn(
                    "flex items-center py-2 px-4 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )
                }
              >
                <CalendarDays className="mr-3 h-5 w-5" />
                <span>Calendário</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/finances"
                className={({ isActive }) =>
                  cn(
                    "flex items-center py-2 px-4 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )
                }
              >
                <FileSpreadsheet className="mr-3 h-5 w-5" />
                <span>Financeiro</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
