import './Spinner.css';

export default function Spinner({ size = 40, center = false }) {
  return (
    <div className={`spinner-wrap ${center ? 'spinner-wrap--center' : ''}`}>
      <div
        className="spinner"
        style={{ width: size, height: size, borderWidth: size / 8 }}
      />
    </div>
  );
}
