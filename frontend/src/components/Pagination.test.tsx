import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('shows a 1-based "page X of Y" indicator', () => {
    render(<Pagination page={0} totalPages={3} onChange={() => {}} />)
    expect(screen.getByText('Página 1 de 3')).toBeInTheDocument()
  })

  it('disables "previous" on the first page and advances on "next"', async () => {
    const onChange = vi.fn()
    render(<Pagination page={0} totalPages={3} onChange={onChange} />)

    expect(screen.getByRole('button', { name: /anterior/i })).toBeDisabled()

    await userEvent.click(screen.getByRole('button', { name: /próxima/i }))
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('disables "next" on the last page and goes back on "previous"', async () => {
    const onChange = vi.fn()
    render(<Pagination page={2} totalPages={3} onChange={onChange} />)

    expect(screen.getByRole('button', { name: /próxima/i })).toBeDisabled()

    await userEvent.click(screen.getByRole('button', { name: /anterior/i }))
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('renders nothing when there is a single page', () => {
    const { container } = render(
      <Pagination page={0} totalPages={1} onChange={() => {}} />,
    )
    expect(container).toBeEmptyDOMElement()
  })
})
