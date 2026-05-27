import {composeTagImageUrl} from '../compose-image-url'

describe('composeTagImageUrl', () => {
  test('builds CloudFront tag image URLs from a legacy id and filename', () => {
    expect(
      composeTagImageUrl({
        imageUrl: 'react.png',
        legacyId: 42,
        size: 'square_480',
      }),
    ).toBe(
      'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/042/square_480/react.png',
    )
  })

  test('rewrites existing CloudFront URLs to the requested size', () => {
    expect(
      composeTagImageUrl({
        imageUrl:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/042/thumb/react.png',
        legacyId: null,
        size: 'square_480',
      }),
    ).toBe(
      'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/042/square_480/react.png',
    )
  })

  test('passes through non-CloudFront absolute URLs', () => {
    expect(
      composeTagImageUrl({
        imageUrl: 'https://example.com/react.png',
        legacyId: 42,
      }),
    ).toBe('https://example.com/react.png')
  })

  test('returns null when a relative image has no legacy id', () => {
    expect(
      composeTagImageUrl({imageUrl: 'react.png', legacyId: null}),
    ).toBeNull()
  })
})
