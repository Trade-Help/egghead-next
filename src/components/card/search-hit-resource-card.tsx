import * as React from 'react'
import {
  Card,
  CardPreview,
  CardHeader,
  CardContent,
  CardBody,
  CardAuthor,
  CardFooter,
} from './index'
import Image from 'next/image'
import Link from 'next/link'
import {track} from 'utils/analytics'
import {get, isEmpty} from 'lodash'
import {CardResource} from 'types'
import {Textfit} from 'react-textfit'
import ReactMarkdown from 'react-markdown'

const SearchHitResourceCard: React.FC<{
  resource: CardResource
  location?: string
  describe?: boolean
  className?: string
  small?: boolean
}> = ({
  children,
  resource,
  location,
  className = '',
  describe = true,
  small = false,
  ...props
}) => {
  if (isEmpty(resource)) return null
  const defaultClassName =
    'rounded-md sm:aspect-w-4 sm:aspect-h-2 aspect-w-3 aspect-h-1 w-full h-full transition-all ease-in-out duration-200 relative overflow-hidden group dark:bg-gray-800 bg-white dark:bg-opacity-60 shadow-smooth dark:hover:bg-gray-700 dark:hover:bg-opacity-50'

  small = get(resource.image, 'src', resource.image)?.includes('/tags') ?? true

  return (
    <ResourceLink
      path={resource.path}
      location={location}
      className={className}
    >
      <Card {...props} resource={resource} className={defaultClassName}>
        <CardContent className="flex items-center sm:space-x-5 space-x-3 sm:px-5 px-3 py-2 w-full">
          {resource.image && (
            <CardHeader
              className={`flex items-center justify-center flex-shrink-0`}
            >
              <PreviewImage
                small={small}
                name={resource.name}
                image={resource.image}
                title={resource.title}
              />
            </CardHeader>
          )}
          <CardBody className={``}>
            {resource.name && (
              <p
                aria-hidden
                className="uppercase font-medium sm:text-[0.65rem] text-[0.55rem] pb-1 text-gray-700 dark:text-indigo-100 opacity-60"
              >
                {resource.name}
              </p>
            )}
            <Textfit
              mode="multi"
              className="lg:h-[60px] md:h-[55px] sm:h-[50px] h-[36px] font-medium leading-tight flex items-center"
              max={18}
            >
              <h3>{resource.title}</h3>
            </Textfit>
            {resource.description && describe && (
              <ReactMarkdown className="py-2 prose dark:prose-dark prose-sm dark:text-gray-300 text-gray-700">
                {resource.description}
              </ReactMarkdown>
            )}
            <CardFooter>
              <CardAuthor className="flex items-center pt-2" />
            </CardFooter>
          </CardBody>
        </CardContent>
        {children}
      </Card>
    </ResourceLink>
  )
}

export const ResourceLink: React.FC<{
  path: string
  location?: string
  className?: string
  linkType?: string
}> = ({children, path, location, linkType = 'text', ...props}) => (
  <Link href={path}>
    <a
      onClick={() => {
        track('clicked resource', {
          resource: path,
          linkType,
          location,
        })
      }}
      {...props}
    >
      {children}
    </a>
  </Link>
)

const PreviewImage: React.FC<{
  title: string
  image: any
  name: string
  small: boolean
}> = ({image, name, small}) => {
  if (!image) return null

  const size = small ? 40 : 85

  return (
    <CardPreview className="relative flex items-center justify-center sm:w-full w-16 ">
      <Image
        aria-hidden
        src={get(image, 'src', image)}
        width={size}
        height={size}
        quality={100}
        alt=""
      />
    </CardPreview>
  )
}
export {SearchHitResourceCard}
