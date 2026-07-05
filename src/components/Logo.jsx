// Vector recreation of the GP monogram logo (original was a raster draft):
// circular G with a top-right gap and crossbar, P-stem dropping through the ring.
export default function Logo(props) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="11" aria-hidden="true" {...props}>
      <path d="M 67 12.5 A 35 35 0 1 0 86 52" />
      <path d="M 52 52 H 86" />
      <path d="M 43 30 V 88" />
    </svg>
  )
}
