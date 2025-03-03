'use client';

export function Footer() {
  return (
    <footer className="py-8 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-orange-600">Chez Maman</h3>
            <p className="text-gray-600 mt-2">Lahmacun Fait Maison</p>
          </div>
          <div className="space-y-2 text-gray-600">
            <p>📍 Dampremy, Belgique</p>
            <p>📱+32 493 60 67 13</p>
            <p>⏰ Les Mardi et Samedi : 9h00 - 18h00</p>
          </div>
          <div className="mt-8 text-sm text-gray-500">
            © {new Date().getFullYear()} Chez Maman. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
}
