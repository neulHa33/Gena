import React, { useMemo } from 'react';
import ChartRenderer from './ChartRenderer';

interface ChartPreviewProps {
  type: string;
  title: string;
  data: any;
  color?: string;
  loading?: boolean;
}

const ChartPreview = React.memo(({ type, title, data, color, loading }: ChartPreviewProps) => {
  // Memoize chart props to prevent unnecessary re-renders
  const chartProps = useMemo(() => ({
    type: type as any,
    title: title || "Preview",
    data,
    color,
  }), [type, data, color]); // title is intentionally excluded to prevent re-renders

  if (loading) {
    return (
      <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="mb-2 text-sm text-gray-500 font-medium">Chart Preview</div>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400">Loading preview...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="mb-2 text-sm text-gray-500 font-medium">Chart Preview</div>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400">No data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="mb-2 text-sm text-gray-500 font-medium">Chart Preview</div>
      <div className="h-64 overflow-hidden">
        <ChartRenderer {...chartProps} />
      </div>
    </div>
  );
});

ChartPreview.displayName = 'ChartPreview';

export default ChartPreview; 