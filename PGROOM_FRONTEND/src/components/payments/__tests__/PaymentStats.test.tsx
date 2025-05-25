/**
 * PaymentStats Component Tests
 * 
 * Tests for the enhanced PaymentStats component with animations
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { PaymentStats } from '../PaymentStats';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

const mockStats = {
  totalPayments: 150,
  totalAmount: 125000,
  successfulPayments: 140,
  pendingPayments: 8,
  failedPayments: 2,
  refundedPayments: 5,
  successRate: 93.3,
  currency: 'INR'
};

describe('PaymentStats Component', () => {
  it('renders stats correctly', () => {
    render(<PaymentStats stats={mockStats} isLoading={false} />);
    
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('Total Payments')).toBeInTheDocument();
    expect(screen.getByText('Success Rate')).toBeInTheDocument();
    expect(screen.getByText('Pending Payments')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<PaymentStats stats={null} isLoading={true} />);
    
    expect(screen.getByText('Loading payments...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(<PaymentStats stats={null} isLoading={false} error="Failed to load" />);
    
    expect(screen.getByText('No payment data available')).toBeInTheDocument();
  });

  it('formats currency correctly', () => {
    render(<PaymentStats stats={mockStats} isLoading={false} />);
    
    // Check if currency is formatted (should contain ₹ symbol)
    expect(screen.getByText(/₹/)).toBeInTheDocument();
  });

  it('displays success rate as percentage', () => {
    render(<PaymentStats stats={mockStats} isLoading={false} />);
    
    expect(screen.getByText('93.3%')).toBeInTheDocument();
  });
});
