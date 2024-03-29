import { Fragment, useState } from 'react'
import { useInfiniteQuery } from 'react-query'

// Lib
import { TwitterRes as TwitterResType } from 'lib/twitter'

// Primitives
import Section from 'components/layout/section'
import TextPrimitive from 'components/common/text'
import Box from 'components/common/box'
import Container from 'components/layout/container'
import NativeScrollContainer from 'components/common/native-scroll-container'
import { ArrowDown } from 'components/primitives/arrow'

// Local Components
import Feature from './feature'
import Release, { ReleaseProps } from './release'
import Tweet from './tweet'

// Styles
import { styled } from '../../../../stitches.config'
import { getHrefWithQuery } from 'lib/utils/router'

const SectionInner = styled('div', {
  background: '$black',
  border: '1px solid white',

  '@bp3': {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr'
  },
  length: 0
})

const Column = styled(NativeScrollContainer, {
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  padding: '42px 0',

  '@bp3': {
    maxHeight: 900,
    padding: '74px 40px',

    '&:not(:first-child)': {
      borderLeft: '1px solid $white'
    }
  },
  length: 0
})

export const Text = styled(TextPrimitive, {
  variants: {
    size: {
      xs: {
        fontSize: '$3'
      },
      md: {
        fontSize: '$6',
        letterSpacing: -1
      },
      lg: {
        fontSize: '$9'
      },
      xl: {
        fontSize: '$14',
        lineHeight: 1
      },
      icon: {
        fontSize: '$7'
      }
    }
  },
  length: 0
})

const SectionPicker = styled('div', {
  display: 'flex',
  alignItems: 'center',
  position: 'relative',

  select: {
    fontFamily: '$heading',
    flex: 1,
    // textTransform: 'uppercase',
    width: '100%',
    fontSize: '$6',
    padding: '15px 0',
    background: '$black',
    '-webkit-appearance': 'none'
  },

  // option: {
  //   textTransform: 'uppercase'
  // },
  svg: {
    position: 'absolute',
    right: 0
  },
  length: 0
})

const LoadMore = styled('button', {
  outline: 'none !important',
  display: 'flex',
  alignItems: 'center',
  transition: 'opacity .2s ease',
  fontSize: 14,

  '@bp2': {
    mt: 14,
    fontSize: 16
  },

  '&:disabled': {
    opacity: 0.5
  },
  length: 0
})

type DataColumnsProps = {
  tweets: TwitterResType | null
  releases: ReleaseProps[]
}

type Sections = 'releases' | 'features' | 'tweets'

