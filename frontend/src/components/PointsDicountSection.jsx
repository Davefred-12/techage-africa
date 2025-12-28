// ============================================
// FILE: src/components/PointsDiscountSection.jsx
// CREATE THIS FILE IN YOUR PROJECT
// ============================================
import { useMemo } from 'react';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Coins, Sparkles, Info } from 'lucide-react';

const PointsDiscountSection = ({ 
  coursePrice, 
  userPoints, 
  onUsePoints, 
  usePoints 
}) => {
  const { pointsToUse, savings, finalPrice } = useMemo(() => {
    if (usePoints && userPoints > 0) {
      const maxDiscount = Math.min(userPoints, coursePrice);
      return {
        pointsToUse: maxDiscount,
        savings: maxDiscount,
        finalPrice: coursePrice - maxDiscount
      };
    } else {
      return {
        pointsToUse: 0,
        savings: 0,
        finalPrice: coursePrice
      };
    }
  }, [usePoints, userPoints, coursePrice]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  if (userPoints === 0) {
    return null;
  }

  return (
    <div className="space-y-4 py-4 border-y">
      {/* Points Available Banner */}
      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Coins className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-semibold">Available Points</p>
              <p className="text-xs text-muted-foreground">1 point = ₦1</p>
            </div>
          </div>
          <Badge className="text-lg font-bold px-3 py-1">
            {userPoints.toLocaleString()}
          </Badge>
        </div>

        {/* Use Points Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <Checkbox
            checked={usePoints}
            onCheckedChange={onUsePoints}
            className="mt-1"
          />
          <div className="flex-1">
            <p className="text-sm font-medium group-hover:text-primary-600 transition-colors">
              Use my points for this purchase
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Apply {pointsToUse > 0 ? formatCurrency(pointsToUse) : 'available points'} as discount
            </p>
          </div>
        </label>
      </div>

      {/* Discount Breakdown */}
      {usePoints && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Original Price:</span>
            <span className="font-medium line-through text-muted-foreground">
              {formatCurrency(coursePrice)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-accent-600 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Points Discount:
            </span>
            <span className="text-accent-600 font-semibold">
              - {formatCurrency(savings)}
            </span>
          </div>
          <div className="flex justify-between text-base pt-2 border-t">
            <span className="font-semibold">Final Price:</span>
            <span className="text-xl font-bold text-primary-600">
              {finalPrice === 0 ? 'FREE' : formatCurrency(finalPrice)}
            </span>
          </div>

          {/* Info Message */}
          <div className="flex items-start gap-2 p-3 bg-accent-50 dark:bg-accent-900/20 rounded-lg border border-accent-200 dark:border-accent-800">
            <Info className="w-4 h-4 text-accent-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              {finalPrice === 0 
                ? `You'll enroll immediately using ${pointsToUse.toLocaleString()} points. No payment needed!`
                : `${pointsToUse.toLocaleString()} points will be deducted after successful payment.`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsDiscountSection;