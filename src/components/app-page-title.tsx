import React from 'react'

type Props = {
  title: string,
  description?: string
}

const AppPageTitle = ({
  title,
  description
}: Props) => {
  return (
    <div className="mb-8">
      <h2 className="text-4xl font-bold text-text-foreground">
        {title}
      </h2>
      <p className="text-sm text-secondary mt-4">
        {description}
      </p>
    </div>
  )
}

export default AppPageTitle