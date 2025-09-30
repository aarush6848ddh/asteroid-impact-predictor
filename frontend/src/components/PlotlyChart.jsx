import React, { useEffect, useRef } from 'react';
import Plot from 'plotly.js-dist-min';

const PlotlyChart = ({ data, layout, config, style, className }) => {
  const plotRef = useRef(null);

  useEffect(() => {
    if (data && plotRef.current) {
      Plot.newPlot(plotRef.current, data, layout, {
        ...config,
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
        displaylogo: false
      });
    }

    // Cleanup function
    return () => {
      if (plotRef.current) {
        Plot.purge(plotRef.current);
      }
    };
  }, [data, layout, config]);

  return (
    <div 
      ref={plotRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        minHeight: '400px',
        ...style 
      }} 
      className={className}
    />
  );
};

export default PlotlyChart;
