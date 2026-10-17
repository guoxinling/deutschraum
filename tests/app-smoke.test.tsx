import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { App } from '../src/App'

describe('App', () => {
  it('renders the app name and Today navigation', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /deutschraum/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /heute/i })).toBeInTheDocument()
  })
})