const DataColumns = ({ tweets: initialTweets, releases }: DataColumnsProps) => {
  const {
    data: queriedTweets,
    fetchNextPage,
    hasNextPage,
    isFetching
  } = useInfiniteQuery(['tweets'], ({ pageParam }) => getTweets(pageParam), {
    enabled: !!initialTweets,
    refetchOnWindowFocus: false,
    initialData: {
      pageParams: [undefined],
      pages: [initialTweets]
    },
    getNextPageParam: (lastPage) => (lastPage ? lastPage.meta.next_token : null)
  })
  const [activeSection, setActiveSection] = useState<Sections>('releases')

  return (
    <Section
      // @ts-ignore
      background="black"
      noMargin
    >
      <Container
        // @ts-ignore
        maxWidth
      >
        <SectionInner
          css={{
            display: 'none',

            '@bp3': {
              display: 'grid'
            }
          }}
        >
          <Column>
            <Text css={{ fontSize: '$3' }}>o'zgarishlar</Text>
            <Text
              css={{ fontSize: '$7' }}
              // @ts-ignore
              heading
            >
              nashrlar tarixi
            </Text>
            <div>
              {releases.map(({ date, text, version }, idx) => (
                <Release version={version} date={date} text={text} key={idx} />
              ))}
            </div>
          </Column>
          <Column>
            <Text css={{ fontSize: '$3' }}>progreslar</Text>
            {/* @ts-ignore */}
            <Text css={{ fontSize: '$7' }} heading>
              hozirgi natijalar
            </Text>
            <div>
              <Feature title="kompilyator" score={2} />
              <Feature title="standart kutubxona" score={1} />
              <Feature title="bulut VM" score={4} />
              <Feature title="yordamchilar" score={4} />
            </div>
          </Column>
          <Column>
            <Text css={{ fontSize: '$3' }}>biz haqimizdagi</Text>
            {/* @ts-ignore */}
            <Text css={{ fontSize: '$7' }} heading>
              fikrlar
            </Text>
            <div>
              {queriedTweets?.pages?.map((page, pageIdx) => {
                if (!page) return null
                return (
                  <Fragment key={pageIdx}>
                    {page.data.map((tweet) => (
                      <Tweet tweet={tweet} key={tweet.id} />
                    ))}
                  </Fragment>
                )
              })}
              {hasNextPage && (
                <LoadMore onClick={() => fetchNextPage()} disabled={isFetching}>
                  {/* @ts-ignore */}
                  <Text uppercase heading>
                    Load more
                  </Text>
                  <ArrowDown
                    css={{
                      marginLeft: 8,
                      color: 'white',
                      path: { fill: 'white' },
                      $$size: '16px'
                    }}
                  />
                </LoadMore>
              )}
            </div>
          </Column>
        </SectionInner>
      </Container>
      <SectionInner
        css={{
          '@bp3': {
            display: 'none'
          }
        }}
      >
        <Box>
          <Container css={{ borderBottom: '1px solid $white' }}>
            <SectionPicker>
              <select
                onChange={(e) => {
                  setActiveSection(e.target.value as Sections)
                }}
              >
                {[
                  { key: 'releases', label: 'nashrlar tarixi' },
                  { key: 'features', label: 'hozirgi natijalar' },
                  { key: 'tweets', label: 'fikrlar' }
                ].map(({ key, label }) => (
                  <option value={key} key={key}>
                    {label}
                  </option>
                ))}
              </select>
              <svg
                width="20"
                height="13"
                viewBox="0 0 20 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1.5L10 10.5L19 1.5"
                  stroke="white"
                  strokeWidth="2.5"
                />
              </svg>
            </SectionPicker>
          </Container>
        </Box>
        <Container>
          <Column
            css={{ display: activeSection === 'releases' ? 'block' : 'none' }}
          >
            {releases.map(({ date, text, version }, idx) => (
              <Release version={version} date={date} text={text} key={idx} />
            ))}
          </Column>
          <Column
            css={{ display: activeSection === 'features' ? 'block' : 'none' }}
          >
            <Feature title="kompilyator" score={3} />
            <Feature title="standart kutubxona" score={1} />
            <Feature title="bulut VM" score={4} />
            <Feature title="yordamchilar" score={4} />
          </Column>
          <Column
            css={{ display: activeSection === 'tweets' ? 'block' : 'none' }}
          >
            {queriedTweets?.pages?.map((page, pageIdx) => {
              if (!page) return null
              return (
                <Fragment key={pageIdx}>
                  {page.data.map((tweet) => (
                    <Tweet tweet={tweet} key={tweet.id} />
                  ))}
                </Fragment>
              )
            })}
            {hasNextPage && (
              <LoadMore onClick={() => fetchNextPage()} disabled={isFetching}>
                {/* @ts-ignore */}
                <Text uppercase heading>
                  ko'proq yuklash
                </Text>
                <ArrowDown
                  css={{
                    marginLeft: 8,
                    color: 'white',
                    path: { fill: 'white' },
                    $$size: '16px'
                  }}
                />
              </LoadMore>
            )}
          </Column>
        </Container>
      </SectionInner>
    </Section>
  )
}

const getTweets = async (next_token?: string): Promise<TwitterResType> => {
  const url = getHrefWithQuery('/api/tweets', {
    next_token: next_token ?? null
  })

  return await (await fetch(url)).json()
}

export default DataColumns
