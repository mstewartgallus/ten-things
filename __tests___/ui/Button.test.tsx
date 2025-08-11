import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Button } from '@/ui';

describe('Button', () => {
    it('renders a button', () => {
        render(<Button />);

        const elem = screen.getByRole('button');

        expect(elem).toBeInTheDocument();
    });
})
