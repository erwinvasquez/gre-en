// En src/app/[locale]/test-css/page.tsx
"use client"

export default function TestCssPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Prueba de CSS</h1>
      <div className="navbar p-4 mb-4">
        Este div usa la clase navbar
      </div>
      <div style={{ fontSize: 'var(--navbar-font-size)' }} className="p-4 border">
        Este div usa directamente la variable --navbar-font-size
      </div>
    </div>
  )
}