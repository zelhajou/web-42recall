// app/components/dashboard/layout.tsx
'use client'

import { Fragment } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Menu, Transition } from '@headlessui/react'
import { 
  HomeIcon, 
  PlusCircleIcon, 
  BookOpenIcon, 
  Cog6ToothIcon, 
  BellIcon,
  ChevronDownIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Create Deck', href: '/dashboard/create', icon: PlusCircleIcon },
  { name: 'Study', href: '/dashboard/study', icon: BookOpenIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <Link href="/dashboard" className="flex ml-2 md:mr-24">
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-gray-800">
                  42Recall
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className="p-2 text-gray-500 rounded-lg hover:text-gray-700 hover:bg-gray-100"
              >
                <BellIcon className="w-6 h-6" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex items-center max-w-xs gap-2 p-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white">
                    {session?.user?.image ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={session.user.image}
                        alt=""
                      />
                    ) : (
                      <UserCircleIcon className="h-8 w-8 text-gray-400" />
                    )}
                    <span className="hidden md:block">{session?.user?.name}</span>
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
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
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className={clsx(
                            active ? 'bg-gray-100' : '',
                            'flex w-full items-center px-4 py-2 text-sm text-gray-700 gap-2'
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
        <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r border-gray-200">
          <ul className="space-y-2 font-medium">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={clsx(
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-md gap-2'
                    )}
                  >
                    <Icon
                      className={clsx(
                        isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-900',
                        'h-5 w-5 shrink-0'
                      )}
                    />
                    {item.name}
                  </Link>
                </li>
              )
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
  )
}