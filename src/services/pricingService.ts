import { db } from './db';

export interface PriceCalculationInput {
  basePrice: number;
  quantity: number;
  isEmergency: boolean;
  needMaterials?: boolean;
  cooperativeId?: string;
}

export interface TransparentPricingResult {
  baseAmount: number;
  emergencyFee: number;
  partsEstimatedAmount: number;
  totalCustomerAmount: number;
  workerEarnings: number;
  welfareFund: number;
  platformCommission: number;
  taxGST: number;
  workerPercentage: number;
  welfarePercentage: number;
}

export const pricingService = {
  calculate(input: PriceCalculationInput): TransparentPricingResult {
    const rules = db.getCooperativeRules(input.cooperativeId);
    
    const qty = Math.max(1, input.quantity || 1);
    const baseAmount = input.basePrice * qty;
    const emergencyFee = input.isEmergency ? rules.emergencyPriorityFee : 0;
    const partsEstimatedAmount = 0; // Parts billed at actual MRP with attached vendor receipt

    const subtotal = baseAmount + emergencyFee + partsEstimatedAmount;

    // Split based on cooperative rules (95% to worker, 5% to welfare)
    const workerRatio = (rules.workerSharePercentage || 95) / 100;
    const workerEarnings = Math.round(subtotal * workerRatio);
    const welfareFund = subtotal - workerEarnings;
    const platformCommission = 0; // Cooperative model: ₹0 middleman cut
    const taxGST = Math.round(subtotal * 0.05); // 5% Government GST
    const totalCustomerAmount = subtotal + taxGST;

    return {
      baseAmount,
      emergencyFee,
      partsEstimatedAmount,
      totalCustomerAmount,
      workerEarnings,
      welfareFund,
      platformCommission,
      taxGST,
      workerPercentage: rules.workerSharePercentage,
      welfarePercentage: rules.welfareSharePercentage
    };
  }
};
