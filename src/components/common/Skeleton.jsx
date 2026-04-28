import './Skeleton.css';

export function Skeleton({ width = '100%', height = '16px', borderRadius = '8px', style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius, ...style }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="skeleton-card">
      <Skeleton height="200px" borderRadius="12px 12px 0 0" />
      <div style={{ padding: '12px' }}>
        <Skeleton height="14px" style={{ marginBottom: '8px' }} />
        <Skeleton width="60%" height="14px" style={{ marginBottom: '8px' }} />
        <Skeleton width="40%" height="20px" />
      </div>
      <div style={{ padding: '0 12px 12px' }}>
        <Skeleton height="38px" borderRadius="8px" />
      </div>
    </div>
  );
}
