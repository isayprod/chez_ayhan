'use client';

export function Hero() {
  return (
    <section id="main" className="pt-24 pb-12 md:pt-32 md:pb-20">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-8 text-4xl md:text-6xl font-bold tracking-tighter">
            Découvrez le Véritable{" "}
            <span className="text-orange-600">Lahmacun Fait Maison</span>
          </h1>
          <p className="mb-8 text-lg md:text-xl text-gray-600">
            Une recette familiale authentique, préparée avec amour par une mère et son fils. 
            Ingrédients frais, pâte croustillante, et saveurs traditionnelles livrées chez vous.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="#order" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-lg">
              Commander - 2€ par Lahmacun
            </a>
            <a href="#story" className="border border-orange-600 text-orange-600 hover:text-orange-700 hover:border-orange-700 px-4 py-2 rounded text-lg">
              En Savoir Plus
            </a>
          </div>
        </div>
        <div className="mt-16 aspect-[16/9] max-w-3xl mx-auto rounded-xl overflow-hidden">
              <img 
                src="/lahmacun_hero.webp" 
                alt="Préparation du Lahmacun" 
                className="w-full h-full object-cover object-center"
              />
            </div>
      </div>
    </section>
  );
}
