import { Button } from "@/components/ui/button"

export function Menu() {
  return (
    <section id="menu" className="py-16">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Notre Lahmacun
          </h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <img 
                src="/lahmacun_final.webp" 
                alt="Préparation du Lahmacun" 
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-semibold mb-4">
                Lahmacun Traditionnel
              </h3>
              <p className="text-gray-600 mb-6">
                Une fine galette croustillante garnie de viande hachée épicée, d'oignons, de tomates et d'herbes fraîches. 
                Servie avec du persil frais et des quartiers de citron.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-600">2€</span>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Commander
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-6 text-left">
            <div className="p-6 bg-orange-50 rounded-xl">
              <h3 className="font-semibold mb-2">Livraison à Domicile</h3>
              <p className="text-gray-600">
                Livraison rapide dans un rayon de 5km. Votre lahmacun arrive chaud et croustillant.
              </p>
            </div>
            <div className="p-6 bg-orange-50 rounded-xl">
              <h3 className="font-semibold mb-2">À Emporter</h3>
              <p className="text-gray-600">
                Passez votre commande et récupérez-la directement chez nous, fraîchement préparée.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 