export function Story() {
  return (
    <section id="story" className="py-16 bg-orange-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Notre Histoire
          </h2>
          <div className="prose prose-lg mx-auto">
            <p className="mb-6">
              Tout a commencé dans notre cuisine familiale, où ma mère et moi partageons une passion pour la cuisine traditionnelle turque. Le lahmacun, cette fine galette croustillante garnie de viande hachée épicée, a toujours été notre spécialité.
            </p>
            <p className="mb-6">
              Chaque matin, nous sélectionnons soigneusement les ingrédients les plus frais : de la viande hachée de qualité, des tomates juteuses, des oignons, de l'ail frais, et nos mélanges d'épices secrets transmis de génération en génération.
            </p>
            <p>
              Notre lahmacun n'est pas seulement un repas, c'est un héritage familial que nous sommes fiers de partager avec vous. Chaque pièce est préparée à la main, avec amour et attention, pour vous offrir un véritable goût de la cuisine turque authentique.
            </p>
          </div>
        </div>
        <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="aspect-[4/3] rounded-xl overflow-hidden">
            <img 
              src="/lahmacun_prep.webp" 
              alt="Préparation du Lahmacun" 
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="aspect-[4/3] rounded-xl overflow-hidden">
            <img 
              src="/lahmacun_family.webp" 
              alt="Préparation du Lahmacun" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  )
} 