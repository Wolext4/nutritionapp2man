export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-green-700 font-medium">Loading GluGuide...</p>
      </div>
    </div>
  )
}
