"use client";

import { type MouseEvent, useCallback } from "react";

interface NavItem {
  id: string;
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "servicos", href: "#servicos", label: "Serviços" },
  { id: "como-funciona", href: "#como-funciona", label: "Como Funciona" },
  { id: "tecnologia-inovacao", href: "#tecnologia-inovacao", label: "Tecnologia" },
  { id: "galeria", href: "#galeria", label: "Galeria" },
  { id: "depoimentos", href: "#depoimentos", label: "Depoimentos" },
  { id: "equipe", href: "#equipe", label: "Equipe" },
  { id: "contato", href: "#contato", label: "Contato" },
];

export default function HeaderNav() {
  const handleNavClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, item: NavItem) => {
      const target = document.getElementById(item.id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      if (typeof history !== "undefined" && history.replaceState) {
        history.replaceState(null, "", item.href);
      }
    },
    [],
  );

  return (
    <nav
      className="mt-8 w-full max-w-3xl"
      aria-label="Navegação das seções"
    >
      <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              onClick={(e) => handleNavClick(e, item)}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 hover:bg-white text-[#0c3008] text-sm sm:text-base font-medium shadow-sm hover:shadow-md backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#4a6b3d] focus:ring-offset-2 focus:ring-offset-transparent"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
