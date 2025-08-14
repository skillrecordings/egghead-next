import {
  formatContentAsPrompt,
  validateContentData,
  estimateContentSize,
} from '../format-content-as-prompt'

describe('formatContentAsPrompt', () => {
  it('formats a simple post correctly', () => {
    const content = {
      title: 'Test Post',
      description: 'A test description',
      transcript: 'Hello world transcript',
      contentType: 'post' as const,
    }

    const result = formatContentAsPrompt(content)

    expect(result).toContain('<content type="post">')
    expect(result).toContain('<title>Test Post</title>')
    expect(result).toContain('<description>A test description</description>')
    expect(result).toContain('<transcript>Hello world transcript</transcript>')
    expect(result).toContain('</content>')
  })

  it('formats a course with lessons correctly', () => {
    const content = {
      title: 'Test Course',
      description: 'A test course',
      contentType: 'course' as const,
      lessons: [
        {
          title: 'Lesson 1',
          description: 'First lesson',
          transcript: 'Lesson 1 transcript',
        },
        {
          title: 'Lesson 2',
          description: 'Second lesson',
          transcript: 'Lesson 2 transcript',
        },
      ],
    }

    const result = formatContentAsPrompt(content)

    expect(result).toContain('<content type="course">')
    expect(result).toContain('<lessons>')
    expect(result).toContain('<lesson>')
    expect(result).toContain('<title>Lesson 1</title>')
    expect(result).toContain('<title>Lesson 2</title>')
    expect(result).toContain('</lessons>')
  })

  it('escapes XML special characters', () => {
    const content = {
      title: 'Test & Title <with> "quotes"',
      description: 'Description with & symbols',
      contentType: 'post' as const,
    }

    const result = formatContentAsPrompt(content)

    expect(result).toContain('Test &amp; Title &lt;with&gt; &quot;quotes&quot;')
    expect(result).toContain('Description with &amp; symbols')
  })

  it('handles empty/null values gracefully', () => {
    const content = {
      title: 'Test Post',
      description: null,
      transcript: '',
      contentType: 'post' as const,
    }

    const result = formatContentAsPrompt(content)

    expect(result).toContain('<title>Test Post</title>')
    expect(result).not.toContain('<description>')
    expect(result).not.toContain('<transcript>')
  })
})

describe('validateContentData', () => {
  it('validates valid content', () => {
    const content = {
      title: 'Test',
      contentType: 'post' as const,
    }

    const result = validateContentData(content)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('validates course with lessons', () => {
    const content = {
      title: 'Test Course',
      contentType: 'course' as const,
      lessons: [{title: 'Lesson 1'}],
    }

    const result = validateContentData(content)
    expect(result.isValid).toBe(true)
  })

  it('rejects course without lessons', () => {
    const content = {
      title: 'Test Course',
      contentType: 'course' as const,
      lessons: [],
    }

    const result = validateContentData(content)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Course content must include lessons')
  })

  it('rejects content without title', () => {
    const content = {
      title: '',
      contentType: 'post' as const,
    }

    const result = validateContentData(content)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Title is required')
  })
})

describe('estimateContentSize', () => {
  it('estimates content size correctly', () => {
    const content = {
      title: 'Test',
      description: 'Description',
      contentType: 'post' as const,
    }

    const size = estimateContentSize(content)
    expect(size).toBeGreaterThan(0)
    expect(typeof size).toBe('number')
  })
})
