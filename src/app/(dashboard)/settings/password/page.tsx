import AppPageTitle from '@/components/app-page-title'
import AppSectionContainer from '@/components/app-section-container'
import AppSectionHeroContainer from '@/components/app-section-hero-container'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Pickaxe } from 'lucide-react'
import React from 'react'

export default function SettingsPasswordPage() {
  return (
    <div>
      <AppSectionHeroContainer>
        <Breadcrumb className='mb-4'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/settings'>Settings</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='text-text-foreground'>
                Password
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <AppPageTitle
          title="Password"
          description='Manage your app passwords'
        />
      </AppSectionHeroContainer>
      <AppSectionContainer>
        <div className="flex gap-2 items-center">
          <Pickaxe className="size-4"/>
          <span className="text-text">Coming Soon</span>
        </div>
      </AppSectionContainer>
    </div>
  )
}
