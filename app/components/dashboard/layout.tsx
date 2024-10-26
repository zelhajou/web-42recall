'use client';

import { Fragment } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import { 
  HomeIcon, 
  PlusCircleIcon, 
  BookOpenIcon, 
  Cog6ToothIcon,
  BellIcon,
  ChevronDownIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  GlobeAltIcon,
  RectangleStackIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { ThemeToggle } from '@/components/theme-toggle';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'My Decks', href: '/dashboard/decks', icon: RectangleStackIcon },
  { name: 'Study', href: '/dashboard/study', icon: BookOpenIcon },
  { name: 'Explore', href: '/dashboard/explore', icon: GlobeAltIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <Link href="/dashboard" className="flex ml-2 md:mr-24">
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-foreground">
                  42Recall
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex items-center max-w-xs gap-2 p-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    {session?.user?.image ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={session.user.image}
                        alt=""
                      />
                    ) : (
                      <UserCircleIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                    <span className="hidden md:block text-foreground">
                      {session?.user?.name}
                    </span>
                    <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-popover border shadow-md focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className={clsx(
                            active ? 'bg-muted' : '',
                            'flex w-full items-center px-4 py-2 text-sm text-foreground gap-2'
                          )}
                        >
                          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed top-[3.75rem] left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
        <div className="h-full px-3 py-4 overflow-y-auto bg-card border-r border-border">
          <ul className="space-y-2 font-medium">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={clsx(
                      isActive
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-md gap-2'
                    )}
                  >
                    <Icon
                      className={clsx(
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground group-hover:text-foreground',
                        'h-5 w-5 shrink-0'
                      )}
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="p-4 sm:ml-64 mt-14">
        <div className="p-4 rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
}