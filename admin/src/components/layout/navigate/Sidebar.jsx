'use client';

import { useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { HiOutlineChevronRight, HiOutlineChevronDown } from 'react-icons/hi2';
import { LuLayoutDashboard, LuSofa } from 'react-icons/lu';
import { BsBoxSeam } from 'react-icons/bs';
import { PiTrashSimpleLight } from 'react-icons/pi';
import { useState } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';

const NAVIGATION_SECTIONS = [
  {
    type: 'item',
    label: 'Dashboard',
    href: '/dashboard',
    adminOnly: false,
    icon: LuLayoutDashboard
  },
  {
    type: 'section',
    title: 'Orders Management',
    icon: BsBoxSeam,
    items: [
      { label: 'Orders', href: '/dashboard/order-management/orders' },
      { label: 'Payment Methods', href: '/dashboard/order-management/payment-methods' },
    ]
  },
  {
    type: 'section',
    title: 'Products Management',
    icon: LuSofa,
    subsections: [
      {
        title: 'Product',
        items: [
          { label: 'All Products', href: '/dashboard/product-management/products' },
          { label: 'Categories', href: '/dashboard/product-management/categories' },
          { label: 'Collections', href: '/dashboard/product-management/collections' },
        ]
      },
      {
        title: 'Image',
        items: [
          { label: 'Collection Images', href: '/dashboard/image-management/collection-images' },
          { label: 'Product Images', href: '/dashboard/image-management/images' },
        ]
      },
      {
        title: 'Variant',
        items: [
          { label: 'Materials', href: '/dashboard/variant-management/materials' },
          { label: 'Fabric Types', href: '/dashboard/variant-management/fabric-types' },
          { label: 'Room Suitabilities', href: '/dashboard/variant-management/room-suitabilities' },
        ]
      },
    ]
  },
  {
    type: 'item',
    label: 'Restore',
    href: '/dashboard/restore',
    adminOnly: false,
    icon: PiTrashSimpleLight
  },
];

export function Sidebar({ onClose }) {
  const pathname = usePathname();
  const { user } = useSelector((state) => state.auth);
  const userRole = Array.isArray(user?.roles)
    ? user.roles[0]
    : user?.role;
  const isAdmin = userRole?.toLowerCase() === 'administrator' ;
  const [expandedSections, setExpandedSections] = useState(new Set(['Products']));
  const [expandedSubsections, setExpandedSubsections] = useState(new Set(['Product', 'Image', 'Variant']));

  const toggleSection = (title) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedSections(newExpanded);
  };

  const toggleSubsection = (subsectionTitle) => {
    const newExpanded = new Set(expandedSubsections);
    if (newExpanded.has(subsectionTitle)) {
      newExpanded.delete(subsectionTitle);
    } else {
      newExpanded.add(subsectionTitle);
    }
    setExpandedSubsections(newExpanded);
  };

  const isItemActive = (href) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside className="w-full h-full bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 lg:hidden">
        <h2 className="text-lg font-bold text-gray-900">Menu</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <HiOutlineXMark className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>

      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/magnula-logo.svg"
            alt="Magnula"
            width={150}
            height={40}
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
        {NAVIGATION_SECTIONS.map((section) => {
          const isDisabled = section.adminOnly && !isAdmin;

          if (section.type === 'item') {
            const isActive = isItemActive(section.href);
            const IconComponent = section.icon;
            return (
              <Link
                key={section.label}
                href={isDisabled ? '#' : section.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gray-100 text-black'
                    : 'text-gray-700 hover:bg-gray-50'
                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={(e) => isDisabled && e.preventDefault()}
                title={isDisabled ? 'Admin only' : ''}
              >
                {IconComponent && <IconComponent className="w-5 h-5 flex-shrink-0" />}
                {section.label}
              </Link>
            );
          }

          if (section.type === 'section') {
            if (isDisabled) return null;
            const isExpanded = expandedSections.has(section.title);

            const hasActiveItem = section.items
              ? section.items.some((item) => isItemActive(item.href))
              : section.subsections?.some((subsection) =>
                  subsection.items.some((item) => isItemActive(item.href))
                );

            return (
              <div key={section.title}>
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 transition-all"
                >
                  <span className="flex items-center gap-2">
                    {section.icon && <section.icon className="w-5 h-5" />}
                    {section.title}
                  </span>
                  {isExpanded ? (
                    <HiOutlineChevronDown className="w-4 h-4" />
                  ) : (
                    <HiOutlineChevronRight className="w-4 h-4" />
                  )}
                </button>

                {isExpanded && section.items && (
                  <div className="space-y-1 mt-2">
                    {section.items.map((item) => {
                      const isActive = isItemActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block px-4 py-2 rounded-md text-sm transition-all ${
                            isActive
                              ? 'bg-gray-100 text-black font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}

                {isExpanded && section.subsections && (
                  <div className="space-y-1 mt-2">
                    {section.subsections.map((subsection) => {
                      const isSubsectionExpanded = expandedSubsections.has(subsection.title);
                      return (
                        <div key={subsection.title}>
                          <button
                            onClick={() => toggleSubsection(subsection.title)}
                            className="w-full flex items-center justify-between px-4 py-2 rounded-md text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all uppercase"
                          >
                            <span>{subsection.title}</span>
                            {isSubsectionExpanded ? (
                              <HiOutlineChevronDown className="w-4 h-4" />
                            ) : (
                              <HiOutlineChevronRight className="w-4 h-4" />
                            )}
                          </button>
                          {isSubsectionExpanded && (
                            <div className="space-y-1 mt-1">
                              {subsection.items.map((item) => {
                                const isActive = isItemActive(item.href);
                                return (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`block px-4 py-2 rounded-md text-sm transition-all ${
                                      isActive
                                        ? 'bg-gray-100 text-black font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                  >
                                    {item.label}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
        })}
      </nav>

    </aside>
  );
}
