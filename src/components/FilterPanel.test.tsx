import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FilterPanel } from './FilterPanel';

// Mocking react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Retorna a própria chave para simplificar o teste
  }),
}));

describe('FilterPanel', () => {
  const mockDepartments = ['Compliance', 'HR', 'IT'];
  const mockOnDepartmentChange = vi.fn();
  const mockOnDayChange = vi.fn();
  const mockOnReset = vi.fn();

  const setup = () => {
    render(
      <FilterPanel
        departments={mockDepartments}
        selectedDepartment="all"
        onDepartmentChange={mockOnDepartmentChange}
        selectedDay="all"
        onDayChange={mockOnDayChange}
        onReset={mockOnReset}
      />
    );
  };

  it('should render the filter panel with default values', () => {
    setup();
    expect(screen.getByText('filters.title')).toBeInTheDocument();
    expect(screen.getByText('filters.department')).toBeInTheDocument();
    expect(screen.getByText('filters.day')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filters.reset/i })).toBeInTheDocument();
  });

  it('should call onDepartmentChange when a new department is selected', async () => {
    setup();
    const user = userEvent.setup();

    // O Testing Library pode não encontrar o trigger pelo texto exato por causa da estrutura do Select
    // então vamos pegar pelo role e depois abrir
    const departmentSelect = screen.getAllByRole('combobox')[0];
    await user.click(departmentSelect);

    // Agora que o dropdown está aberto, podemos encontrar o item pelo texto
    const departmentOption = await screen.findByText('Compliance');
    await user.click(departmentOption);

    expect(mockOnDepartmentChange).toHaveBeenCalledTimes(1);
    expect(mockOnDepartmentChange).toHaveBeenCalledWith('Compliance');
  });

  it('should call onDayChange when a new day is selected', async () => {
    setup();
    const user = userEvent.setup();

    const daySelect = screen.getAllByRole('combobox')[1];
    await user.click(daySelect);

    const dayOption = await screen.findByText('common.day1');
    await user.click(dayOption);

    expect(mockOnDayChange).toHaveBeenCalledTimes(1);
    expect(mockOnDayChange).toHaveBeenCalledWith('day1');
  });

  it('should call onReset when the reset button is clicked', async () => {
    setup();
    const user = userEvent.setup();

    const resetButton = screen.getByRole('button', { name: /filters.reset/i });
    await user.click(resetButton);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });
});
