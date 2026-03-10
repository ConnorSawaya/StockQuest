import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function SparkLine({ data, color = '#F97316', height = 40, width = 120 }) {
  const chartData = data.map((value, index) => ({ index, value }));
  const isUp = data[data.length - 1] >= data[0];

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={isUp ? '#10B981' : '#EF4444'}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function StockLineChart({ data, height = 300 }) {
  const chartData = data.map((value, index) => ({
    day: index,
    price: value,
  }));
  const isUp = data[data.length - 1] >= data[0];
  const color = isUp ? '#10B981' : '#EF4444';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.1} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="day"
          tick={{ fontSize: 12, fill: '#9CA3AF' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={['auto', 'auto']}
          tick={{ fontSize: 12, fill: '#9CA3AF' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${v}`}
          width={55}
        />
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: 'none',
            fontSize: '13px',
          }}
          formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
          labelFormatter={(label) => `Day ${label}`}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          fill="url(#stockGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function PortfolioChart({ data, height = 250 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F97316" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
        <YAxis
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${v}`}
          width={55}
        />
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: 'none',
            fontSize: '13px',
          }}
          formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Value']}
        />
        <Area type="monotone" dataKey="value" stroke="#F97316" strokeWidth={2} fill="url(#portGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
