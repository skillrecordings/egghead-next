describe('podcast archive helpers', () => {
  it('loads a podcast from the local archive by slug', async () => {
    const {loadPodcast} = await import('../podcasts')

    const podcast = loadPodcast('jason-lengstorf-on-gatsbyjs')

    expect(podcast).toBeTruthy()
    expect(podcast?.title).toContain('Jason Lengstorf')
    expect(podcast?.path).toBe('/podcasts/jason-lengstorf-on-gatsbyjs')
  })

  it('returns six related podcast cards without the current podcast', async () => {
    const {loadPodcast, loadRelatedPodcasts} = await import('../podcasts')

    const currentPodcast = loadPodcast('jason-lengstorf-on-gatsbyjs')
    expect(currentPodcast).toBeTruthy()

    const related = loadRelatedPodcasts(currentPodcast!.id)

    expect(related).toHaveLength(6)
    expect(related.some((podcast) => podcast.id === currentPodcast!.id)).toBe(
      false,
    )
    expect(Object.keys(related[0]).sort()).toEqual([
      'contributors',
      'id',
      'image_url',
      'path',
      'title',
    ])
  })
})
