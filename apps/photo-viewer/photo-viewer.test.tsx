/**
 * Unit tests for Photo Viewer component
 * Tests component initialization and state management
 */

import { render, screen } from '@testing-library/react'
import { PhotoViewer } from './photo-viewer'

describe('PhotoViewer Component', () => {
  it('should render the component', () => {
    render(<PhotoViewer appId="photo-viewer" />)
    expect(screen.getByText('Photo Viewer')).toBeInTheDocument()
  })

  it('should display view mode buttons', () => {
    render(<PhotoViewer appId="photo-viewer" />)
    expect(screen.getByText('Single')).toBeInTheDocument()
    expect(screen.getByText('Grid')).toBeInTheDocument()
    expect(screen.getByText('Slideshow')).toBeInTheDocument()
  })

  it('should display placeholder text when no media is loaded', () => {
    render(<PhotoViewer appId="photo-viewer" />)
    expect(screen.getByText('Select a folder to view media files')).toBeInTheDocument()
  })

  it('should have dark theme styling', () => {
    const { container } = render(<PhotoViewer appId="photo-viewer" />)
    const mainDiv = container.querySelector('.bg-\\[\\#1a1a1a\\]')
    expect(mainDiv).toBeInTheDocument()
  })
})
